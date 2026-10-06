import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";

import {
  askAssistant,
  buildProviderAttempts,
  parseAssistantJson,
} from "./assistant";

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

const BASE_ENV = {
  OPENAI_API_KEY: undefined,
  ANTHROPIC_API_KEY: undefined,
  GOOGLE_GENERATIVE_AI_API_KEY: undefined,
  ENABLED_AI_PROVIDERS: undefined,
} as const;

function startMockServer(
  handler: (req: { url?: string; body: unknown }) => { status: number; body: unknown },
): Promise<{ url: string; server: ReturnType<typeof createServer> }> {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let raw = "";
      req.on("data", (chunk) => {
        raw += chunk;
      });
      req.on("end", () => {
        let body: unknown = null;
        try {
          body = JSON.parse(raw);
        } catch {
          body = raw;
        }
        const response = handler({ url: req.url, body });
        res.writeHead(response.status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response.body));
      });
    });
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      resolve({ url: `http://127.0.0.1:${port}`, server });
    });
  });
}

function openAiSuccessResponse(content: string) {
  return {
    status: 200,
    body: {
      id: "chatcmpl-test",
      object: "chat.completion",
      model: "gpt-4o-mini",
      choices: [
        {
          index: 0,
          message: { role: "assistant", content },
          finish_reason: "stop",
        },
      ],
    },
  };
}

function claudeSuccessResponse(content: string) {
  return {
    status: 200,
    body: {
      id: "msg-test",
      type: "message",
      role: "assistant",
      model: "claude-sonnet-5",
      content: [{ type: "text", text: content }],
      stop_reason: "end_turn",
    },
  };
}

test("parseAssistantJson: parses clean JSON", () => {
  const result = parseAssistantJson('{"title":"test","simpleExplanation":"hello"}');
  assert.deepEqual(result, { title: "test", simpleExplanation: "hello" });
});

test("parseAssistantJson: strips markdown code fences", () => {
  const result = parseAssistantJson("```json\n{\"title\":\"test\"}\n```");
  assert.deepEqual(result, { title: "test" });
});

test("parseAssistantJson: returns null for invalid JSON", () => {
  const result = parseAssistantJson("not json");
  assert.equal(result, null);
});

test("buildProviderAttempts: default order is OpenAI, Gemini, then Claude", () => {
  const attempts = buildProviderAttempts();
  assert.deepEqual(
    attempts.map((a) => a.model),
    ["gpt-4o", "gemini", "claude"],
  );
});

test("buildProviderAttempts: preferred model is first", () => {
  const attempts = buildProviderAttempts("claude");
  assert.deepEqual(
    attempts.map((a) => a.model),
    ["claude", "gpt-4o", "gemini"],
  );
});

test("buildProviderAttempts: gemini can be selected as preferred model", () => {
  const attempts = buildProviderAttempts("gemini");
  assert.deepEqual(
    attempts.map((a) => a.model),
    ["gemini", "gpt-4o", "claude"],
  );
});

test("buildProviderAttempts: marks providers without keys as no-key", () => {
  return withEnv(BASE_ENV, () => {
    const attempts = buildProviderAttempts();
    assert.equal(attempts.every((a) => a.status === "no-key"), true);
  });
});

test("buildProviderAttempts: marks providers as live when keys are set", () => {
  return withEnv(
    {
      ...BASE_ENV,
      OPENAI_API_KEY: "sk-test",
      ANTHROPIC_API_KEY: "sk-ant-test",
      GOOGLE_GENERATIVE_AI_API_KEY: "google-test",
    },
    () => {
      const attempts = buildProviderAttempts();
      assert.equal(attempts.every((a) => a.status === "live"), true);
    },
  );
});

test("askAssistant: returns no-key when no provider API keys are configured", async () => {
  await withEnv(BASE_ENV, async () => {
    const result = await askAssistant({ message: "hello", mode: "general" });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.reason, "no-key");
    }
  });
});

test("askAssistant: calls OpenAI and returns parsed JSON", async () => {
  const content = JSON.stringify({ title: "Test", simpleExplanation: "OpenAI answer" });
  const { url, server } = await startMockServer(() => openAiSuccessResponse(content));

  await withEnv(
    {
      ...BASE_ENV,
      OPENAI_API_KEY: "sk-test",
      OPENAI_BASE_URL: url,
    },
    async () => {
      const result = await askAssistant({ message: "hello", mode: "general" });
      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.usedModel, "gpt-4o");
        assert.equal(result.data.title, "Test");
        assert.equal(result.data.simpleExplanation, "OpenAI answer");
      }
    },
  );

  server.close();
});

test("askAssistant: falls back to Claude when OpenAI fails", async () => {
  const claudeContent = JSON.stringify({ title: "Fallback", simpleExplanation: "Claude answer" });

  const { url: openAiUrl, server: openAiServer } = await startMockServer(() => ({
    status: 500,
    body: { error: { message: "OpenAI down" } },
  }));

  const { url: claudeUrl, server: claudeServer } = await startMockServer(() =>
    claudeSuccessResponse(claudeContent),
  );

  await withEnv(
    {
      ...BASE_ENV,
      OPENAI_API_KEY: "sk-test",
      OPENAI_BASE_URL: openAiUrl,
      ANTHROPIC_API_KEY: "sk-ant-test",
      ANTHROPIC_BASE_URL: claudeUrl,
    },
    async () => {
      const result = await askAssistant({ message: "hello", mode: "general" });
      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.usedModel, "claude");
        assert.equal(result.data.title, "Fallback");
      }
    },
  );

  openAiServer.close();
  claudeServer.close();
});

test("askAssistant: prefers Claude when aiModel is claude", async () => {
  const claudeContent = JSON.stringify({ title: "Claude Preferred", simpleExplanation: "hi" });

  const { url: claudeUrl, server: claudeServer } = await startMockServer(() =>
    claudeSuccessResponse(claudeContent),
  );

  await withEnv(
    {
      ...BASE_ENV,
      OPENAI_API_KEY: undefined,
      ANTHROPIC_API_KEY: "sk-ant-test",
      ANTHROPIC_BASE_URL: claudeUrl,
    },
    async () => {
      const result = await askAssistant({ message: "hello", mode: "general", aiModel: "claude" });
      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.usedModel, "claude");
        assert.equal(result.data.title, "Claude Preferred");
      }
    },
  );

  claudeServer.close();
});

test("askAssistant: reports error when all providers fail", async () => {
  const { url: openAiUrl, server: openAiServer } = await startMockServer(() => ({
    status: 401,
    body: { error: { message: "bad openai key" } },
  }));
  const { url: claudeUrl, server: claudeServer } = await startMockServer(() => ({
    status: 401,
    body: { error: { type: "authentication_error", message: "bad claude key" } },
  }));

  await withEnv(
    {
      ...BASE_ENV,
      OPENAI_API_KEY: "sk-test",
      OPENAI_BASE_URL: openAiUrl,
      ANTHROPIC_API_KEY: "sk-ant-test",
      ANTHROPIC_BASE_URL: claudeUrl,
    },
    async () => {
      const result = await askAssistant({ message: "hello", mode: "general" });
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.reason, "error");
        assert.ok(result.errorMessage);
      }
    },
  );

  openAiServer.close();
  claudeServer.close();
});
