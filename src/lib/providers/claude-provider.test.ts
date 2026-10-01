import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";

import { ClaudeProvider } from "./claude-provider";
import type { CaseRecord } from "../types";

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

const baseCase: CaseRecord = {
  id: "case-test",
  userEmail: "user@example.com",
  productName: "Test Product",
  modelNumber: "TP-001",
  destinationCountry: "Vietnam",
  customerCompanyName: "Test Customer Co.",
  status: "draft",
  checklist: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function startMockAnthropicServer(responseBody: object, statusCode = 200): Promise<{ url: string; server: ReturnType<typeof createServer>; requestBody: unknown }> {
  return new Promise((resolve) => {
    let capturedBody: unknown = null;
    const server = createServer((req, res) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          capturedBody = JSON.parse(body);
        } catch {
          capturedBody = body;
        }
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(responseBody));
      });
    });
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      resolve({ url: `http://127.0.0.1:${port}`, server, requestBody: capturedBody });
    });
  });
}

test("ClaudeProvider: returns mock fallback when ANTHROPIC_API_KEY is missing", async () => {
  await withEnv({ ANTHROPIC_API_KEY: undefined }, async () => {
    const provider = new ClaudeProvider();
    const result = await provider.run(baseCase);
    assert.equal(result.providerName, "anthropic-claude");
    assert.equal(result.providerStatus, "fallback-no-key");
    assert.ok(Array.isArray(result.findings));
  });
});

test("ClaudeProvider: calls Anthropic API and parses JSON findings", async () => {
  const responseBody = {
    id: "msg-test",
    type: "message",
    role: "assistant",
    model: "claude-sonnet-5",
    content: [
      {
        type: "text",
        text: JSON.stringify({
          dimensions: [
            {
              dimension: "country",
              label: "国リスク",
              score: 30,
              rationale: "ベトナムは比較的安定した輸出先です。",
              recommendedAction: "最新の規制状況を確認してください。",
              evidence: [
                {
                  title: "国リスク評価",
                  summary: "政情は比較的安定しています。",
                  sourceName: "Mock Source",
                  sourceType: "country",
                  confidence: 0.8,
                  riskLevel: "low",
                },
              ],
            },
          ],
          reviewComment: "国リスクは低めです。",
          keyRisk: "特記事項はありません。",
          improvementSteps: [],
          worstCaseScenarios: [],
        }),
      },
    ],
    stop_reason: "end_turn",
  };

  const { url, server } = await startMockAnthropicServer(responseBody);

  await withEnv(
    {
      ANTHROPIC_API_KEY: "sk-ant-test",
      ANTHROPIC_BASE_URL: url,
    },
    async () => {
      const provider = new ClaudeProvider();
      const result = await provider.run(baseCase);
      assert.equal(result.providerName, "anthropic-claude");
      assert.equal(result.providerStatus, "live");
      assert.equal(result.actualModelName, "claude-sonnet-5");
      assert.equal(result.findings.length, 1);
      assert.equal(result.findings[0]?.dimension, "country");
      assert.equal(result.findings[0]?.aiModel, "claude");
    },
  );

  server.close();
});

test("ClaudeProvider: falls back to mock on non-JSON response", async () => {
  const responseBody = {
    id: "msg-bad",
    type: "message",
    role: "assistant",
    model: "claude-sonnet-5",
    content: [{ type: "text", text: "not valid json" }],
    stop_reason: "end_turn",
  };

  const { url, server } = await startMockAnthropicServer(responseBody);

  await withEnv(
    {
      ANTHROPIC_API_KEY: "sk-ant-test",
      ANTHROPIC_BASE_URL: url,
    },
    async () => {
      const provider = new ClaudeProvider();
      const result = await provider.run(baseCase);
      assert.equal(result.providerName, "anthropic-claude");
      assert.equal(result.providerStatus, "fallback-error");
      assert.ok(Array.isArray(result.findings));
      assert.ok(result.errors && result.errors.length > 0);
    },
  );

  server.close();
});

test("ClaudeProvider: falls back to mock on API error", async () => {
  const responseBody = {
    error: {
      type: "authentication_error",
      message: "invalid api key",
    },
  };

  const { url, server } = await startMockAnthropicServer(responseBody, 401);

  await withEnv(
    {
      ANTHROPIC_API_KEY: "sk-ant-test",
      ANTHROPIC_BASE_URL: url,
    },
    async () => {
      const provider = new ClaudeProvider();
      const result = await provider.run(baseCase);
      assert.equal(result.providerName, "anthropic-claude");
      assert.equal(result.providerStatus, "fallback-error");
      assert.ok(Array.isArray(result.findings));
    },
  );

  server.close();
});
