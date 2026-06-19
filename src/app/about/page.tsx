import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/layout/header";
import { APP_NAME } from "@/lib/constants";

export const dynamic = "force-static";

const servicePoints = [
  { title: "営業担当でも使いやすい", description: "商品名・型番・輸出先国・顧客企業名を入れるだけで、輸出管理の一次確認を始められます。" },
  { title: "AIが論点を整理", description: "制裁・国リスク・用途・エンドユーザー確認など、判断に必要な論点を文章で要約します。" },
  { title: "社内共有までつながる", description: "PDFレポート、AIアクション、チェックリストまで揃っているため、そのまま上司確認へ回せます。" },
  { title: "法令・規程の読解も補助", description: "ガイドライン、通達、社内規程、長文PDFの要点整理や言い換えを通じて、新任担当者の理解を支援します。" },
];

const useCases = [
  "初めて輸出する顧客の一次確認",
  "高リスク国向けの事前スクリーニング",
  "営業から法務・輸出管理への引き継ぎ",
  "決裁前の簡易リスク整理",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="trade-section-label">Service Overview</span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{APP_NAME} とは？</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                {APP_NAME} は、輸出案件の一次確認をスピーディに進めるための、AIベースの輸出リスク確認サービスです。
                制裁リスト、国リスク、用途、相手先企業の実在性などをまとめて確認し、
                営業・輸出管理・法務が共通の判断材料を持てるようにします。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/demo" className="trade-primary-button">デモを見る</Link>
                <Link href="/?v=about" className="trade-secondary-button">LPに戻る</Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <Image src="/trade-hero.png" alt="輸出管理サービスの説明ビジュアル" width={1792} height={1024} className="h-auto w-full object-cover" priority unoptimized />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {servicePoints.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="trade-section-label">Knowledge Assistant</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">判定AIだけでなく、理解を助けるAIへ</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">読解支援でできること</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>- 法令・通達・ガイドラインの要約</li>
                <li>- 条文の意味を現場向けに言い換え</li>
                <li>- 自社輸出に関係ある箇所の抽出</li>
                <li>- 次に確認すべき点の整理</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">想定ユーザー</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>- 初めて輸出管理を担当する営業担当者</li>
                <li>- 社内規程整備を任された実務担当者</li>
                <li>- 法令資料を読み解きたい管理部門</li>
                <li>- 判断前に論点整理したい上長・責任者</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">このサービスでできること</h2>
            <div className="mt-4 space-y-2">
              {["AI入力診断で、登録前に不足情報を把握", "制裁・国・用途・企業信用をまとめて調査", "AIが次に確認すべきアクションを提案", "チェックリストで確認漏れを防止", "PDFレポートをすぐに出力", "案件一覧で検索・絞り込み・並び替え"].map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">{item}</div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="trade-section-label">Recommended Scenes</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">こんな場面で役立ちます</h2>
            <ul className="mt-4 space-y-2">
              {useCases.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#1e3a5f]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">まず何を見ればいい？</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">まずはLPで概要を確認し、ログイン後に案件登録からAI診断までを試すのがおすすめです。</p>
            </div>
            <div className="flex gap-3">
              <Link href="/contact?v=about" className="trade-primary-button">導入について相談</Link>
              <Link href="/?v=about" className="trade-secondary-button">LPを見る</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
