import Link from "next/link";

import { Header } from "@/components/layout/header";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "AIレビュー用概要",
  description:
    "輸出リスクナビ（Export Risk Navi）の公開ページ構成、主な機能、想定ユーザーをAIが読み取りやすい形で整理した概要ページです。",
  path: "/for-ai",
});

const publicPages = [
  { href: "/", title: "トップページ", summary: "サービス全体の価値、対象ユーザー、主機能、料金、ロードマップを紹介。" },
  { href: "/about", title: "サービス概要", summary: "サービスの目的、想定ユースケース、読解支援機能の位置づけを説明。" },
  { href: "/demo", title: "デモ画面", summary: "公開デモ用の簡易確認ページ。" },
  { href: "/operator", title: "運営情報", summary: "公開している運営情報、公開範囲、開示方針。" },
  { href: "/supervision", title: "監修・レビュー体制", summary: "現時点のレビュー体制と未公開範囲の整理。" },
  { href: "/evaluation-logic", title: "評価ロジック", summary: "A/B/C評価の考え方、8観点、総合判定の説明。" },
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
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 outline-none">
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

          <section className="trade-hover-lift rounded-lg border border-slate-200 bg-slate-50 p-5 transition hover:border-brand-navy/30">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-blue-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-brand-navy">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <div>
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
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">主な公開ページ</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {publicPages.map((page) => (
                <div key={page.href} className="trade-hover-lift rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-brand-navy/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-brand-navy">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{page.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{page.summary}</p>
                      </div>
                    </div>
                    <Link href={page.href} className="shrink-0 text-sm font-semibold text-brand-navy hover:underline">
                      開く
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="trade-hover-lift rounded-lg border border-slate-200 bg-slate-50 p-5 transition hover:border-brand-navy/30">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-brand-navy">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </span>
                <h2 className="text-lg font-semibold text-slate-900">想定ユーザー</h2>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {[
                  "中小企業の営業担当者",
                  "初めて輸出管理を担当する実務担当者",
                  "社内規程の整備担当者",
                  "輸出管理・法務・管理部門",
                ].map((text) => (
                  <li key={text} className="flex items-start gap-2">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="trade-hover-lift rounded-lg border border-slate-200 bg-slate-50 p-5 transition hover:border-brand-navy/30">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-brand-navy">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                </span>
                <h2 className="text-lg font-semibold text-slate-900">制限事項</h2>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {[
                  "本サービスは法的判断を代替しません",
                  "ダッシュボードと案件管理はログイン前提です",
                  "公開ページは誰でも閲覧可能です",
                  "Beta版のため機能や表現は継続改善中です",
                ].map((text) => (
                  <li key={text} className="flex items-start gap-2">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-amber-500">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.169 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="trade-hover-lift rounded-lg border border-slate-200 bg-slate-50 p-5 transition hover:border-brand-navy/30">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-brand-navy">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </span>
              <h2 className="text-lg font-semibold text-slate-900">AIレビュー時の注目ポイント</h2>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {reviewPoints.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="trade-hover-lift rounded-lg border border-blue-100 bg-blue-50 p-5 transition hover:border-brand-navy/30">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-brand-navy">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
              </span>
              <h2 className="text-lg font-semibold text-slate-900">AI向け補助URL</h2>
            </div>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <p className="flex items-start gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                <span>
                  プレーンテキスト概要:{" "}
                  <a href="/llms.txt" className="font-semibold text-brand-navy hover:underline">
                    /llms.txt
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                <span>
                  JSONコンテキスト:{" "}
                  <a href="/site-context.json" className="font-semibold text-brand-navy hover:underline">
                    /site-context.json
                  </a>
                </span>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}