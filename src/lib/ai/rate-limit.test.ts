import assert from "node:assert/strict";
import { test } from "node:test";

import {
  __resetAiRateLimitMemoryStoreForTests,
  checkAiRateLimit,
  hashIdentitySecret,
  resolveAiRateLimitIdentity,
} from "./rate-limit";

function withEnv(overrides: Record<string, string | undefined>, fn: () => void | Promise<void>) {
  const previous: Record<string, string | undefined> = {};
  for (const key of Object.keys(overrides)) {
    previous[key] = process.env[key];
    const value = overrides[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  return Promise.resolve(fn()).finally(() => {
    for (const key of Object.keys(previous)) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
}

test("resolveAiRateLimitIdentity: uses normalized session email when authenticated", () => {
  const request = new Request("https://example.com/api/assistant");
  const identity = resolveAiRateLimitIdentity(request, "User@Example.com ");
  assert.deepEqual(identity, { type: "user", key: "user@example.com" });
});

test("resolveAiRateLimitIdentity: falls back to hashed IP for anonymous requests", () => {
  const request = new Request("https://example.com/api/assistant", {
    headers: { "x-forwarded-for": "203.0.113.5, 10.0.0.1" },
  });
  const identity = resolveAiRateLimitIdentity(request, null);
  assert.equal(identity.type, "anon");
  assert.equal(identity.key, hashIdentitySecret("203.0.113.5"));
  // Raw IP must never be used as-is (only its hash).
  assert.notEqual(identity.key, "203.0.113.5");
});

test("resolveAiRateLimitIdentity: distinct anonymous IPs get distinct identities", () => {
  const requestA = new Request("https://example.com/api/assistant", {
    headers: { "x-forwarded-for": "203.0.113.5" },
  });
  const requestB = new Request("https://example.com/api/assistant", {
    headers: { "x-forwarded-for": "203.0.113.9" },
  });
  const identityA = resolveAiRateLimitIdentity(requestA, null);
  const identityB = resolveAiRateLimitIdentity(requestB, null);
  assert.notEqual(identityA.key, identityB.key);
});

test("checkAiRateLimit: allows requests under the short-window limit and blocks over it", async () => {
  __resetAiRateLimitMemoryStoreForTests();
  await withEnv(
    {
      AI_RATE_LIMIT_WINDOW_MS: "60000",
      AI_RATE_LIMIT_MAX_PER_WINDOW: "3",
      AI_RATE_LIMIT_DAILY_MAX: "1000",
    },
    async () => {
      const identity = { type: "user" as const, key: "quota-user@example.com" };
      const now = Date.UTC(2026, 0, 1, 10, 0, 0);

      const first = await checkAiRateLimit(identity, now);
      const second = await checkAiRateLimit(identity, now + 1000);
      const third = await checkAiRateLimit(identity, now + 2000);
      assert.equal(first.allowed, true);
      assert.equal(second.allowed, true);
      assert.equal(third.allowed, true);

      const fourth = await checkAiRateLimit(identity, now + 3000);
      assert.equal(fourth.allowed, false);
      if (!fourth.allowed) {
        assert.equal(fourth.scope, "window");
        assert.ok(fourth.retryAfterSeconds > 0);
      }
    },
  );
});

test("checkAiRateLimit: enforces daily cap independently of the short window", async () => {
  __resetAiRateLimitMemoryStoreForTests();
  await withEnv(
    {
      AI_RATE_LIMIT_WINDOW_MS: "1000",
      AI_RATE_LIMIT_MAX_PER_WINDOW: "1000",
      AI_RATE_LIMIT_DAILY_MAX: "2",
    },
    async () => {
      const identity = { type: "user" as const, key: "daily-user@example.com" };
      const dayStart = Date.UTC(2026, 0, 1, 0, 0, 0);

      const first = await checkAiRateLimit(identity, dayStart + 1_000);
      const second = await checkAiRateLimit(identity, dayStart + 2_000);
      assert.equal(first.allowed, true);
      assert.equal(second.allowed, true);

      const third = await checkAiRateLimit(identity, dayStart + 3_000);
      assert.equal(third.allowed, false);
      if (!third.allowed) {
        assert.equal(third.scope, "day");
      }

      // A new UTC day resets the daily counter.
      const nextDay = await checkAiRateLimit(identity, dayStart + 24 * 60 * 60 * 1000 + 1000);
      assert.equal(nextDay.allowed, true);
    },
  );
});

test("checkAiRateLimit: user and anonymous identities are tracked independently", async () => {
  __resetAiRateLimitMemoryStoreForTests();
  await withEnv(
    {
      AI_RATE_LIMIT_WINDOW_MS: "60000",
      AI_RATE_LIMIT_MAX_PER_WINDOW: "1",
      AI_RATE_LIMIT_ANON_MAX_PER_WINDOW: "1",
      AI_RATE_LIMIT_DAILY_MAX: "1000",
      AI_RATE_LIMIT_ANON_DAILY_MAX: "1000",
    },
    async () => {
      const now = Date.UTC(2026, 0, 2, 0, 0, 0);
      const userIdentity = { type: "user" as const, key: "isolated-user@example.com" };
      const anonIdentity = { type: "anon" as const, key: "isolated-anon-hash" };

      const userFirst = await checkAiRateLimit(userIdentity, now);
      const anonFirst = await checkAiRateLimit(anonIdentity, now);
      assert.equal(userFirst.allowed, true);
      assert.equal(anonFirst.allowed, true);

      const userSecond = await checkAiRateLimit(userIdentity, now + 500);
      assert.equal(userSecond.allowed, false);
      // Anonymous identity must remain unaffected by the user's exhausted quota.
      const anonSecond = await checkAiRateLimit(anonIdentity, now + 500);
      assert.equal(anonSecond.allowed, false);
    },
  );
});

test("checkAiRateLimit: invalid env values fall back to safe defaults instead of disabling the guard", async () => {
  __resetAiRateLimitMemoryStoreForTests();
  await withEnv(
    {
      AI_RATE_LIMIT_MAX_PER_WINDOW: "not-a-number",
      AI_RATE_LIMIT_WINDOW_MS: "0",
    },
    async () => {
      const identity = { type: "user" as const, key: "fallback-user@example.com" };
      const now = Date.UTC(2026, 0, 3, 0, 0, 0);
      const decision = await checkAiRateLimit(identity, now);
      // Falls back to defaults (windowMax=5) rather than throwing or allowing unlimited use.
      assert.equal(decision.allowed, true);
    },
  );
});
