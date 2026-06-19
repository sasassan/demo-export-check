import Image from "next/image";

import { LoginForm } from "@/components/forms/login-form";
import { APP_NAME } from "@/lib/constants";

export const dynamic = "force-static";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 左パネル */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#1e3a5f] p-12 lg:flex">
        <div className="absolute inset-0">
          <Image
            src="/login-trade-hero.png"
            alt="輸出と制裁審査をイメージしたログイン背景"
            fill
            className="object-cover opacity-20"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/90 to-[#2a4a73]/85" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-white">{APP_NAME}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/60">Sanctions & Export Review</span>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight text-white">
            輸出コンプライアンスの<br />一次確認を、誰でも。
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-white/80">
            商品情報を入力するだけで、制裁リスト・企業信用・国リスクについて
            AIが一次スクリーニングを支援します。
          </p>
          <div className="mt-8 space-y-2.5">
            {[
              ["審査対象", "Sanctions / End-user / Country"],
              ["処理時間", "平均 約5分"],
              ["共有形式", "PDF / AI要約 / Checklist"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/15 bg-white/10 px-4 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
          <ul className="mt-8 space-y-3">
            {[
              "商品名・型番・輸出先国・顧客企業名を入力",
              "AIが8つの観点で一次スクリーニングを支援",
              "A/B/C評価とPDFレポートをそのまま社内提出",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/90">
                <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-white/70">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs leading-5 text-white/80">
          本サービスは参考情報を提供するものであり、法令上の判断を代替するものではありません。
        </p>
      </div>

      {/* 右パネル */}
      <div className="flex w-full items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f]">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">{APP_NAME}</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <span className="trade-section-label">Secure Sign-in</span>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">ログイン</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">メールアドレスを入力してすぐに利用開始できます。</p>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Access Scope</p>
              <p className="mt-0.5 text-sm text-slate-700">案件一覧 / AI診断 / PDFレポート / チェックリスト管理</p>
            </div>
            <div className="mt-6">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
