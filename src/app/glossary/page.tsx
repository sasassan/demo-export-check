import Link from "next/link";
import { Shell } from "@/components/layout/shell";
import { DictionarySearch } from "@/components/glossary/dictionary-search";

const TERMS = [
  {
    term: "ECCN",
    full: "Export Control Classification Number",
    category: "輸出規制",
    description:
      "米国商務省産業安全保障局（BIS）が定める輸出管理分類番号。EARの対象品目に付与され、どの国・用途・最終需要者に対して輸出が規制されるかを決定する。",
    example: "例: 5E002はセキュリティ関連ソフトウェアを示す",
  },
  {
    term: "EAR",
    full: "Export Administration Regulations",
    category: "輸出規制",
    description:
      "米国商務省が管轄する輸出管理規則。デュアルユース品目（民間・軍事両用製品）の輸出・再輸出・国内移転を規制する。ECCN番号と照合して輸出許可の要否を判断する。",
    example: "EAR99は比較的低リスクな品目に付与される",
  },
  {
    term: "PEPs",
    full: "Politically Exposed Persons",
    category: "AML/コンプライアンス",
    description:
      "政治的影響力のある人物（PEPs）。国家元首、政府高官、議員、裁判官、上位軍人などが該当する。PEPsとの取引には腐敗・贈収賄・マネーロンダリングリスクが伴うため、強化デューデリジェンスが必要。",
    example: "取引相手が議員・外交官・国営企業役員の場合は要注意",
  },
  {
    term: "UBO",
    full: "Ultimate Beneficial Owner",
    category: "AML/コンプライアンス",
    description:
      "実質的支配者。法人の株式・議決権を25%超保有するか、取締役会等を通じて実質的に支配する自然人。マネーロンダリング対策としてUBOの特定・確認が義務化されている国が多い。",
    example: "子会社・ペーパーカンパニー経由で支配する個人を特定する",
  },
  {
    term: "OFAC",
    full: "Office of Foreign Assets Control",
    category: "制裁",
    description:
      "米国財務省外国資産管理局。SDNリスト（特別指定国民・団体リスト）を管理し、米国人・米ドル決済を含む取引に対して制裁を執行する。違反時は民事・刑事罰が科される。",
    example: "SDNリストに掲載された企業・個人との取引は原則禁止",
  },
  {
    term: "SDN",
    full: "Specially Designated Nationals",
    category: "制裁",
    description:
      "OFACが指定する制裁対象の個人・団体リスト。SDNとの取引・資産保有は米国法上禁止。米国外の企業も米国人・米ドル・米金融機関を介する取引では適用される。",
    example: "SDNに掲載された銀行との送金は凍結対象",
  },
  {
    term: "キャッチオール規制",
    full: "Catch-All Controls",
    category: "輸出規制",
    description:
      "輸出規制リストに掲載されていない品目であっても、大量破壊兵器（WMD）や通常兵器の開発・製造・使用に転用される恐れがあると知った場合に輸出許可を義務付ける規制。日本では外為法に基づく。",
    example: "非該当品でも軍事用途への転用が疑われる場合は許可申請が必要",
  },
  {
    term: "デュアルユース",
    full: "Dual Use",
    category: "輸出規制",
    description:
      "民間利用と軍事利用の両方に使用可能な製品・技術・ソフトウェア。輸出規制の主要対象であり、ECCNで分類される。半導体、暗号技術、精密機器、センサーなどが典型例。",
    example: "高性能GPUは民間AI用途にも軍事用途にも使用可能なデュアルユース品目",
  },
  {
    term: "EUC",
    full: "End User Certificate / 最終用途証明書",
    category: "取引確認",
    description:
      "輸出品の最終的な用途と使用者を証明する書類。輸出者がエンドユーザーから取得し、軍事転用・第三国再輸出がないことを確認するために使用される。輸出許可申請の際に提出が求められる場合がある。",
    example: "民間用途としての最終用途証明書を取得することで用途リスクが低減する",
  },
  {
    term: "外為法",
    full: "外国為替及び外国貿易法",
    category: "日本法規制",
    description:
      "日本の輸出管理を規定する主要法律。経済産業省が所管し、リスト規制品目（別表第1）とキャッチオール規制（別表第3）により輸出許可の要否を定める。違反時は懲役・罰金が科される。",
    example: "別表第1に該当する品目は地域・数量に関わらず輸出許可が必要",
  },
  {
    term: "再輸出禁止条項",
    full: "Non-Re-Export Clause",
    category: "契約",
    description:
      "販売契約・エンドユーザー合意書に盛り込む条項。購入者が第三国へ製品を再輸出することを禁止または制限する。輸出者の法的リスクを軽減し、取引の透明性を高める。",
    example: "契約書に「本製品を第三国へ再輸出する場合は輸出者の事前承認を要する」と明記",
  },
  {
    term: "赤旗シグナル",
    full: "Red Flag Indicators",
    category: "コンプライアンス",
    description:
      "不審な取引を示す警告サイン。BISが公表するレッドフラッグには「現金一括払いの希望」「用途を明かさない顧客」「技術サポートを断る」などが含まれる。赤旗を無視した場合、知情責任を問われる可能性がある。",
    example: "顧客が製品の最終用途を説明しない場合は赤旗として調査が必要",
  },
];

const CATEGORIES = [...new Set(TERMS.map((t) => t.category))];

export default function GlossaryPage() {
  return (
    <Shell title="輸出用語辞典">
      <div className="trade-glass-card rounded-[1.9rem] p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-cyan-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-indigo-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">輸出コンプライアンス用語辞典</h1>
            <p className="text-sm text-slate-500">レポートに登場する専門用語を解説します</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <DictionarySearch />

      <div className="space-y-4">
        {TERMS.map((item) => (
          <div
            key={item.term}
            id={item.term.toLowerCase().replace(/\s+/g, "-")}
            className="trade-glass-card rounded-[1.75rem] p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">{item.term}</h2>
                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                    {item.category}
                  </span>
                </div>
                {item.full && (
                  <p className="mt-0.5 text-sm text-slate-500">{item.full}</p>
                )}
              </div>
            </div>

            <p className="mt-3 text-sm leading-7 text-slate-700">{item.description}</p>

            {item.example && (
              <div className="trade-soft-block mt-3 flex items-start gap-2 px-3 py-2">
                <span className="text-xs font-semibold text-indigo-600 flex-shrink-0 mt-0.5">
                  活用例
                </span>
                <p className="text-xs text-slate-600">{item.example}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-[1.75rem] border border-cyan-200/50 bg-cyan-50/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <p className="text-sm text-amber-800">
          本用語集は参考情報として提供しています。法令の解釈・適用については必ず専門家（輸出管理担当者・弁護士・行政書士）にご相談ください。
        </p>
        <Link
          href="/"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-900"
        >
          ← トップページへ戻る
        </Link>
      </div>
    </Shell>
  );
}
