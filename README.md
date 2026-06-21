# Export Risk Navi

中小企業の営業担当・輸出担当向けに、`この商品を、この会社へ、この国へ輸出しても大丈夫か？` を短時間で確認できる Next.js アプリです。

## 現在できること

- トップページ / サービス説明 / デモ公開
- 輸出辞典
- AI相談室
- URL本文の自動取得を含む資料読解補助
- 相談履歴保存
- 相談から案件化
- 案件登録
- AIリスク診断
- 3AIレビュー風レポート表示
- PDFレポート出力
- Postgres 永続化対応（Drizzle）

## 技術構成

- Next.js 16 / App Router
- TypeScript
- Tailwind CSS 4
- Drizzle ORM
- Postgres
- React PDF
- OpenAI / Claude / Gemini

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

---

## 環境変数

`.env.local` を作成して設定してください。

### 必須

- `NEXT_PUBLIC_APP_URL`
- `SESSION_SECRET`
- `DATABASE_URL`

### AI機能用

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `ENABLED_AI_PROVIDERS=gpt-4o,claude,gemini`
- `OPENAI_TIMEOUT_MS=8000`
- `ANTHROPIC_TIMEOUT_MS=8000`
- `GOOGLE_TIMEOUT_MS=8000`

### 例

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_COOKIE_NAME=ern_session_email
SESSION_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgres://postgres:postgres@localhost:5432/export_risk_navi
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
ENABLED_AI_PROVIDERS=gpt-4o,claude,gemini
OPENAI_TIMEOUT_MS=8000
ANTHROPIC_TIMEOUT_MS=8000
GOOGLE_TIMEOUT_MS=8000
```

---

## DB永続化の使い方

このプロジェクトは `DATABASE_URL` が設定されていると **Postgres を使い**、未設定時は **インメモリにフォールバック** します。

### 1. migration生成

```bash
npm run db:generate
```

### 2. migration適用

```bash
npm run db:migrate
```

### 3. 直接pushしたい場合

```bash
npm run db:push
```

### 生成済みmigration

- `drizzle/0000_fearless_living_mummy.sql`

---

## 本番公開の推奨構成

- Vercel へデプロイ
- Postgres を接続
- `SESSION_SECRET` を十分に長いランダム文字列へ変更
- 利用規約・プライバシーポリシー・免責事項を公開

### Vercel デプロイ時の環境変数

```bash
NEXT_PUBLIC_APP_URL=https://your-production-domain.example
SESSION_COOKIE_NAME=ern_session_email
SESSION_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgres://...
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
ENABLED_AI_PROVIDERS=gpt-4o,claude,gemini
```

---

## 主な画面

- `/` トップページ
- `/about` サービス説明
- `/demo` デモ画面
- `/glossary` 輸出辞典
- `/ai-room` AI相談室
- `/learning` 学習コンテンツ
- `/dashboard` 案件一覧
- `/cases/new` 案件登録
- `/cases/[id]` 評価結果
- `/cases/[id]/report` レポート確認

---

## 運用メモ

- AI相談室は OpenAI API が使える場合は実API回答、使えない場合はフォールバック回答になります。
- 相談履歴は案件化候補データも一緒に保存されます。
- 履歴から案件化すると、案件化済みフラグが立ちます。
- URL本文の自動取得は、サイト側の制限により失敗することがあります。

---

## 今後さらに強化しやすいポイント

- PDFアップロード読解
- DB migration の本番自動化
- 認証強化（Supabase/Auth.js等）
- 相談履歴の削除 / エクスポート
- 監査ログ
