import { FloatingAiHelp } from "@/components/shared/floating-ai-help";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WorldMapIcon, AnchorIcon } from "@/components/icons/trade-icons";
import { CompassWatermark } from "@/components/icons/trade-illustrations";

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
    <div className="trade-dashboard-bg relative min-h-screen overflow-hidden text-slate-900">
      <CompassWatermark
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-32 z-0 hidden h-72 w-72 text-brand-cyan/[0.08] lg:block"
      />
      <AnchorIcon
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 bottom-24 z-0 hidden h-40 w-40 text-brand-teal/[0.08] lg:block"
      />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 outline-none sm:px-6 sm:py-10"
      >
        <section className="trade-glass-card relative overflow-hidden rounded-xl px-6 py-5 backdrop-blur-sm">
          <WorldMapIcon
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-8 hidden h-40 w-40 text-brand-cyan/[0.09] sm:block"
          />
          <span className="relative inline-flex rounded-full border border-tint-blue-bright bg-tint-blue px-2.5 py-1 text-[11px] font-semibold tracking-wide text-brand-navy">
            Export Control Monitor
          </span>
          <h1 className="relative mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {description ? (
            <p className="relative mt-2 max-w-3xl text-sm leading-7 text-slate-500">{description}</p>
          ) : null}
        </section>
        {children}
      </main>
      <SiteFooter />
      <FloatingAiHelp />
    </div>
  );
}
