export function BetaBanner() {
  return (
    <div className="sticky top-0 z-[60] border-b border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-1.5 text-xs text-amber-900 sm:px-6">
        <span className="rounded bg-amber-300 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-950">Beta</span>
        <p>開発中 / 判定結果は参考情報です。最終判断は利用者の責任で行ってください。</p>
      </div>
    </div>
  );
}
