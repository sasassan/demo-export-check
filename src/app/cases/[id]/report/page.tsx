import Link from "next/link";
import { notFound } from "next/navigation";

import { Shell } from "@/components/layout/shell";
import { requireSessionEmail } from "@/lib/auth/server";
import { assertCaseOwner } from "@/lib/db/repository";
import { buildReportModel } from "@/lib/reports/build-report";
import { NOINDEX_METADATA } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = NOINDEX_METADATA;

export default async function CaseReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userEmail = await requireSessionEmail();
  const { id } = await params;
  const detail = await assertCaseOwner(id, userEmail);

  if (!detail) {
    notFound();
  }

  const report = buildReportModel(detail);

  if (!report) {
    notFound();
  }

  return (
    <Shell
      title="レポート確認"
      description="PDFに出力される内容を事前に確認できます。"
    >
      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-panel p-8">
        <div>
          <p className="text-sm text-slate-500">案件ID</p>
          <p className="mt-1 text-lg font-semibold">{report.caseId}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">総合評価</p>
            <p className="mt-2 text-4xl font-semibold">{report.overallGrade}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">対象案件</p>
            <p className="mt-2 text-lg font-semibold">{report.productName}</p>
            <p className="text-sm text-slate-600">{report.customerCompanyName}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold">要約</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{report.summary}</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            {report.reportNarrative}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "国リスク",
              items: report.dimensions.filter((item) => item.dimension === "country"),
            },
            {
              title: "エンドユーザーリスク",
              items: report.dimensions.filter((item) =>
                ["sanctions", "endUser", "ubo", "peps"].includes(item.dimension),
              ),
            },
            {
              title: "用途リスク",
              items: report.dimensions.filter((item) =>
                ["useCase", "catchAll", "reputation"].includes(item.dimension),
              ),
            },
          ].map((group) => (
            <div key={group.title} className="rounded-2xl border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-900">{group.title}</h2>
              <div className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <div key={item.dimension} className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm font-medium text-slate-600">
                        {item.grade} / {item.score}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-tint-blue/50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">推奨アクション</h2>
          <div className="mt-4 space-y-3">
            {report.nextActions.map((action, index) => (
              <div key={action} className="rounded-xl border border-slate-200 bg-panel px-4 py-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-deep text-xs font-bold !text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-700">{action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">ご利用にあたって</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            本サービスは専門家の判断を補助するツールです。詳細は
            <Link href="/terms" className="font-semibold text-brand-navy hover:underline">
              利用規約
            </Link>
            をご確認ください。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {report.dimensions.map((item) => (
            <div
              key={item.dimension}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{item.label}</p>
                <p className="text-sm font-medium">
                  {item.grade} / {item.score}
                </p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.rationale}</p>
            </div>
          ))}
        </div>

        <a
          href={`/api/reports/${report.caseId}/pdf`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit rounded-full bg-panel px-5 py-3 text-sm font-medium text-white"
        >
          PDFを生成して開く
        </a>
      </section>
    </Shell>
  );
}