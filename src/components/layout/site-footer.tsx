import Link from "next/link";

import { PortSilhouetteStrip } from "@/components/icons/trade-illustrations";
import { APP_NAME } from "@/lib/constants";

/**
 * 全ページ共通のフッター。
 * 各ページ下部の「トップページに戻る」CTAと、控えめな免責表示をまとめる。
 */
export function SiteFooter() {
  return (
    <footer className="relative mt-6 overflow-hidden border-t border-slate-200 bg-panel">
      <PortSilhouetteStrip aria-hidden="true" className="h-14 w-full text-brand-cyan/20" />
      <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
        <Link
          href="/"
          data-cta-id="footer-back-home"
          data-cta-label="トップページに戻る"
          data-cta-target="/"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-panel px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-navy hover:text-brand-navy"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
          トップページに戻る
        </Link>
        <p className="mt-5 text-xs leading-6 text-slate-500">
          本サービスは輸出管理における専門家の判断を補助するツールです。ご利用にあたっては
          <Link href="/terms" className="font-semibold text-brand-navy hover:underline">
            利用規約
          </Link>
          に同意の上ご利用ください。
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
          <Link href="/privacy" className="transition hover:text-brand-navy hover:underline">
            プライバシーポリシー
          </Link>
          <span aria-hidden="true">·</span>
          <span>&copy; {APP_NAME}</span>
        </div>
      </div>
    </footer>
  );
}
