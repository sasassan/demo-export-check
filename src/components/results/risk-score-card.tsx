import { cn } from "@/lib/utils";
import type { Grade } from "@/lib/types";

const gradeConfig: Record<
  Grade,
  { bg: string; border: string; text: string; badge: string; label: string; ring: string; icon: React.ReactNode }
> = {
  A: {
    bg: "bg-tint-emerald",
    border: "border-tint-emerald-border",
    text: "text-emerald-400",
    badge: "bg-tint-emerald text-emerald-400 border-tint-emerald-border",
    label: "問題なし",
    ring: "hover:ring-emerald-100",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
      </svg>
    ),
  },
  B: {
    bg: "bg-tint-amber",
    border: "border-tint-amber-border",
    text: "text-amber-400",
    badge: "bg-tint-amber text-amber-400 border-tint-amber-border",
    label: "要確認",
    ring: "hover:ring-amber-100",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
    ),
  },
  C: {
    bg: "bg-tint-rose",
    border: "border-tint-rose-border",
    text: "text-rose-400",
    badge: "bg-tint-rose text-rose-400 border-tint-rose-border",
    label: "高リスク",
    ring: "hover:ring-rose-100",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
    ),
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
    <div
      className={cn(
        "trade-hover-lift rounded-2xl border p-5 shadow-sm ring-1 ring-transparent transition",
        config.bg,
        config.border,
        config.ring,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold", config.badge)}>
          {config.icon}
          {config.label}
        </span>
      </div>
      <p className={cn("mt-2 text-4xl font-bold tracking-tight sm:text-5xl", config.text)}>{grade}</p>
      <p className="mt-3 text-xs leading-5 text-slate-600">{description}</p>
    </div>
  );
}
