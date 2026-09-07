import assert from "node:assert/strict";
import { test } from "node:test";

import { runConfigPreflight } from "./preflight";

function withEnv<T = void>(overrides: Record<string, string | undefined>, fn: () => T): T {
  const previous: Record<string, string | undefined> = {};
  for (const key of Object.keys(overrides)) {
    previous[key] = process.env[key];
    const value = overrides[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return fn();
  } finally {
    for (const key of Object.keys(previous)) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

const SAFE_ENV = {
  NODE_ENV: "production",
  SESSION_SECRET: "a".repeat(64),
  ADMIN_EMAILS: "ops@acme-example-corp.com",
  RATE_LIMIT_HASH_SECRET: "b".repeat(64),
  OPENAI_API_KEY: "sk-live-example",
  ANTHROPIC_API_KEY: undefined,
  GOOGLE_GENERATIVE_AI_API_KEY: undefined,
  DATABASE_URL: "postgres://user:pass@host:5432/db",
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: "587",
  SMTP_USER: "ops@acme-example-corp.com",
  SMTP_PASS: "example-app-password",
  ADMIN_PASSWORD: "c".repeat(32),
};

test("runConfigPreflight: fully safe production config yields no findings", () => {
  withEnv(SAFE_ENV, () => {
    const report = runConfigPreflight();
    assert.deepEqual(report.findings, []);
    assert.equal(report.hasBlockingIssues, false);
    assert.equal(report.isProduction, true);
  });
});

test("runConfigPreflight: detects SESSION_SECRET placeholder value as blocking in production", () => {
  withEnv({ ...SAFE_ENV, SESSION_SECRET: "dev-secret-change-in-production" }, () => {
    const report = runConfigPreflight();
    const finding = report.findings.find((f) => f.key === "SESSION_SECRET");
    assert.ok(finding);
    assert.equal(finding?.issueType, "placeholder-value");
    assert.equal(finding?.severity, "blocking");
    assert.equal(report.hasBlockingIssues, true);
  });
});

test("runConfigPreflight: detects README-style placeholder SESSION_SECRET too", () => {
  withEnv({ ...SAFE_ENV, SESSION_SECRET: "replace-with-a-long-random-secret" }, () => {
    const report = runConfigPreflight();
    const finding = report.findings.find((f) => f.key === "SESSION_SECRET");
    assert.equal(finding?.issueType, "placeholder-value");
    assert.equal(finding?.severity, "blocking");
  });
});

test("runConfigPreflight: detects short/weak SESSION_SECRET distinct from placeholder", () => {
  withEnv({ ...SAFE_ENV, SESSION_SECRET: "short-secret-value" }, () => {
    const report = runConfigPreflight();
    const finding = report.findings.find((f) => f.key === "SESSION_SECRET");
    assert.ok(finding);
    assert.equal(finding?.issueType, "weak-secret");
    assert.equal(finding?.severity, "blocking");
  });
});

test("runConfigPreflight: SESSION_SECRET between 32 and 63 chars is only a warning, not blocking", () => {
  withEnv({ ...SAFE_ENV, SESSION_SECRET: "c".repeat(40) }, () => {
    const report = runConfigPreflight();
    const finding = report.findings.find((f) => f.key === "SESSION_SECRET");
    assert.ok(finding);
    assert.equal(finding?.issueType, "below-recommended-length");
    assert.equal(finding?.severity, "warning");
    assert.equal(report.hasBlockingIssues, false);
  });
});

test("runConfigPreflight: SESSION_SECRET of 64+ random-looking chars is accepted (no finding)", () => {
  withEnv({ ...SAFE_ENV, SESSION_SECRET: "d".repeat(64) }, () => {
    const report = runConfigPreflight();
    assert.equal(report.findings.some((f) => f.key === "SESSION_SECRET"), false);
  });
});

test("runConfigPreflight: detects ADMIN_EMAILS demo placeholder as blocking in production", () => {
  withEnv({ ...SAFE_ENV, ADMIN_EMAILS: "demo@example.com" }, () => {
    const report = runConfigPreflight();
    const finding = report.findings.find((f) => f.key === "ADMIN_EMAILS");
    assert.ok(finding);
    assert.equal(finding?.issueType, "placeholder-value");
    assert.equal(finding?.severity, "blocking");
    assert.equal(report.hasBlockingIssues, true);
  });
});

test("runConfigPreflight: ADMIN_EMAILS demo placeholder mixed with a real address is still detected", () => {
  withEnv({ ...SAFE_ENV, ADMIN_EMAILS: "ops@acme-example-corp.com, demo@example.com" }, () => {
    const report = runConfigPreflight();
    const finding = report.findings.find((f) => f.key === "ADMIN_EMAILS");
    assert.ok(finding);
    assert.equal(finding?.issueType, "placeholder-value");
  });
});

test("runConfigPreflight: a real-looking ADMIN_EMAILS value produces no finding", () => {
  withEnv({ ...SAFE_ENV, ADMIN_EMAILS: "admin@my-real-company.co.jp" }, () => {
    const report = runConfigPreflight();
    assert.equal(report.findings.some((f) => f.key === "ADMIN_EMAILS"), false);
  });
});

test("runConfigPreflight: warns (not blocking) when DATABASE_URL is missing in production", () => {
  withEnv({ ...SAFE_ENV, DATABASE_URL: undefined }, () => {
    const report = runConfigPreflight();
    const finding = report.findings.find((f) => f.key === "DATABASE_URL");
    assert.ok(finding);
    assert.equal(finding?.severity, "warning");
    assert.equal(report.hasBlockingIssues, false);
  });
});

test("runConfigPreflight: warns (not blocking) when RATE_LIMIT_HASH_SECRET and SESSION_SECRET are both missing", () => {
  withEnv(
    { ...SAFE_ENV, RATE_LIMIT_HASH_SECRET: undefined, SESSION_SECRET: "e".repeat(64) },
    () => {
      const report = runConfigPreflight();
      const finding = report.findings.find((f) => f.key === "RATE_LIMIT_HASH_SECRET");
      assert.ok(finding);
      assert.equal(finding?.issueType, "using-fallback-secret");
      assert.equal(finding?.severity, "info");
    },
  );

  withEnv({ ...SAFE_ENV, RATE_LIMIT_HASH_SECRET: undefined, SESSION_SECRET: undefined }, () => {
    const report = runConfigPreflight();
    // SESSION_SECRET missing already produces its own blocking finding;
    // RATE_LIMIT_HASH_SECRET should additionally warn about the insecure dev fallback.
    const finding = report.findings.find((f) => f.key === "RATE_LIMIT_HASH_SECRET");
    assert.ok(finding);
    assert.equal(finding?.issueType, "missing-fallback-to-insecure-dev-secret");
    assert.equal(finding?.severity, "warning");
  });
});

test("runConfigPreflight: warns (not blocking) when no AI provider API key is configured", () => {
  withEnv(
    {
      ...SAFE_ENV,
      OPENAI_API_KEY: undefined,
      ANTHROPIC_API_KEY: undefined,
      GOOGLE_GENERATIVE_AI_API_KEY: undefined,
    },
    () => {
      const report = runConfigPreflight();
      const finding = report.findings.find((f) => f.category === "ai-provider");
      assert.ok(finding);
      assert.equal(finding?.severity, "warning");
      assert.equal(report.hasBlockingIssues, false);
    },
  );
});

test("runConfigPreflight: development environment downgrades placeholder issues to non-blocking", () => {
  withEnv(
    {
      ...SAFE_ENV,
      NODE_ENV: "development",
      SESSION_SECRET: "dev-secret-change-in-production",
      ADMIN_EMAILS: "demo@example.com",
    },
    () => {
      const report = runConfigPreflight();
      assert.equal(report.isProduction, false);
      assert.equal(report.hasBlockingIssues, false);
    },
  );
});

test("runConfigPreflight: blocks when SMTP credentials are not configured in production", () => {
  withEnv({ ...SAFE_ENV, SMTP_USER: undefined, SMTP_PASS: undefined }, () => {
    const report = runConfigPreflight();
    const finding = report.findings.find((f) => f.category === "mail");
    assert.ok(finding);
    assert.equal(finding?.severity, "blocking");
    assert.equal(finding?.issueType, "missing-in-production");
    assert.equal(report.hasBlockingIssues, true);
  });
});

test("runConfigPreflight: SMTP partially configured (missing SMTP_PASS only) is still blocking", () => {
  withEnv({ ...SAFE_ENV, SMTP_PASS: undefined }, () => {
    const report = runConfigPreflight();
    const finding = report.findings.find((f) => f.category === "mail");
    assert.ok(finding);
    assert.equal(finding?.severity, "blocking");
  });
});

test("runConfigPreflight: Gmail SMTP host and port defaults do not require environment variables", () => {
  withEnv({ ...SAFE_ENV, SMTP_HOST: undefined, SMTP_PORT: undefined }, () => {
    const report = runConfigPreflight();
    const finding = report.findings.find((f) => f.category === "mail");
    assert.equal(finding, undefined);
    assert.equal(report.hasBlockingIssues, false);
  });
});

test("runConfigPreflight: missing SMTP credentials in development is only info-level", () => {
  withEnv({ ...SAFE_ENV, NODE_ENV: "development", SMTP_USER: undefined, SMTP_PASS: undefined }, () => {
    const report = runConfigPreflight();
    const finding = report.findings.find((f) => f.category === "mail");
    assert.ok(finding);
    assert.equal(finding?.severity, "info");
    assert.equal(report.hasBlockingIssues, false);
  });
});

test("runConfigPreflight: blocks when ADMIN_PASSWORD is missing in production", () => {
  withEnv({ ...SAFE_ENV, ADMIN_PASSWORD: undefined }, () => {
    const report = runConfigPreflight();
    const finding = report.findings.find((f) => f.key === "ADMIN_PASSWORD");
    assert.ok(finding);
    assert.equal(finding?.severity, "blocking");
    assert.equal(report.hasBlockingIssues, true);
  });
});

test("runConfigPreflight: findings never include raw secret/env values in any field", () => {
  const secretValue = "super-secret-value-that-must-not-leak";
  withEnv({ ...SAFE_ENV, SESSION_SECRET: secretValue }, () => {
    const report = runConfigPreflight();
    const serialized = JSON.stringify(report);
    assert.equal(serialized.includes(secretValue), false);
  });
});
