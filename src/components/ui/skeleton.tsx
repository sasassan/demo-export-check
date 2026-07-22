export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 ${className}`} />;
}

export function SkeletonLines({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton key={idx} className={`h-3.5 ${idx === count - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}
