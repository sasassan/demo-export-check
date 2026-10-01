import { FloatingAiHelp } from "@/components/shared/floating-ai-help";
import { Header } from "@/components/layout/header";
import { WorldMapIcon } from "@/components/icons/trade-icons";
import { PortSilhouetteStrip } from "@/components/icons/trade-illustrations";
import { APP_NAME } from "@/lib/constants";

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
    <div className="min-h-screen bg-transparent text-slate-900">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="relative overflow-hidden rounded-xl border border-slate-200 bg-white/95 px-6 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm">
          <WorldMapIcon
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-8 hidden h-40 w-40 text-brand-navy/[0.05] sm:block"
          />
          <span className="relative inline-flex rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-brand-navy">
            Export Control Monitor
          </span>
          <h1 className="relative mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {description ? (
            <p className="relative mt-2 max-w-3xl text-sm leading-7 text-slate-500">{description}</p>
          ) : null}
        </section>
        {children}
      </main>
      <footer className="relative mt-6 overflow-hidden border-t border-slate-200 bg-white">
        <PortSilhouetteStrip aria-hidden="true" className="h-14 w-full text-brand-navy/15" />
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
          &copy; {APP_NAME}
        </div>
      </footer>
      <FloatingAiHelp />
    </div>
  );
}
