"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * クライアントサイドのページ遷移時に、画面上部へ細いプログレスバーを表示する。
 * NProgress 相当のフィードバックを、外部依存なしで提供する。
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 700);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[110] h-0.5 overflow-hidden">
      <div className="trade-nav-progress-bar h-full w-1/3 rounded-full bg-gradient-to-r from-brand-deep to-brand-blue" />
    </div>
  );
}
