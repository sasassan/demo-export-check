import Link from "next/link";

import { Shell } from "@/components/layout/shell";
import { DictionarySearch } from "@/components/glossary/dictionary-search";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "輸出コンプライアンス用語辞典",
  description:
    "該非判定・リスト規制・キャッチオール規制・EAR・ITAR・みなし輸出・最終需要者証明など、輸出管理・安全保障貿易の専門用語をカテゴリ別に解説する用語辞典です。",
  path: "/glossary",
  keywords: ["該非判定", "リスト規制", "輸出貿易管理令", "みなし輸出", "ITAR", "包括許可"],
});

type Term = {
  term: string;
  full?: string;
  category: Category;
  description: string;
  example?: string;
  related?: string[];
};

const CATEGORIES = ["輸出管理基本用語", "国際規制", "手続き関連", "リスク評価"] as const;

type Category = (typeof CATEGORIES)[number];

const TERMS: Term[] = [
  // ── 輸出管理基本用語 ─────────────────────────────────────────────
  {
    term: "該非判定",
    full: "品目該当性判定",
    category: "輸出管理基本用語",
    description:
      "輸出する貨物・技術が輸出規制リスト（輸出貿易管理令別表第1等）に該当するか否かを判定する作業です。型番・仕様・性能をもとに技術的に判断し、その結果をパラメータシート（該当性判定書）にまとめます。",
    example: "該非判定を誤ると無許可輸出につながるため、技術部門と輸出管理部門の連携が欠かせません。",
    related: ["リスト規制", "キャッチオール規制", "該当性判定書"],
  },
  {
    term: "リスト規制",
    full: "輸出貿易管理令別表第1",
    category: "輸出管理基本用語",
    description:
      "輸出貿易管理令別表第1に掲載された貨物・技術を対象に、輸出先地域や数量に関わらず輸出・技術提供に許可を義務付ける規制です。武器、高性能工作機械、半導体製造装置などが対象となります。",
    example: "別表第1に該当する品目は、たとえ1個でも輸出許可が必要になります。",
    related: ["該非判定", "輸出貿易管理令", "外為法"],
  },
  {
    term: "キャッチオール規制",
    full: "Catch-All Controls",
    category: "輸出管理基本用語",
    description:
      "リスト規制の対象外であっても、大量破壊兵器（WMD）等の開発・製造・使用に用いられるおそれがあると知った場合に、経済産業大臣の許可を義務付ける規制です。リスト非該当でも用途・需要者の確認が必須になります。",
    example: "非該当品でも軍事転用が疑われる場合は許可申請が必要です。",
    related: ["リスト規制", "該非判定", "最終用途"],
  },
  {
    term: "外為法",
    full: "外国為替及び外国貿易法",
    category: "輸出管理基本用語",
    description:
      "日本の輸出管理を規定する基本法です。経済産業省が所管し、安全保障上の理由から特定の貨物・技術の輸出を規制します。違反時には懲役・罰金などの罰則が科されます。",
    example: "外為法に基づく規制対象かどうかが、輸出可否の出発点になります。",
    related: ["輸出貿易管理令", "リスト規制", "技術提供"],
  },
  {
    term: "輸出貿易管理令",
    full: "輸出令",
    category: "輸出管理基本用語",
    description:
      "外為法に基づく政令で、輸出許可の要否や規制対象品目の枠組みを定めます。具体的な品目リストは別表で規定され、該非判定の基準となります。",
    example: "別表第1（リスト規制）と別表第3（キャッチオール規制）が中心です。",
    related: ["外為法", "リスト規制", "該非判定"],
  },
  {
    term: "技術提供",
    full: "技術の移転",
    category: "輸出管理基本用語",
    description:
      "貨物の輸出だけでなく、設計図・仕様書・プログラム・ノウハウなどの技術情報を外国に提供することを指します。外為法上、貨物の輸出と同様に規制対象となります。",
    example: "図面やソースコードの海外送付も「技術提供」として規制対象になり得ます。",
    related: ["みなし輸出", "外為法", "リスト規制"],
  },
  {
    term: "みなし輸出",
    full: "Deemed Export",
    category: "輸出管理基本用語",
    description:
      "日本国内に居住する外国人や非居住者に対して規制対象の技術を提供する行為を「輸出」とみなして規制する制度です。国内の外国籍社員への技術開示も対象になる場合があります。",
    example: "社内の外国人技術者への技術移転にも注意が必要です。",
    related: ["技術提供", "外為法", "該非判定"],
  },
  {
    term: "デュアルユース",
    full: "Dual Use",
    category: "輸出管理基本用語",
    description:
      "民生用途と軍事用途の両方に使用可能な貨物・技術・ソフトウェアのことです。半導体、暗号技術、精密機器、センサーなどが典型例で、輸出規制の主要な対象になります。",
    example: "高性能GPUは民生AI用途にも軍事用途にも使用可能なデュアルユース品目です。",
    related: ["ECCN", "該非判定", "ワッセナー・アレンジメント"],
  },
  {
    term: "安全保障貿易管理",
    full: "Security Export Control",
    category: "輸出管理基本用語",
    description:
      "国際的な平和と安全の維持を目的に、機微な貨物・技術の輸出を管理する仕組みです。日本の輸出管理はこの考え方に基づき、リスト規制とキャッチオール規制を柱としています。",
    example: "社内に安全保障貿易管理の責任者と内部規程（ICP）を置くことが推奨されます。",
    related: ["外為法", "リスト規制", "キャッチオール規制"],
  },

  // ── 国際規制 ─────────────────────────────────────────────────────
  {
    term: "EAR",
    full: "Export Administration Regulations",
    category: "国際規制",
    description:
      "米国商務省産業安全保障局（BIS）が管轄する輸出管理規則です。デュアルユース品目の輸出・再輸出・国内移転を規制し、ECCNと照合して輸出許可の要否を判断します。",
    example: "米国原産品を一定割合含む製品は、第三国輸出にもEARが適用されることがあります。",
    related: ["ECCN", "再輸出", "Entity List"],
  },
  {
    term: "ITAR",
    full: "International Traffic in Arms Regulations",
    category: "国際規制",
    description:
      "米国国務省が管轄する国際武器取引規則です。軍需品目リスト（USML）に該当する防衛関連の品目・技術・役務の輸出・移転を厳格に規制します。",
    example: "防衛関連の技術移転ではEARよりもITARの方が厳格な場合があります。",
    related: ["EAR", "デュアルユース"],
  },
  {
    term: "ワッセナー・アレンジメント",
    full: "Wassenaar Arrangement",
    category: "国際規制",
    description:
      "通常兵器および関連汎用品・技術の輸出管理に関する国際的な枠組みです。参加国の国内法に反映され、日本の輸出令別表の品目リストのベースにもなっています。",
    example: "日本のリスト規制品目はワッセナー・アレンジメントのリストに基づいています。",
    related: ["リスト規制", "デュアルユース", "EU規制"],
  },
  {
    term: "国連安保理決議",
    full: "UN Security Council Resolution",
    category: "国際規制",
    description:
      "国際連合安全保障理事会の決議です。経済制裁や禁輸措置などを加盟国に義務付け、日本の輸出管理でも制裁対象国・品目の指定に反映されます。",
    example: "制裁対象国への輸出可否は、関連する安保理決議と国内法を併せて確認します。",
    related: ["OFAC", "SDN", "制裁スクリーニング"],
  },
  {
    term: "EU規制",
    full: "EU Dual-Use Regulation",
    category: "国際規制",
    description:
      "EUのデュアルユース品目輸出管理規則（2021/821）です。EU域内から第三国へのデュアルユース品目の輸出許可の要否を定めています。",
    example: "EU拠点からの輸出では、EU規制の品目リストと許可制度を確認する必要があります。",
    related: ["ワッセナー・アレンジメント", "リスト規制", "デュアルユース"],
  },
  {
    term: "ECCN",
    full: "Export Control Classification Number",
    category: "国際規制",
    description:
      "米国商務省が定める輸出管理分類番号です。EARの対象品目に付与され、どの国・用途・最終需要者に対して輸出が規制されるかを決定します。",
    example: "ECCNが付与されなくてもEAR99として規制対象になる場合があります。",
    related: ["EAR", "デュアルユース", "該非判定"],
  },
  {
    term: "OFAC",
    full: "Office of Foreign Assets Control",
    category: "国際規制",
    description:
      "米国財務省外国資産管理局です。経済制裁プログラムを管理し、SDNリストを公開しています。米ドル決済を含む取引に対して制裁を執行します。",
    example: "米ドル建て取引は米国の管轄に入るため、日本企業もOFAC規制の影響を受けます。",
    related: ["SDN", "制裁スクリーニング", "国連安保理決議"],
  },
  {
    term: "SDN",
    full: "Specially Designated Nationals",
    category: "国際規制",
    description:
      "OFACが指定する制裁対象の個人・団体リストです。SDNとの取引・資産保有は米国法上原則禁止され、リストは頻繁に更新されます。",
    example: "取引開始前にSDNリストとの照合を行い、該当がないことを確認します。",
    related: ["OFAC", "制裁スクリーニング"],
  },
  {
    term: "Entity List",
    full: "BIS Entity List",
    category: "国際規制",
    description:
      "米国BISが管理する輸出規制対象の企業・団体リストです。掲載先への米国製品・技術の輸出には原則として特別な許可が必要になります。",
    example: "取引先がEntity Listに掲載された場合は、輸出可否を再確認する必要があります。",
    related: ["EAR", "エンドユーザー", "制裁スクリーニング"],
  },

  // ── 手続き関連 ───────────────────────────────────────────────────
  {
    term: "輸出許可申請",
    full: "輸出許可の申請",
    category: "手続き関連",
    description:
      "規制対象の貨物・技術を輸出する際に、経済産業大臣に対して行う許可の申請です。該非判定の結果、最終需要者情報、用途などを添付します。",
    example: "許可取得までに時間がかかるため、営業段階での前倒し準備が重要です。",
    related: ["個別許可", "包括許可", "最終需要者証明書"],
  },
  {
    term: "包括許可",
    full: "包括輸出許可",
    category: "手続き関連",
    description:
      "一定の条件（輸出先・品目・内部管理体制など）を満たす場合に、個別の輸出ごとではなく包括的に認められる輸出許可です。取引頻度が高い企業の手続き負担を軽減します。",
    example: "包括許可の取得・維持には内部規程（ICP）の整備と運用が条件になります。",
    related: ["個別許可", "輸出許可申請", "安全保障貿易管理"],
  },
  {
    term: "個別許可",
    full: "個別輸出許可",
    category: "手続き関連",
    description:
      "個々の取引ごとに取得する輸出許可です。包括許可の対象とならない輸出先・品目・需要者の場合に必要になります。",
    example: "制裁対象国向けや懸念品目では、原則として個別許可が必要です。",
    related: ["包括許可", "輸出許可申請"],
  },
  {
    term: "最終需要者証明書",
    full: "End User Certificate（EUC）",
    category: "手続き関連",
    description:
      "輸出品の最終的な使用者（エンドユーザー）と用途を証明する書類です。軍事転用や第三国への再輸出がないことを確認するために使用され、輸出許可申請時に提出が求められる場合があります。",
    example: "形式だけでなく、記載内容が実態と一致しているかの確認が重要です。",
    related: ["最終用途", "エンドユーザー", "輸出許可申請"],
  },
  {
    term: "該当性判定書",
    full: "パラメータシート",
    category: "手続き関連",
    description:
      "該非判定の結果をまとめた社内文書です。対象品目番号、判定結果（該当・非該当）、根拠となる仕様・性能データを記載し、監査や許可申請の証跡として保管します。",
    example: "判定の根拠となるスペック値を残すことで、後日の追跡可能性が高まります。",
    related: ["該非判定", "リスト規制", "輸出許可申請"],
  },
  {
    term: "事前相談",
    full: "輸出管理相談",
    category: "手続き関連",
    description:
      "規制該当性の判断が難しい場合に、経済産業省や安全保障貿易情報センター（CISTEC）などへ行う事前の相談です。判定の確度を高めるために活用されます。",
    example: "グレーゾーンの品目は、独断で非該当とせず事前相談が有効です。",
    related: ["該非判定", "輸出許可申請", "安全保障貿易管理"],
  },
  {
    term: "再輸出禁止条項",
    full: "Non-Re-Export Clause",
    category: "手続き関連",
    description:
      "販売契約・エンドユーザー合意書に盛り込む、第三国への再輸出を禁止または制限する条項です。輸出者の法的リスクを軽減し、取引の透明性を高めます。",
    example: "「第三国へ再輸出する場合は輸出者の事前承認を要する」と明記します。",
    related: ["再輸出", "最終用途", "最終需要者証明書"],
  },

  // ── リスク評価 ───────────────────────────────────────────────────
  {
    term: "エンドユーザー",
    full: "End User / 最終需要者",
    category: "リスク評価",
    description:
      "製品を最終的に使用する個人・組織（最終需要者）です。輸出管理ではエンドユーザーの実在性・信頼性・制裁該当性の確認が重要になります。",
    example: "再販目的の取引先では、さらに先の最終需要者の確認が必要です。",
    related: ["最終用途", "最終需要者証明書", "UBO"],
  },
  {
    term: "最終用途",
    full: "End Use",
    category: "リスク評価",
    description:
      "製品の最終的な使われ方です。軍事転用や大量破壊兵器の開発への転用リスクを評価する上で、用途の特定と書面での確認が欠かせません。",
    example: "用途が曖昧な案件では、用途確認書の回収とヒアリングを進めます。",
    related: ["エンドユーザー", "迂回リスク", "キャッチオール規制"],
  },
  {
    term: "迂回リスク",
    full: "Diversion Risk",
    category: "リスク評価",
    description:
      "第三国や仲介業者を経由して、規制対象国・規制対象需要者へ貨物・技術が渡ってしまうリスクです。経由地や最終需要先の確認によって低減します。",
    example: "表向きの輸出先と異なる最終需要先が疑われる場合は要注意です。",
    related: ["再輸出", "仲介貿易", "最終用途"],
  },
  {
    term: "仲介貿易",
    full: "仲介貿易取引",
    category: "リスク評価",
    description:
      "日本企業が第三国間の取引を仲介する形態です。貨物が日本を経由しなくても、外為法上の規制対象となる場合があるため注意が必要です。",
    example: "外国間の売買を仲介するだけでも、品目・需要者によっては規制対象になり得ます。",
    related: ["迂回リスク", "再輸出", "該非判定"],
  },
  {
    term: "再輸出",
    full: "Re-export",
    category: "リスク評価",
    description:
      "輸入した貨物を別の国へ再び輸出することです。米国原産品の場合、第三国への再輸出にもEARの規制が適用されることがあります。",
    example: "米国から輸入した部品を組み込んだ製品の第三国輸出では再輸出規制を確認します。",
    related: ["EAR", "再輸出禁止条項", "迂回リスク"],
  },
  {
    term: "赤旗シグナル",
    full: "Red Flag Indicators",
    category: "リスク評価",
    description:
      "不審な取引を示す警告サインです。「現金一括払いの希望」「用途を明かさない顧客」「技術サポートを断る」などが含まれます。赤旗を無視すると知情責任を問われる可能性があります。",
    example: "顧客が最終用途を説明しない場合は赤旗として調査が必要です。",
    related: ["最終用途", "エンドユーザー", "迂回リスク"],
  },
  {
    term: "制裁スクリーニング",
    full: "Sanctions Screening",
    category: "リスク評価",
    description:
      "取引先が制裁リスト（SDN等）に掲載されていないか照合する作業です。リストは頻繁に更新されるため、取引開始時だけでなく定期的な再確認が求められます。",
    example: "社名の表記揺れを考慮し、複数の表記で照合することが推奨されます。",
    related: ["SDN", "OFAC", "UBO"],
  },
  {
    term: "UBO",
    full: "Ultimate Beneficial Owner",
    category: "リスク評価",
    description:
      "実質的支配者です。法人の株式・議決権を一定割合以上保有するか、取締役会等を通じて実質的に支配する自然人を指し、制裁対象者との間接取引を防ぐために確認します。",
    example: "子会社・ペーパーカンパニー経由で支配する個人の特定が必要です。",
    related: ["エンドユーザー", "PEPs", "制裁スクリーニング"],
  },
  {
    term: "PEPs",
    full: "Politically Exposed Persons",
    category: "リスク評価",
    description:
      "政治的に影響力のある人物です。国家元首、政府高官、議員、裁判官、上位軍人などが該当し、腐敗・贈収賄・マネーロンダリングのリスクが高いため、強化した確認（デューデリジェンス）が必要です。",
    example: "取引相手が議員・外交官・国営企業役員の場合は要注意です。",
    related: ["UBO", "エンドユーザー", "制裁スクリーニング"],
  },
];

