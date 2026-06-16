import { Header } from "@/components/layout/header";

export function Shell({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="trade-surface trade-dashboard-bg min-h-screen bg-[#06111f] text-slate-100">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="trade-grid overflow-hidden rounded-[1.75rem] border border-indigo-200/50 bg-white/95 px-5 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:px-7">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-indigo-600 uppercase">
              Export Control Monitor
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          </div>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
          ) : null}
        </section>
        {children}
      </main>
    </div>
  );
}
