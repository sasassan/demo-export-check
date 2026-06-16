import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="border-b border-indigo-200/40 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-400 shadow-lg shadow-indigo-500/25">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 sm:text-base">{APP_NAME}</span>
            <span className="text-[10px] uppercase tracking-[0.24em] text-indigo-500/70">Sanctions & Export Review</span>
          </div>
        </Link>
        <nav className="flex w-full items-center gap-2 sm:w-auto sm:gap-2">
          <Link
            href="/about?v=nav"
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:flex-none"
          >
            サービス説明
          </Link>
          <Link
            href="/demo?v=nav"
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:flex-none"
          >
            デモ画面
          </Link>
          <Link
            href="/contact?v=nav"
            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-sky-600 sm:flex-none"
          >
            問い合わせ
          </Link>
        </nav>
      </div>
    </header>
  );
}
