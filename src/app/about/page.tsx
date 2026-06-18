import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

const servicePoints = [
  {
    title: "営業担当でも使いやすい",
    description:
      "商品名・型番・輸出先国・顧客企業名を入れるだけで、輸出管理の一次確認を始められます。",
  },
  {
    title: "AIが論点を整理",
    description:
      "制裁・国リスク・用途・エンドユーザー確認など、判断に必要な論点を文章で要約します。",
  },
  {
    title: "社内共有までつながる",
    description:
      "PDFレポート、AIアクション、チェックリストまで揃っているため、そのまま上司確認へ回せます。",
  },
];

const useCases = [
  "初めて輸出する顧客の一次確認",
  "高リスク国向けの事前スクリーニング",
  "営業から法務・輸出管理への引き継ぎ",
  "決裁前の簡易リスク整理",
];

export default function AboutPage() {
  return (
    <div className="trade-surface trade-dashboard-bg min-h-screen bg-[#06111f] text-slate-800">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        {/* Hero */}
        <section className="trade-grid trade-glass-card overflow-hidden rounded-[1.9rem] px-5 py-8 sm:px-7">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="trade-section-label">
                Service Overview
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {APP_NAME} とは？
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 font-medium text-slate-700">
                {APP_NAME} は、輸出案件の一次確認をスピーディに進めるための、AIベースの輸出リスク確認サービスです。
                制裁リスト、国リスク、用途、相手先企業の実在性などをまとめて確認し、
                営業・輸出管理・法務が共通の判断材料を持てるようにします。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/demo"
                  className="trade-primary-button"
                >
                  デモを見る
                </Link>
                <Link
                  href="/?v=about"
                  className="trade-secondary-button"
                >
                  LPに戻る
                </Link>
              </div>
            </div>

            <div className="trade-panel overflow-hidden rounded-[1.75rem] p-3">
              <div className="relative overflow-hidden rounded-[1.25rem]">
                <Image
                  src="/trade-hero.png"
                  alt="輸出管理サービスの説明ビジュアル"
                  width={1792}
                  height={1024}
                  className="h-auto w-full object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/55 via-slate-900/5 to-transparent" />
                <div className="absolute left-4 top-4 rounded-2xl border border-white/20 bg-slate-950/82 px-4 py-3 text-white shadow-lg backdrop-blur">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100">Export workflow</p>
                  <p className="mt-1 text-sm font-bold text-white">案件登録 → AI診断 → 社内共有</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3カラムポイント */}
        <section className="grid gap-5 md:grid-cols-3">
          {servicePoints.map((item) => (
            <div key={item.title} className="trade-glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 font-medium text-slate-700">{item.description}</p>
            </div>
          ))}
        </section>

        {/* 2カラム機能 */}
        <section className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <div className="trade-glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">このサービスでできること</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "AI入力診断で、登録前に不足情報を把握",
                "制裁・国・用途・企業信用をまとめて調査",
                "AIが次に確認すべきアクションを提案",
                "チェックリストで確認漏れを防止",
                "PDFレポートをすぐに出力",
                "案件一覧で検索・絞り込み・並び替え",
              ].map((item) => (
                <div key={item} className="trade-soft-block px-4 py-3 text-sm font-semibold text-slate-800">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="trade-glass-card rounded-2xl p-6 text-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-500">Recommended scenes</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">こんな場面で役立ちます</h2>
            <ul className="mt-6 space-y-3">
              {useCases.map((item) => (
                <li key={item} className="trade-soft-block flex items-start gap-3 px-4 py-3 text-sm font-medium text-slate-800">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="trade-glass-card rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Quick guide</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">まず何を見ればいい？</h2>
              <p className="mt-3 text-sm leading-7 font-medium text-slate-700">
                まずはLPで概要を確認し、ログイン後に案件登録からAI診断までを試すのがおすすめです。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact?v=about"
                className="trade-primary-button"
              >
                導入について相談
              </Link>
              <Link
                href="/?v=about"
                className="trade-secondary-button"
              >
                LPを見る
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
