"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/ui/error-fallback";

import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[app/global-error]", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="ja">
      <body className="min-h-full bg-panel antialiased">
        <ErrorFallback
          title="サービスで問題が発生しました"
          message="大変申し訳ありません。システム全体でエラーが発生しました。再試行しても解決しない場合は、しばらく時間をおいてからアクセスしてください。"
          onRetry={unstable_retry}
        />
      </body>
    </html>
  );
}
