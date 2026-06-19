import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="border-b border-cyan-300/15 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-300 shadow-lg shadow-cyan-500/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white sm:text-base">{APP_NAME}</span>
            <span className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">Sanctions & Export Review</span>
          </div>
        </Link>
        <nav className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-2">
          <Link
            href="/about?v=nav"
            className="flex-1 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-center text-sm font-semibold text-slate-100 shadow-sm hover:bg-white/10 sm:flex-none"
          >
            サービス説明
          </Link>
          <Link
            href="/glossary?v=nav"
            className="flex-1 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-center text-sm font-semibold text-slate-100 shadow-sm hover:bg-white/10 sm:flex-none"
          >
            輸出辞典
          </Link>
          <Link
            href="/ai-room?v=nav"
            className="flex-1 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-center text-sm font-semibold text-slate-100 shadow-sm hover:bg-white/10 sm:flex-none"
          >
            AI相談室
          </Link>
          <Link
            href="/learning?v=nav"
            className="flex-1 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-center text-sm font-semibold text-slate-100 shadow-sm hover:bg-white/10 sm:flex-none"
          >
            学習コンテンツ
          </Link>
          <Link
            href="/security?v=nav"
            className="flex-1 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-center text-sm font-semibold text-slate-100 shadow-sm hover:bg-white/10 sm:flex-none"
          >
            セキュリティ
          </Link>
          <Link
            href="/training?v=nav"
            className="flex-1 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-center text-sm font-semibold text-slate-100 shadow-sm hover:bg-white/10 sm:flex-none"
          >
            研修支援
          </Link>
          <Link
            href="/updates?v=nav"
            className="flex-1 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-center text-sm font-semibold text-slate-100 shadow-sm hover:bg-white/10 sm:flex-none"
          >
            規制更新
          </Link>
          <Link
            href="/demo?v=nav"
            className="flex-1 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-center text-sm font-semibold text-slate-100 shadow-sm hover:bg-white/10 sm:flex-none"
          >
            デモ画面
          </Link>
          <Link
            href="/contact?v=nav"
            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-3 py-2 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 hover:from-indigo-400 hover:to-cyan-300 sm:flex-none"
          >
            問い合わせ
          </Link>
        </nav>
      </div>
    </header>
  );
}
