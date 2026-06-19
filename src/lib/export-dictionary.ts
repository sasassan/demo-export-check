type DictionaryEntry = {
  term: string;
  simpleExplanation: string;
  practicalUse: string;
  caution: string;
  relatedRisk: string;
  relatedFeatures: { label: string; href: string }[];
  referenceLinks?: { label: string; href: string }[];
};

const dictionary: DictionaryEntry[] = [
  {
    term: "EAR（Export Administration Regulations）",
    simpleExplanation: "米国の輸出管理規則。米国製品・技術・ソフトウェアの輸出・再輸出を規制するルールです。",
    practicalUse: "米国製部品を含む製品を第三国へ輸出する場合、EARの対象か確認が必要です。",
    caution: "米国外の企業でも、米国原産品を25%以上含む場合にEARが適用される可能性があります。",
    relatedRisk: "再輸出規制違反、みなし輸出、Entity List掲載企業への供給リスク。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }, { label: "AI相談室", href: "/ai-room" }],
    referenceLinks: [{ label: "BIS公式サイト", href: "https://www.bis.doc.gov/index.php/regulations/export-administration-regulations-ear" }],
  },
  {
    term: "ECCN（Export Control Classification Number）",
    simpleExplanation: "米国の輸出規制品目分類番号。製品が輸出規制の対象かどうかを判定するための番号です。",
    practicalUse: "輸出する製品のECCN番号を特定し、輸出先国との関係で許可が必要か確認します。",
    caution: "ECCNが付与されていなくてもEAR99として規制対象になる場合があります。",
    relatedRisk: "品目分類の誤りによる規制違反、許可なし輸出のリスク。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }],
    referenceLinks: [{ label: "Commerce Control List", href: "https://www.bis.doc.gov/index.php/regulations/commerce-control-list-ccl" }],
  },
  {
    term: "インコタームズ（Incoterms）",
    simpleExplanation: "国際商業会議所が定めた貿易条件の国際ルール。売主と買主のコスト・リスク分担を明確にします。",
    practicalUse: "見積書・契約書で「FOB」「CIF」等の条件を使い、輸送中の責任範囲を決定します。",
    caution: "条件によって保険・輸送費の負担者が変わるため、契約前に双方で確認が必要です。",
    relatedRisk: "条件の誤解による責任範囲の不一致、保険未加入リスク。",
    relatedFeatures: [{ label: "AI相談室", href: "/ai-room" }],
  },
  {
    term: "キャッチオール規制",
    simpleExplanation: "リスト規制品目に該当しない製品でも、大量破壊兵器の開発等に使われる恐れがある場合に輸出を規制する仕組みです。",
    practicalUse: "リスト規制に該当しない製品でも、用途・需要者に懸念がある場合は経産省への事前相談が必要です。",
    caution: "「リスト外だから大丈夫」ではなく、用途確認・需要者確認を必ず行う必要があります。",
    relatedRisk: "大量破壊兵器関連の用途転用リスク、キャッチオール規制違反。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }, { label: "AI相談室", href: "/ai-room" }],
    referenceLinks: [{ label: "経産省キャッチオール規制", href: "https://www.meti.go.jp/policy/anpo/apply08.html" }],
  },
  {
    term: "UBO（Ultimate Beneficial Owner）",
    simpleExplanation: "最終的な実質支配者。法人の背後で実質的に支配している個人のことです。",
    practicalUse: "取引先企業の実質支配者が制裁対象者でないかを確認する際に使用します。",
    caution: "表面上の株主と実質支配者が異なる場合があり、調査が複雑になることがあります。",
    relatedRisk: "制裁対象者との間接取引リスク、マネーロンダリングリスク。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }],
  },
  {
    term: "PEPs（Politically Exposed Persons）",
    simpleExplanation: "重要な公的地位にある人物。国家元首、政府高官、軍幹部とその家族を指します。",
    practicalUse: "取引先の関係者にPEPsが含まれていないかの確認が金融規制で求められます。",
    caution: "PEPs自体が違法ではありませんが、贈収賄・マネーロンダリングのリスクが高いとされます。",
    relatedRisk: "贈収賄リスク、コンプライアンス違反リスク。",
    relatedFeatures: [{ label: "AI相談室", href: "/ai-room" }],
  },
  {
    term: "外為法（外国為替及び外国貿易法）",
    simpleExplanation: "日本の輸出管理の基本法。安全保障上の理由から、特定の製品・技術の輸出を規制しています。",
    practicalUse: "日本から製品を輸出する際に、外為法の規制対象か確認する最初のステップです。",
    caution: "技術の提供（図面・ノウハウの海外送付）も「みなし輸出」として規制対象になります。",
    relatedRisk: "リスト規制違反、キャッチオール規制違反、罰則（10年以下の懲役等）。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }, { label: "学習コンテンツ", href: "/learning" }],
    referenceLinks: [{ label: "経産省安全保障貿易管理", href: "https://www.meti.go.jp/policy/anpo/" }],
  },
  {
    term: "輸出令別表第一",
    simpleExplanation: "外為法に基づくリスト規制品目の一覧表。武器や高性能工作機械、半導体製造装置などが掲載されています。",
    practicalUse: "自社製品が別表の品目に該当するかを型番・仕様書をもとに確認します。",
    caution: "品目該当性判定は専門知識が必要なため、安全保障貿易管理センター(CISTEC)等への相談も有効です。",
    relatedRisk: "品目該当性の誤判定、無許可輸出リスク。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }],
    referenceLinks: [{ label: "CISTEC", href: "https://www.cistec.or.jp/" }],
  },
  {
    term: "EUC（End User Certificate / 最終需要者証明書）",
    simpleExplanation: "製品の最終的な利用者と用途を証明する書類。輸出許可申請時に添付が求められることがあります。",
    practicalUse: "輸出先の顧客企業に署名してもらい、軍事転用しないことを書面で確認します。",
    caution: "形式だけでなく、記載内容が実態と一致しているかの確認が重要です。",
    relatedRisk: "最終需要者の偽装リスク、用途変更リスク。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }],
  },
  {
    term: "みなし輸出（Deemed Export）",
    simpleExplanation: "技術情報を国内にいる外国人に提供することも「輸出」とみなす規制。図面やノウハウの提供も対象です。",
    practicalUse: "外国人技術者への技術移転、海外拠点との技術共有時に確認が必要です。",
    caution: "社内にいる外国籍社員への技術開示も対象になる場合があります。",
    relatedRisk: "技術提供による規制違反、罰則リスク。",
    relatedFeatures: [{ label: "AI相談室", href: "/ai-room" }, { label: "学習コンテンツ", href: "/learning" }],
  },
  {
    term: "OFAC（Office of Foreign Assets Control）",
    simpleExplanation: "米国財務省の外国資産管理室。経済制裁プログラムを管理し、SDNリスト等を公開しています。",
    practicalUse: "取引先がOFACの制裁リストに掲載されていないかを確認します。",
    caution: "米ドル建て取引は米国の管轄に入るため、日本企業でもOFAC規制の影響を受けます。",
    relatedRisk: "制裁違反による二次制裁リスク、取引停止リスク。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }],
    referenceLinks: [{ label: "OFAC公式", href: "https://ofac.treasury.gov/" }],
  },
  {
    term: "SDNリスト（Specially Designated Nationals）",
    simpleExplanation: "OFACが公開する制裁対象リスト。このリストに掲載された個人・企業とは取引が禁止されます。",
    practicalUse: "取引開始前にSDNリストとの照合を行い、該当がないことを確認します。",
    caution: "リストは頻繁に更新されるため、定期的なスクリーニングが必要です。",
    relatedRisk: "制裁対象者との取引による罰則、米国との取引停止リスク。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }],
  },
  {
    term: "Entity List",
    simpleExplanation: "米国BISが管理する輸出規制対象企業リスト。掲載企業への米国製品・技術の輸出には特別な許可が必要です。",
    practicalUse: "取引先がEntity Listに掲載されていないかを確認し、掲載されている場合は許可取得が必要です。",
    caution: "Entity Listへの追加は予告なく行われるため、定期的な確認が必要です。",
    relatedRisk: "Entity List掲載企業への無許可輸出リスク。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }],
  },
  {
    term: "ワッセナー・アレンジメント",
    simpleExplanation: "通常兵器と関連汎用品・技術の輸出管理に関する国際的な取り決め。42カ国が参加しています。",
    practicalUse: "日本の輸出令別表の品目リストはワッセナー・アレンジメントのリストをベースにしています。",
    caution: "各国の国内法での実施方法が異なるため、輸出先国の規制も確認が必要です。",
    relatedRisk: "多国間規制の見落とし、品目分類の不一致リスク。",
    relatedFeatures: [{ label: "学習コンテンツ", href: "/learning" }],
  },
  {
    term: "デュアルユース（Dual Use）",
    simpleExplanation: "民生用途と軍事用途の両方に使用可能な製品・技術のこと。高性能コンピュータ、精密加工機械などが典型例です。",
    practicalUse: "自社製品がデュアルユース品目に該当するかを仕様書で確認します。",
    caution: "民生用として販売しても、軍事転用されれば規制違反の責任を問われる場合があります。",
    relatedRisk: "軍事転用リスク、用途確認不足による規制違反。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }, { label: "AI相談室", href: "/ai-room" }],
  },
  {
    term: "再輸出（Re-export）",
    simpleExplanation: "輸入した製品を別の国へ再び輸出すること。米国製品の再輸出にはEARの規制が適用されます。",
    practicalUse: "米国から輸入した部品を組み込んだ製品を第三国へ輸出する場合に確認が必要です。",
    caution: "契約書に再輸出禁止条項があるかを確認し、再輸出先がEARで禁止されていないか確認します。",
    relatedRisk: "再輸出規制違反、契約違反リスク。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }],
  },
  {
    term: "用途確認書",
    simpleExplanation: "輸出する製品の最終用途を確認するための書類。軍事転用されないことを顧客に書面で確認してもらいます。",
    practicalUse: "懸念がある案件では顧客企業に用途確認書の提出を依頼し、社内審査の証跡として保管します。",
    caution: "用途確認書は「取った」だけでは不十分で、内容の妥当性を審査する必要があります。",
    relatedRisk: "用途確認不足による規制違反、キャッチオール規制該当リスク。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }, { label: "学習コンテンツ", href: "/learning" }],
  },
  {
    term: "該非判定",
    simpleExplanation: "輸出する製品・技術が輸出規制リスト（輸出令別表第一等）に該当するか否かを判定する作業です。",
    practicalUse: "該非判定書（パラメータシート）を作成し、品目該当性を技術的に判断します。",
    caution: "判定には製品の仕様・性能データが必要で、営業担当だけでは完了できない場合が多いです。",
    relatedRisk: "該非判定の誤りによる無許可輸出リスク。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }],
  },
  {
    term: "ICP（Internal Compliance Program / 輸出管理内部規程）",
    simpleExplanation: "企業が社内に整備する輸出管理体制のこと。輸出管理の方針・手順・責任者を文書化したものです。",
    practicalUse: "包括許可の取得や社内監査の基盤として、ICPの整備と運用が求められます。",
    caution: "ICPは作成するだけでなく、定期的な見直しと教育が不可欠です。",
    relatedRisk: "内部管理体制の不備、包括許可の取消リスク。",
    relatedFeatures: [{ label: "AI相談室", href: "/ai-room" }, { label: "研修支援", href: "/training" }],
  },
  {
    term: "包括許可",
    simpleExplanation: "一定の条件を満たす場合に、個別の輸出ごとではなく包括的に輸出許可を受けられる制度です。",
    practicalUse: "取引頻度が高い企業は包括許可を取得することで、個別許可申請の手間を削減できます。",
    caution: "包括許可には有効期限があり、ICPの整備・運用が条件です。違反すれば取り消されます。",
    relatedRisk: "包括許可条件違反、許可取消リスク。",
    relatedFeatures: [{ label: "AI相談室", href: "/ai-room" }],
  },
  {
    term: "ホワイト国（グループA）",
    simpleExplanation: "輸出管理において安全保障上の懸念が少ないと認められた国のグループ。包括許可の対象になります。",
    practicalUse: "輸出先がグループAに含まれるかどうかで、必要な許可の種類が変わります。",
    caution: "グループ分類は変更されることがあります（例: 2019年の韓国除外）。",
    relatedRisk: "グループ変更の見落とし、許可要件の誤認リスク。",
    relatedFeatures: [{ label: "輸出リスク診断", href: "/cases/new" }],
  },
  {
    term: "L/C（信用状 / Letter of Credit）",
    simpleExplanation: "銀行が発行する支払保証書類。輸出者が条件通りに書類を提出すれば代金が支払われる仕組みです。",
    practicalUse: "初めての取引先や信用が不十分な相手との貿易で、代金回収リスクを軽減します。",
    caution: "L/Cの条件と実際の船積み内容が一致しないと、銀行が支払いを拒否します。",
    relatedRisk: "書類不備による代金回収失敗リスク、ディスクレ（不一致）リスク。",
    relatedFeatures: [{ label: "AI相談室", href: "/ai-room" }],
  },
  {
    term: "HSコード（Harmonized System Code）",
    simpleExplanation: "国際的な商品分類番号。世界共通の6桁の番号で製品を分類し、関税率や規制の適用を判断します。",
    practicalUse: "輸出申告書にHSコードを記載し、適用される関税率や規制を確認します。",
    caution: "HSコードの分類を間違えると、関税率の誤適用や規制漏れにつながります。",
    relatedRisk: "HSコード誤分類による関税リスク、輸出規制の見落とし。",
    relatedFeatures: [{ label: "AI相談室", href: "/ai-room" }],
  },
  {
    term: "AEO（Authorized Economic Operator）",
    simpleExplanation: "税関が認定するセキュリティ管理と法令遵守の優良事業者制度。認定されると通関手続きが簡素化されます。",
    practicalUse: "AEO認定を受けることで、輸出入手続きの迅速化とコスト削減が期待できます。",
    caution: "認定の維持には継続的なコンプライアンス体制の整備が必要です。",
    relatedRisk: "AEO認定取消リスク、コンプライアンス体制の不備。",
    relatedFeatures: [{ label: "学習コンテンツ", href: "/learning" }],
  },
  {
    term: "フォワーダー（Freight Forwarder）",
    simpleExplanation: "荷主に代わって輸出入の輸送手配を行う物流業者。通関手続き、船腹予約、保険手配などを代行します。",
    practicalUse: "初めての輸出では、経験豊富なフォワーダーに依頼することで手続きミスを防げます。",
    caution: "フォワーダーに任せきりにせず、規制確認は荷主（輸出者）自身の責任で行う必要があります。",
    relatedRisk: "輸出者責任の認識不足リスク。",
    relatedFeatures: [{ label: "AI相談室", href: "/ai-room" }],
  },
  {
    term: "原産地証明書（Certificate of Origin）",
    simpleExplanation: "製品の原産国を証明する書類。関税の優遇措置（EPA/FTA特恵税率）の適用に必要です。",
    practicalUse: "EPA/FTA対象国への輸出時に、特恵税率の適用を受けるために発行を依頼します。",
    caution: "原産地規則を満たさない場合、特恵税率が適用されず通常の関税がかかります。",
    relatedRisk: "原産地規則の不適合リスク、関税コスト増加リスク。",
    relatedFeatures: [{ label: "AI相談室", href: "/ai-room" }],
  },
];

export function searchDictionary(query: string): DictionaryEntry | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  // exact match first
  const exact = dictionary.find(
    (entry) =>
      entry.term.toLowerCase().includes(q) ||
      q.includes(entry.term.split("（")[0].toLowerCase()),
  );
  if (exact) return exact;

  // partial match
  const partial = dictionary.find(
    (entry) =>
      entry.simpleExplanation.toLowerCase().includes(q) ||
      entry.practicalUse.toLowerCase().includes(q),
  );
  return partial ?? null;
}

export function getAllTerms(): string[] {
  return dictionary.map((entry) => entry.term);
}
