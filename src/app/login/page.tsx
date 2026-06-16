import Image from "next/image";

import { LoginForm } from "@/components/forms/login-form";
import { APP_NAME } from "@/lib/constants";

const loginMapOverlay =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cg fill='%230ea5e9' fill-opacity='0.08'%3E%3Cpath d='M170 310l48-18 34 16 22-11 46 8 38 24 42 3 30 19-8 22-40 2-24 16-33-1-20 13-46-8-33-24-40-5-16-28z'/%3E%3Cpath d='M640 252l44-19 58 8 26 20 39 3 18 23 56 15 23 34-19 16-45-6-28 11-17 23-50-4-28-19-45-8-37-22-7-34z'/%3E%3Cpath d='M960 286l46-12 57 6 38 18 51-4 37 21 48 6 41 25-7 24-50 8-28 17-52-4-24 16-47-14-33-22-47-5-27-32z'/%3E%3C/g%3E%3Cg fill='none' stroke='%2306b6d4' stroke-opacity='0.22' stroke-width='2'%3E%3Cpath d='M206 338C318 328 400 370 486 356s120-58 228-51 130 40 214 31 144-48 243-41 166 45 252 29' stroke-dasharray='8 10'/%3E%3C/g%3E%3C/svg%3E\")";

export default function LoginPage() {
  return (
    <div className="trade-surface trade-dashboard-bg trade-grid relative flex min-h-screen bg-[linear-gradient(180deg,#06111f_0%,#07182a_42%,#091b2d_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.24),_transparent_28%)]" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[72%] bg-contain bg-center bg-no-repeat opacity-90 lg:block"
        style={{ backgroundImage: loginMapOverlay }}
      />
      {/* 左パネル */}
      <div className="trade-dark-panel relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="absolute inset-0">
          <Image
            src="/login-trade-hero.png"
            alt="輸出と制裁審査をイメージしたログイン背景"
            fill
            className="object-cover opacity-45 saturate-[1.1]"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(15,23,42,0.84),rgba(30,41,59,0.82))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(34,211,238,0.16),transparent_22%),radial-gradient(circle_at_76%_22%,rgba(59,130,246,0.18),transparent_26%),radial-gradient(circle_at_50%_78%,rgba(99,102,241,0.16),transparent_30%)]" />
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:30px_30px]" />
          <div className="absolute left-[10%] top-[14%] h-28 w-28 rounded-full border border-cyan-300/20 bg-cyan-300/10 blur-2xl" />
          <div className="absolute bottom-[12%] right-[8%] h-36 w-36 rounded-full border border-indigo-300/10 bg-indigo-400/10 blur-3xl" />
          <div className="absolute left-[8%] top-[22%] h-px w-[34%] bg-gradient-to-r from-cyan-300/0 via-cyan-300/70 to-cyan-300/0" />
          <div className="absolute right-[10%] top-[18%] h-px w-[22%] bg-gradient-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0" />
          <div className="absolute bottom-[18%] left-[12%] h-px w-[26%] bg-gradient-to-r from-indigo-300/0 via-indigo-300/70 to-indigo-300/0" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 shadow-lg shadow-sky-500/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-white">{APP_NAME}</span>
            <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Sanctions & Export Review</span>
          </div>
        </div>

        <div className="relative">
          <span className="inline-flex rounded-full border border-cyan-300/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Export Compliance
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-white">
            輸出コンプライアンスの
            <br />
            一次確認を、誰でも。
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 font-medium text-slate-100">
            商品情報を入力するだけで、制裁リスト・企業信用・国リスクについて
            AIが一次スクリーニングを支援します。
          </p>
          <div className="mt-8 grid gap-3">
            {[
              ["審査対象", "Sanctions / End-user / Country"],
              ["処理時間", "平均 約5分"],
              ["共有形式", "PDF / AI要約 / Checklist"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-300">{label}</p>
                <p className="mt-1 text-sm font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
          <ul className="mt-8 space-y-4">
            {[
              "商品名・型番・輸出先国・顧客企業名を入力",
              "AIが8つの観点で一次スクリーニングを支援",
              "A/B/C評価とPDFレポートをそのまま社内提出",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm font-medium text-slate-100">
                <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="pointer-events-none absolute right-8 top-24 w-56 rounded-2xl border border-cyan-300/20 bg-slate-950/55 p-4 backdrop-blur">
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200">Sanctions signal</p>
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-white/8 bg-white/5 px-3 py-2">
              <p className="text-[11px] font-medium text-slate-300">Country screening</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Restricted route watch</span>
                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold text-amber-200">B</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/5 px-3 py-2">
              <p className="text-[11px] font-medium text-slate-300">End-user trace</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Name verification required</span>
                <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-200">Check</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-24 right-10 w-64 rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur">
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Trade lane monitor</p>
          <div className="mt-3 grid gap-2">
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span className="text-xs text-slate-300">Export declaration</span>
              <span className="text-xs font-semibold text-cyan-200">Active</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span className="text-xs text-slate-300">Screening pass</span>
              <span className="text-xs font-semibold text-emerald-200">Ready</span>
            </div>
          </div>
        </div>

          <p className="relative text-sm leading-6 text-slate-200">
          本サービスは参考情報を提供するものであり、法令上の判断を代替するものではありません。
          最終的な輸出可否の判断は利用者自身の責任で実施してください。
        </p>
      </div>

      {/* 右パネル（フォーム） */}
      <div className="relative flex w-full items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* モバイル用ロゴ */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-400 shadow-lg shadow-indigo-500/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-slate-900">{APP_NAME}</span>
              <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Sanctions & Export Review</span>
            </div>
          </div>

          <div className="trade-panel rounded-[1.75rem] p-6 sm:p-8">
            <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700">
              Secure Sign-in
            </span>
            <h2 className="text-2xl font-bold text-slate-900">ログイン</h2>
            <p className="mt-2 text-sm leading-7 font-medium text-slate-700">
              メールアドレスを入力してすぐに利用開始できます。
            </p>
            <div className="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Access Scope</p>
              <p className="mt-1 text-sm font-medium text-slate-700">案件一覧 / AI診断 / PDFレポート / チェックリスト管理</p>
            </div>
            <div className="mt-8">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