function slugify(term: string): string {
  return term
    .toLowerCase()
    .replace(/（.*?）|\(.*?\)/g, "")
    .replace(/[・、。／]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const TERM_SLUGS = new Map(TERMS.map((t) => [t.term, slugify(t.term)]));

const glossaryJsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "輸出コンプライアンス用語辞典",
  description:
    "該非判定・リスト規制・キャッチオール規制・EAR・ITAR・みなし輸出など、輸出管理・安全保障貿易の専門用語を解説する用語辞典です。",
  hasDefinedTerm: TERMS.map((t) => ({
    "@type": "DefinedTerm",
    name: t.term,
    ...(t.full ? { alternateName: t.full } : {}),
    description: t.description,
  })),
};

export default function GlossaryPage() {
  return (
    <Shell title="輸出用語辞典">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(glossaryJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="trade-hover-lift border border-slate-200 bg-panel rounded-xl p-6 transition hover:border-brand-navy/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-tint-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-brand-navy">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">輸出コンプライアンス用語辞典</h1>
            <p className="text-sm text-slate-500">
              該非判定・リスト規制・国際規制・手続き・リスク評価まで、実務で必要な専門用語を解説します
            </p>
          </div>
        </div>

        <nav aria-label="カテゴリ一覧" className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`#${slugify(cat)}`}
              className="rounded-full border border-slate-200 bg-tint-blue px-3 py-1 text-xs font-medium text-slate-700 hover:border-brand-navy/40 hover:text-brand-navy"
            >
              {cat}
            </a>
          ))}
        </nav>
      </div>

      <DictionarySearch />

      <div className="trade-hover-lift border border-slate-200 bg-panel rounded-xl p-6 transition hover:border-brand-navy/30">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-navy">AIの活用方法</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">用語辞典と資料読解補助を組み合わせる</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            "まず用語辞典で単語の意味を確認",
            "次にAI相談室で条文や規程の文脈を質問",
            "最後に案件化して実務フローへつなぐ",
          ].map((item, index) => (
            <div key={item} className="trade-hover-lift flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-600 transition hover:border-brand-navy/30">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-deep text-[11px] font-bold !text-white">
                {index + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        {CATEGORIES.map((category) => {
          const categoryTerms = TERMS.filter((t) => t.category === category);
          return (
            <section key={category} id={slugify(category)} className="scroll-mt-24">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-xl font-black text-slate-900">{category}</h2>
                <span className="rounded-full border border-slate-200 bg-tint-blue px-2.5 py-0.5 text-xs font-medium text-brand-navy">
                  {categoryTerms.length}件
                </span>
              </div>
              <div className="space-y-4">
                {categoryTerms.map((item) => (
                  <div
                    key={item.term}
                    id={TERM_SLUGS.get(item.term)}
                    className="trade-hover-lift scroll-mt-24 border border-slate-200 bg-panel rounded-xl p-6 transition hover:border-brand-navy/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-tint-blue">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-brand-navy">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                          </svg>
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-black text-slate-900">{item.term}</h3>
                            <span className="rounded-full border border-slate-200 bg-tint-blue px-2.5 py-0.5 text-xs font-medium text-brand-navy">
                              {item.category}
                            </span>
                          </div>
                          {item.full && (
                            <p className="mt-0.5 text-sm text-slate-500">{item.full}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-slate-700">{item.description}</p>

                    {item.example && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 mt-3 flex items-start gap-2 px-3 py-2">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-semibold text-brand-navy flex-shrink-0 mt-0.5">
                          活用例
                        </span>
                        <p className="text-xs text-slate-600">{item.example}</p>
                      </div>
                    )}

                    {item.related && item.related.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">関連用語:</span>
                        {item.related.map((relatedTerm) => {
                          const slug = TERM_SLUGS.get(relatedTerm);
                          if (!slug) return null;
                          return (
                            <Link
                              key={relatedTerm}
                              href={`#${slug}`}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-brand-navy hover:border-brand-navy/40 hover:bg-tint-blue"
                            >
                              {relatedTerm}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="rounded-xl border border-tint-blue-bright bg-slate-50 p-6 shadow-sm">
        <p className="text-sm text-amber-300">
          本用語集は一次確認のサポート情報です。法令の解釈・適用は、輸出管理担当者・弁護士などの専門家と併せてご確認ください。
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          <Link
            href="/learning"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:text-brand-navy-light"
          >
            学習コンテンツで基礎を学ぶ →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300"
          >
            ← トップページへ戻る
          </Link>
        </div>
      </div>
    </Shell>
  );
}
