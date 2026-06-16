export function BetaBanner() {
  return (
    <div className="sticky top-0 z-[60] border-b border-amber-200 bg-amber-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2 text-xs text-amber-900 sm:px-6">
        <p className="font-semibold">
          β版（Beta） / 開発中サービス / 判定結果は参考情報です
        </p>
        <p className="leading-5">
          最終的な輸出可否判断を保証するものではありません。公開版ではLP・サービス説明・デモ・問い合わせのみを主対象としています。
        </p>
      </div>
    </div>
  );
}