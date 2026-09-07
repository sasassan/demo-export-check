import { NextResponse } from "next/server";

/**
 * DB接続関連のエラーかどうかを判定する。
 * postgres.js / Neonプーラー（pgBouncer）が投げるエラーはコード名がまちまちなため、
 * Node標準のerrno系コードとメッセージ文字列の両方でヒューリスティックに判定する。
 * 値そのもの（接続文字列等）はここでは扱わない。
 */
export function isDbConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const code = (error as NodeJS.ErrnoException).code;
  const connectionErrnoCodes = new Set([
    "ECONNREFUSED",
    "ETIMEDOUT",
    "ENOTFOUND",
    "ECONNRESET",
    "CONNECTION_ENDED",
    "CONNECTION_CLOSED",
    "CONNECT_TIMEOUT",
  ]);
  if (code && connectionErrnoCodes.has(code)) return true;

  const message = error.message.toLowerCase();
  return (
    message.includes("too many clients") ||
    message.includes("remaining connection slots") ||
    message.includes("connection terminated") ||
    message.includes("connection closed") ||
    message.includes("connection ended") ||
    message.includes("connect_timeout") ||
    message.includes("timeout exceeded when trying to connect") ||
    (message.includes("connection") && message.includes("timeout")) ||
    (message.includes("connection") && message.includes("refused"))
  );
}

/** DB混雑時の共通レスポンス。内部エラー詳細は含めない。 */
export function dbUnavailableResponse(): NextResponse {
  return NextResponse.json(
    { error: "ただいま混雑しています。しばらく時間をおいて再度お試しください。" },
    { status: 503 },
  );
}

/**
 * APIルートハンドラをラップし、DB接続エラーを503（混雑）、それ以外の未処理例外を
 * 500（JSONボディ付き）にマッピングする。
 * 目的: 未処理例外によるNext.jsの既定エラーページ（空ボディの500）を防ぎ、
 * 常に利用者向けの日本語メッセージを含むJSONを返す。
 */
export async function withDbErrorHandling(
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.error("[db] connection error:", error);
      return dbUnavailableResponse();
    }
    console.error("[db] unexpected error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。" },
      { status: 500 },
    );
  }
}
