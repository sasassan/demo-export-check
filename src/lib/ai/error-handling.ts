/**
 * 共通のAIプロバイダーエラー分類・リトライユーティリティ。
 * OpenAI / Anthropic / Google の各SDKが投げるエラーからHTTPステータスを抽出し、
 * タイムアウト・レート制限(429)・認証エラー(401)・モデル不存在(404) を区別してログ出力する。
 */

export type AiErrorKind =
  | "timeout"
  | "rate_limit"
  | "auth"
  | "not_found"
  | "invalid_request"
  | "server_error"
  | "network"
  | "unknown";

export type ClassifiedAiError = {
  kind: AiErrorKind;
  status?: number;
  message: string;
};

function extractStatus(error: unknown): number | undefined {
  if (error && typeof error === "object") {
    const withStatus = error as { status?: unknown; statusCode?: unknown };
    if (typeof withStatus.status === "number") return withStatus.status;
    if (typeof withStatus.statusCode === "number") return withStatus.statusCode;
  }
  return undefined;
}

function isTimeoutError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const name = error.name ?? "";
  const message = error.message ?? "";
  return (
    name === "APIConnectionTimeoutError" ||
    name === "AbortError" ||
    /timeout/i.test(message) ||
    /timed out/i.test(message)
  );
}

/** SDK/fetchが投げた例外を分類する。APIキーの値は一切参照・出力しない。 */
export function classifyAiError(error: unknown): ClassifiedAiError {
  const status = extractStatus(error);
  const message = error instanceof Error ? error.message : String(error);

  if (isTimeoutError(error)) {
    return { kind: "timeout", status, message };
  }
  if (status === 429) {
    return { kind: "rate_limit", status, message };
  }
  if (status === 401 || status === 403) {
    return { kind: "auth", status, message };
  }
  if (status === 404) {
    return { kind: "not_found", status, message };
  }
  if (status === 400 || status === 422) {
    return { kind: "invalid_request", status, message };
  }
  if (typeof status === "number" && status >= 500) {
    return { kind: "server_error", status, message };
  }
  if (error instanceof TypeError || /fetch failed|ENOTFOUND|ECONNREFUSED/i.test(message)) {
    return { kind: "network", status, message };
  }
  return { kind: "unknown", status, message };
}

/** サーバーログにAPIキーを含めず、原因を明確に出力する。 */
export function logAiError(providerLabel: string, error: unknown): ClassifiedAiError {
  const classified = classifyAiError(error);
  console.error(
    `[AI:${providerLabel}] 呼び出し失敗 kind=${classified.kind} status=${classified.status ?? "n/a"} message=${classified.message}`,
  );
  return classified;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type RetryOptions = {
  /** 429時の最大リトライ回数（デフォルト2回） */
  maxRetries?: number;
  /** バックオフの基準時間(ms)。実際の待機時間は baseDelayMs * 2^attempt */
  baseDelayMs?: number;
  providerLabel: string;
};

/**
 * 429(レート制限)の場合のみ指数バックオフで最大 maxRetries 回リトライする。
 * 401/404/timeoutなど再試行しても解決しないエラーは即座に再スローする。
 */
export async function callWithRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const { maxRetries = 2, baseDelayMs = 500, providerLabel } = options;
  let attempt = 0;

  for (;;) {
    try {
      return await fn();
    } catch (error) {
      const classified = logAiError(providerLabel, error);
      const canRetry = classified.kind === "rate_limit" && attempt < maxRetries;
      if (!canRetry) {
        throw error;
      }
      const delay = baseDelayMs * 2 ** attempt;
      console.error(
        `[AI:${providerLabel}] 429のため ${delay}ms 待機後にリトライします (attempt ${attempt + 1}/${maxRetries})`,
      );
      await sleep(delay);
      attempt += 1;
    }
  }
}
