import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "@/components/layout/header";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "AIレビュー用概要 | Export Risk Navi",
  description:
    "Export Risk Navi の公開ページ構成、主な機能、想定ユーザーを AI が読み取りやすい形で整理した概要ページ。",
};

const publicPages = [
  { href: "/", title: "トップページ", summary: "サービス全体の価値、対象ユーザー、主機能、料金、ロードマップを紹介。" },
  { href: "/about", title: "サービス概要", summary: "サービスの目的、想定ユースケース、読解支援機能の位置づけを説明。" },
  { href: "/demo", title: "デモ画面", summary: "公開デモ用の簡易確認ページ。" },
  { href: "/glossary", title: "輸出辞典", summary: "ECCN、EAR、UBO、PEPs などの専門用語解説。" },
  { href: "/ai-room", title: "AI相談室", summary: "規制資料、通達、社内規程、条文の意味を相談できる AI 支援ページ。" },
  { href: "/learning", title: "学習コンテンツ", summary: "初心者向けの学習・注意事項・実務理解支援。" },
  { href: "/security", title: "セキュリティ", summary: "AI入力ガイドライン、機密情報、技術提供懸念への考え方。" },
  { href: "/training", title: "研修支援", summary: "営業教育、社内ルール整備、外為法セミナーなどの支援構想。" },
  { href: "/contact", title: "お問い合わせ", summary: "フィードバックと導入相談の受付ページ。" },
];

const reviewPoints = [
  "営業担当者にとって、どこに何があるか一目で分かるか",
  "信頼感・安心感・誠実感を与える業務向けデザインになっているか",
  "AI相談室の価値が、単なるチャットではなく『法令・規程の理解支援』として伝わるか",
  "公開ページだけでもサービス全体像を把握できるか",
  "Beta版としての注意書きと価値訴求のバランスが適切か",
];

export default function ForAiPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div>
            <span className="trade-section-label">AI-readable summary</span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              AIレビュー用概要
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              このページは、Export Risk Navi の公開情報を AI が読み取りやすい形で整理した概要ページです。
              GPT や Gemini のように通常ページの取得が不安定な環境でも、サービス構成と意図を把握しやすくすることを目的にしています。
            </p>
          </div>

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">サービスの要約</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Export Risk Navi は、中小企業の営業担当者や輸出管理に不慣れな担当者が、
              商談前に輸出案件の一次確認を進められるよう支援する日本語Webアプリです。
              制裁リスト、相手先企業、国リスク、用途リスク、キャッチオール規制、UBO / PEPs、
              企業信用などの観点で AI が論点整理し、確認すべき事項や次のアクションを提示します。
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              さらに、AI相談室では法令・通達・ガイドライン・社内規程・長文PDFの要点整理、
              条文の意味の言い換え、初心者向け説明、関連条文提示など、
              「輸出管理を学びながら実務を進める」ための支援も行います。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">主な公開ページ</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {publicPages.map((page) => (
                <div key={page.href} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{page.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{page.summary}</p>
                    </div>
                    <Link href={page.href} className="shrink-0 text-sm font-semibold text-[#1e3a5f] hover:underline">
                      開く
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">想定ユーザー</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>- 中小企業の営業担当者</li>
                <li>- 初めて輸出管理を担当する実務担当者</li>
                <li>- 社内規程の整備担当者</li>
                <li>- 輸出管理・法務・管理部門</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">制限事項</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>- 本サービスは法的判断を代替しません</li>
                <li>- ダッシュボードと案件管理はログイン前提です</li>
                <li>- 公開ページは誰でも閲覧可能です</li>
                <li>- Beta版のため機能や表現は継続改善中です</li>
              </ul>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">AIレビュー時の注目ポイント</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {reviewPoints.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-blue-100 bg-blue-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">AI向け補助URL</h2>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <p>
                - プレーンテキスト概要:{" "}
                <a href="/llms.txt" className="font-semibold text-[#1e3a5f] hover:underline">
                  /llms.txt
                </a>
              </p>
              <p>
                - JSONコンテキスト:{" "}
                <a href="/site-context.json" className="font-semibold text-[#1e3a5f] hover:underline">
                  /site-context.json
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}