import type { EvidenceItem } from "@/lib/types";

const confidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (confidence >= 0.5) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-rose-600 bg-rose-50 border-rose-200";
};

export function SourceEvidenceList({ items }: { items: EvidenceItem[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-[1.25rem] border border-indigo-200/50 bg-white/95 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:border-indigo-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-600">
                {item.sourceName}
              </span>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${confidenceColor(item.confidence)}`}>
                信頼度 {Math.round(item.confidence * 100)}%
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
            >
              参照元を開く
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                <path fillRule="evenodd" d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72ZM3.5 6.75c-.69 0-1.25.56-1.25 1.25v4.5c0 .69.56 1.25 1.25 1.25h4.5c.69 0 1.25-.56 1.25-1.25v-1.5a.75.75 0 0 0-1.5 0v1.5h-4.5V8h1.5a.75.75 0 0 0 0-1.5h-1.5Z" clipRule="evenodd" />
              </svg>
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}
