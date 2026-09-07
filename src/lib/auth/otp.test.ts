import assert from "node:assert/strict";
import { test } from "node:test";

import {
  __resetOtpMemoryStoreForTests,
  checkOtpSendRateLimit,
  issueOtpCode,
  timingSafeEqualStrings,
  verifyOtpCode,
} from "./otp";

function withEnv<T = void>(overrides: Record<string, string | undefined>, fn: () => T | Promise<T>) {
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

test.beforeEach(() => {
  __resetOtpMemoryStoreForTests();
});

test("issueOtpCode + verifyOtpCode: correct code verifies successfully", async () => {
  const { code } = await issueOtpCode("user@example.com", "login");
  const result = await verifyOtpCode("user@example.com", code, "login");
  assert.equal(result, "ok");
});

test("verifyOtpCode: wrong code is rejected as invalid", async () => {
  const { code } = await issueOtpCode("user@example.com", "login");
  const digits = code.split("").map((d) => (Number(d) + 1) % 10);
  const wrongCode = digits.join("");
  const result = await verifyOtpCode("user@example.com", wrongCode, "login");
  assert.equal(result, "invalid");
});

test("verifyOtpCode: code is single-use (cannot be verified twice)", async () => {
  const { code } = await issueOtpCode("user@example.com", "login");
  const first = await verifyOtpCode("user@example.com", code, "login");
  const second = await verifyOtpCode("user@example.com", code, "login");
  assert.equal(first, "ok");
  assert.equal(second, "invalid");
});

test("verifyOtpCode: unknown email/no issued code returns invalid", async () => {
  const result = await verifyOtpCode("never-issued@example.com", "123456", "login");
  assert.equal(result, "invalid");
});

test("verifyOtpCode: exceeding max attempts locks out further verification", async () => {
  await issueOtpCode("user@example.com", "login");
  for (let i = 0; i < 5; i += 1) {
    const attempt = await verifyOtpCode("user@example.com", "999999", "login");
    assert.equal(attempt, "invalid");
  }
  const lockedOut = await verifyOtpCode("user@example.com", "999999", "login");
  assert.equal(lockedOut, "too_many_attempts");
});

test("issueOtpCode: reissuing invalidates the previous code", async () => {
  const first = await issueOtpCode("user@example.com", "login");
  await issueOtpCode("user@example.com", "login");
  const result = await verifyOtpCode("user@example.com", first.code, "login");
  assert.equal(result, "invalid");
});

test("issueOtpCode: different emails/purposes do not collide", async () => {
  const a = await issueOtpCode("a@example.com", "login");
  const b = await issueOtpCode("b@example.com", "login");
  assert.equal(await verifyOtpCode("a@example.com", b.code, "login"), "invalid");
  assert.equal(await verifyOtpCode("a@example.com", a.code, "login"), "ok");
});

test("timingSafeEqualStrings: matches equal strings and rejects differing ones regardless of length", () => {
  assert.equal(timingSafeEqualStrings("secret", "secret"), true);
  assert.equal(timingSafeEqualStrings("secret", "not-secret-and-longer"), false);
  assert.equal(timingSafeEqualStrings("", "a"), false);
});

test("checkOtpSendRateLimit: allows sends under the limit and blocks beyond it", async () => {
  await withEnv({ DATABASE_URL: undefined }, async () => {
    const email = "rate-limited@example.com";
    const now = Date.now();
    const first = await checkOtpSendRateLimit(email, now);
    const second = await checkOtpSendRateLimit(email, now);
    const third = await checkOtpSendRateLimit(email, now);
    const fourth = await checkOtpSendRateLimit(email, now);

    assert.equal(first.allowed, true);
    assert.equal(second.allowed, true);
    assert.equal(third.allowed, true);
    assert.equal(fourth.allowed, false);
    assert.ok(fourth.retryAfterSeconds > 0);
  });
});
