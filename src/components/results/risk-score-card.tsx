import { cn } from "@/lib/utils";
import type { Grade } from "@/lib/types";

const gradeConfig: Record<Grade, { bg: string; border: string; text: string; badge: string; label: string }> = {
  A: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "問題なし",
  },
  B: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    label: "要確認",
  },
  C: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    label: "高リスク",
  },
};

export function RiskScoreCard({
  label,
  grade,
  description,
}: {
  label: string;
  grade: Grade;
  description: string;
}) {
  const config = gradeConfig[grade];

  return (
    <div className={cn("rounded-2xl border p-5", config.bg, config.border)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <span className={cn("rounded-md border px-2 py-0.5 text-xs font-semibold", config.badge)}>
          {config.label}
        </span>
      </div>
      <p className={cn("mt-2 text-4xl font-bold tracking-tight sm:text-5xl", config.text)}>{grade}</p>
      <p className="mt-3 text-xs leading-5 text-slate-600">{description}</p>
    </div>
  );
}
