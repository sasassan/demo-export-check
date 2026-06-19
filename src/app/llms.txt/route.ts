export const dynamic = "force-static";

const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const appUrl = rawAppUrl.replace(/\/$/, "");

const content = `# Export Risk Navi

> 中小企業の営業担当者向けに、輸出リスクの一次確認を支援する日本語Webアプリです。

## Overview

Export Risk Navi は、輸出案件について制裁リスト、相手先企業、国リスク、用途リスク、キャッチオール規制、UBO / PEPs、企業信用などを一次確認し、AIで論点整理・要約・次アクション提案を行うサービスです。

このサイトは、単なる診断ツールではなく、法令・通達・社内規程を理解するための AI アシスタント機能も備えています。

## Public URLs

- Home: ${appUrl}/
- About: ${appUrl}/about
- Demo: ${appUrl}/demo
- Glossary: ${appUrl}/glossary
- AI Room: ${appUrl}/ai-room
- Learning: ${appUrl}/learning
- Security: ${appUrl}/security
- Training: ${appUrl}/training
- Contact: ${appUrl}/contact
- AI-readable summary page: ${appUrl}/for-ai
- JSON context: ${appUrl}/site-context.json

## Main Features

1. 輸出案件の一次スクリーニング
2. A / B / C のリスク評価
3. PDFレポート出力
4. AI相談室による資料要約・条文解説・関連語句提示
5. 輸出辞典による専門用語検索
6. 社内共有向けの判断根拠整理
7. 長文資料・規程の読解支援

## Intended Users

- 中小企業の営業担当者
- 初めて輸出管理を担当する実務担当者
- 社内規程の整備担当者
- 輸出管理・法務・管理部門

## What Reviewers Should Understand

- このサービスは法的判断を代替するものではなく、一次確認と論点整理を支援するものです。
- 公開ページは誰でも閲覧可能です。
- ダッシュボード、案件詳細、ケース管理ページはログイン前提です。
- AI相談室は、規制資料・社内規程・条文の意味を分かりやすく説明する用途も重視しています。

## Review Focus Suggestions

- 営業担当者にとっての分かりやすさ
- 信頼感、安心感、誠実感のある UI か
- ページ間の導線の分かりやすさ
- AI相談室の価値訴求が明確か
- 輸出管理に不慣れな利用者でも理解できるか
`;

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}