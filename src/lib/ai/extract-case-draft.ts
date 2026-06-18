import type { AiConsultationRecord, CreateCaseInput } from "@/lib/types";

export type ConsultationCaseDraft = Partial<CreateCaseInput>;

export function extractCaseDraftFromConsultation(input: {
  question: string;
  sourceText?: string;
  structured?: Partial<CreateCaseInput>;
}) {
  if (input.structured) {
    return input.structured;
  }

  const baseText = `${input.question}\n${input.sourceText ?? ""}`;
  const extract = (pattern: RegExp) => baseText.match(pattern)?.[1]?.trim() ?? "";

  const productName =
    extract(/(?:商品|製品)[名:：は ]+([^\n、。]+)/) ||
    extract(/([^\n、。]+?)を[^\n]*輸出/) ||
    "要確認商品";
  const destinationCountry =
    extract(/(ベトナム|中国|韓国|台湾|米国|アメリカ|ドイツ|フランス|シンガポール|インド|ロシア|ミャンマー|タイ|マレーシア|インドネシア)/) ||
    extract(/([^\n、。 ]+)へ輸出/) ||
    "";
  const customerCompanyName =
    extract(/(?:相手先|顧客|企業|会社)[名:：は ]+([^\n、。]+)/) || "";
  const modelNumber = extract(/(?:型番|モデル)[名:：は ]+([A-Za-z0-9-]+)/);

  return {
    productName,
    modelNumber,
    destinationCountry,
    customerCompanyName,
  } satisfies ConsultationCaseDraft;
}

export function buildCaseDraftLink(record: AiConsultationRecord) {
  const draft = extractCaseDraftFromConsultation({
    question: record.question,
    sourceText: record.sourceText,
    structured: record.caseDraft,
  });

  const params = new URLSearchParams();
  if (draft.productName) params.set("productName", draft.productName);
  if (draft.modelNumber) params.set("modelNumber", draft.modelNumber);
  if (draft.destinationCountry) params.set("destinationCountry", draft.destinationCountry);
  if (draft.customerCompanyName) params.set("customerCompanyName", draft.customerCompanyName);
  return `/cases/new?${params.toString()}`;
}
