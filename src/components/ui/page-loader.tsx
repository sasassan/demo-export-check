import { CargoShipLoader } from "@/components/icons/trade-illustrations";
import { Skeleton, SkeletonLines } from "@/components/ui/skeleton";

/**
 * ページ遷移時のスケルトンローディング。
 * 既存の貨物船アニメーション（CargoShipLoader）と Skeleton を組み合わせ、
 * 全セグメントで統一したローディング体験を提供する。
 */
export function PageLoader({ title = "読み込み中" }: { title?: string }) {
  return (
    <div role="status" className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <section className="relative overflow-hidden rounded-xl border border-slate-200 bg-panel/95 px-6 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-3 h-8 w-64 max-w-full" />
        <SkeletonLines count={2} />
      </section>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-panel px-6 py-16 text-center shadow-sm">
        <CargoShipLoader aria-hidden="true" className="h-16 w-40 text-brand-navy" />
        <p className="mt-6 text-sm font-semibold text-slate-700">{title}...</p>
        <p className="mt-1 text-xs text-slate-500">情報を航海中です。少々お待ちください。</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    </div>
  );
}
