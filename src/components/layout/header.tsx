"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAME } from "@/lib/constants";

const navItems = [
  { href: "/demo?v=nav", match: "/demo", label: "デモ" },
  { href: "/glossary?v=nav", match: "/glossary", label: "辞典" },
  { href: "/ai-room?v=nav", match: "/ai-room", label: "AI相談室" },
  { href: "/learning?v=nav", match: "/learning", label: "学習" },
  { href: "/about?v=nav", match: "/about", label: "概要" },
  { href: "/admin/monitoring?v=nav", match: "/admin/monitoring", label: "モニタリング" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  // モバイルメニュー開閉時のフォーカス制御
  useEffect(() => {
    if (isMenuOpen) {
      firstMenuLinkRef.current?.focus();
    }
  }, [isMenuOpen]);

  // Escapeキーでメニューを閉じ、フォーカスを開閉ボタンに戻す
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-panel/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-deep">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-wide text-slate-900 sm:text-base">{APP_NAME}</span>
          <span className="hidden text-[9px] font-semibold tracking-[0.18em] text-brand-cyan lg:inline">
            GLOBAL TRADE CONSOLE
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="メインナビゲーション" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.match) ?? false;
            return (
              <Link
                key={item.match}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-tint-blue text-brand-navy"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="mx-1 hidden h-5 w-px bg-slate-200 md:block" />
          <Link
            href="/contact?v=nav"
            data-cta-id="header-contact"
            data-cta-label="お問い合わせ"
            data-cta-target="/contact?v=nav"
            className="rounded-md bg-brand-deep px-4 py-2 text-sm font-semibold !text-white shadow-sm transition hover:bg-brand-deep-light"
          >
            お問い合わせ
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          ref={menuButtonRef}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100 md:hidden"
        >
          {isMenuOpen ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-nav-menu"
            aria-label="メインナビゲーション"
            className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-panel px-4 py-3 shadow-lg md:hidden"
          >
            <div className="mx-auto max-w-6xl space-y-1">
              {navItems.map((item, index) => {
                const isActive = pathname?.startsWith(item.match) ?? false;
                return (
                  <Link
                    key={item.match}
                    ref={index === 0 ? firstMenuLinkRef : undefined}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-md px-3 text-base font-medium transition ${
                      isActive
                        ? "bg-tint-blue text-brand-navy"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/contact?v=nav"
                onClick={() => setIsMenuOpen(false)}
                className="flex min-h-11 items-center rounded-md bg-brand-deep px-3 text-base font-semibold !text-white transition hover:bg-brand-deep-light"
              >
                お問い合わせ
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
