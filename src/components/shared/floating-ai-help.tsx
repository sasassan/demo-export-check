"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingAiHelp() {
  const pathname = usePathname();

  if (pathname === "/ai-room") {
    return null;
  }

  return (
    <Link
      href="/ai-room"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(59,130,246,0.35)] transition hover:scale-[1.02]"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
      困ったらAI相談
    </Link>
  );
}
