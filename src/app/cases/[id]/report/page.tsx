import { notFound } from "next/navigation";

import { Shell } from "@/components/layout/shell";
import { requireSessionEmail } from "@/lib/auth/server";
import { assertCaseOwner } from "@/lib/db/repository";
import { buildReportModel } from "@/lib/reports/build-report";

export const dynamic = "force-dynamic";

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
      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8">
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

        <div className="rounded-2xl border border-slate-200 bg-blue-50/50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">推奨アクション</h2>
          <div className="mt-4 space-y-3">
            {report.nextActions.map((action, index) => (
              <div key={action} className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold !text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-700">{action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-lg font-semibold text-amber-900">免責事項</h2>
          <p className="mt-3 text-sm leading-7 text-amber-800">
            本サービスは参考情報を提供するものであり、法令上の判断を代替するものではありません。
            最終的な輸出可否の判断は利用者自身の責任で実施してください。
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
          className="inline-flex w-fit rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
        >
          PDFを生成して開く
        </a>
      </section>
    </Shell>
  );
}