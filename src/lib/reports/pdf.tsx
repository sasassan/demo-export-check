import type { ReactElement } from "react";
import {
  Document,
  type DocumentProps,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

Font.register({
  family: "NotoSansJP",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-400-normal.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-700-normal.ttf",
      fontWeight: 700,
    },
  ],
});

type ReportModel = NonNullable<
  ReturnType<typeof import("@/lib/reports/build-report").buildReportModel>
>;

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    lineHeight: 1.5,
    color: "#111827",
    fontFamily: "NotoSansJP",
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 700,
  },
  section: {
    marginBottom: 16,
  },
  card: {
    border: "1 solid #d1d5db",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  heading: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: 700,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  small: {
    fontSize: 10,
    color: "#4b5563",
  },
});

export function RiskReportPdf({ model }: { model: ReportModel }) {
  return (
    <Document title={`Export Risk Report ${model.caseId}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Export Risk Navi 調査レポート</Text>
          <Text>案件ID: {model.caseId}</Text>
          <Text>生成日時: {model.generatedAt}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>案件概要</Text>
          <View style={styles.card}>
            <Text>商品名: {model.productName}</Text>
            <Text>型番: {model.modelNumber}</Text>
            <Text>輸出先国: {model.destinationCountry}</Text>
            <Text>顧客企業名: {model.customerCompanyName}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>総合評価</Text>
          <View style={styles.card}>
            <Text>総合評価: {model.overallGrade}</Text>
            <Text>{model.headline}</Text>
            <Text>{model.summary}</Text>
            <Text>{model.reportNarrative}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>重点確認論点</Text>
          {[
            {
              title: "国リスク",
              items: model.dimensions.filter((item) => item.dimension === "country"),
            },
            {
              title: "エンドユーザーリスク",
              items: model.dimensions.filter((item) =>
                ["sanctions", "endUser", "ubo", "peps"].includes(item.dimension),
              ),
            },
            {
              title: "用途リスク",
              items: model.dimensions.filter((item) =>
                ["useCase", "catchAll", "reputation"].includes(item.dimension),
              ),
            },
          ].map((group) => (
            <View style={styles.card} key={group.title}>
              <Text style={styles.heading}>{group.title}</Text>
              {group.items.map((item) => (
                <View key={item.dimension}>
                  <Text>
                    {item.label}: {item.grade} / {item.score}
                  </Text>
                  <Text>{item.rationale}</Text>
                  <Text style={styles.small}>推奨: {item.recommendedAction}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>評価軸</Text>
          {model.dimensions.map((dimension) => (
            <View style={styles.card} key={dimension.dimension}>
              <View style={styles.row}>
                <Text>{dimension.label}</Text>
                <Text>
                  {dimension.grade} / {dimension.score}
                </Text>
              </View>
              <Text>{dimension.rationale}</Text>
              <Text style={styles.small}>推奨: {dimension.recommendedAction}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>主要根拠</Text>
          {model.evidence.map((item) => (
            <View style={styles.card} key={item.id}>
              <Text>{item.title}</Text>
              <Text>{item.summary}</Text>
              <Text style={styles.small}>
                {item.sourceName} / 信頼度 {Math.round(item.confidence * 100)}%
              </Text>
            </View>
          ))}
        </View>

        {(model.documentSummary || model.relatedClauses.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.heading}>資料読解サポート</Text>
            {model.documentSummary ? (
              <View style={styles.card}>
                <Text style={styles.heading}>資料要約</Text>
                <Text>{model.documentSummary}</Text>
              </View>
            ) : null}
            {model.relatedClauses.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.heading}>関連条文・規程</Text>
                {model.relatedClauses.map((item) => (
                  <Text key={item}>・{item}</Text>
                ))}
              </View>
            ) : null}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.heading}>次のアクション</Text>
          {model.nextActions.map((action) => (
            <Text key={action}>・{action}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>免責事項</Text>
          <View style={styles.card}>
            <Text>
              本サービスは参考情報を提供するものであり、法令上の判断を代替するものではありません。
            </Text>
            <Text>
              最終的な輸出可否の判断は利用者自身の責任で実施してください。
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export function createRiskReportPdf(model: ReportModel): ReactElement<DocumentProps> {
  return <RiskReportPdf model={model} />;
}