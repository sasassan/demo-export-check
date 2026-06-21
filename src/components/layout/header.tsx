import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f]">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-900 sm:text-base">{APP_NAME}</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/demo?v=nav" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900">
            デモ
          </Link>
          <Link href="/glossary?v=nav" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900">
            辞典
          </Link>
          <Link href="/ai-room?v=nav" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900">
            AI相談室
          </Link>
          <Link href="/learning?v=nav" className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 md:inline-flex">
            学習
          </Link>
          <Link href="/about?v=nav" className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 md:inline-flex">
            概要
          </Link>
          <span className="mx-1 hidden h-5 w-px bg-slate-200 md:block" />
          <Link
            href="/contact?v=nav"
            data-cta-id="header-contact"
            data-cta-label="お問い合わせ"
            data-cta-target="/contact?v=nav"
            className="rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-semibold !text-white shadow-sm hover:bg-[#2a4a73]"
          >
            お問い合わせ
          </Link>
        </nav>
      </div>
    </header>
  );
}
