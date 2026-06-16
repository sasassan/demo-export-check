type NarrativeInput = {
  productName: string;
  destinationCountry: string;
  customerCompanyName: string;
  overallGrade: "A" | "B" | "C";
  highlights: string[];
};

export async function generateNarrative(input: NarrativeInput) {
  const headline =
    input.overallGrade === "C"
      ? "高リスク案件として社内承認前提で確認が必要です。"
      : input.overallGrade === "B"
        ? "追加確認を前提に進められる可能性があります。"
        : "現時点では大きな懸念は限定的です。";

  return [
    `${input.productName} を ${input.customerCompanyName} 向けに ${input.destinationCountry} へ輸出する案件について、初期調査を実施しました。`,
    headline,
    `主な確認事項は ${input.highlights.join("、")} です。`,
    "法令判断は最終的に社内確認を前提としつつ、営業担当でも論点を把握しやすいように整理しています。",
  ].join("");
}