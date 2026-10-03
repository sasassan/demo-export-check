"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/ui/error-fallback";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // サーバー側ログと対応付けるためダイジェストを記録する（機密情報は含まない）
    console.error("[app/error]", error.digest ?? error.message);
  }, [error]);

  return (
    <ErrorFallback
      title="表示中に問題が発生しました"
      message="申し訳ありません。ページの読み込み中に予期しないエラーが発生しました。時間をおいて再試行するか、トップページへお戻りください。"
      onRetry={unstable_retry}
    />
  );
}
