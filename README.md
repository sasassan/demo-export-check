# Export Risk Navi

中小企業の営業担当・輸出担当向けに、`この商品を、この会社へ、この国へ輸出しても大丈夫か？` を短時間で確認できる Next.js アプリです。

## 実装済みの初期版

- メールログイン
- 案件登録
- モックProviderによるAI調査
- ABC評価表示
- PDFレポート出力
- Drizzle スキーマ定義

## 技術構成

- Next.js 16 / App Router
- TypeScript
- Tailwind CSS 4
- Drizzle ORM
- React PDF

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 環境変数

`.env.example` を参考に `.env.local` を作成してください。

### 本番公開向けに必須

- `NEXT_PUBLIC_APP_URL`
- `SESSION_SECRET`
- `DATABASE_URL`

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
```

### 初期版の動作方針

- 現在は **Cookieベースの簡易メールログイン** で動作します
- 調査処理は **mock provider** により自己完結で実行されます
- `src/lib/db/schema.ts` には本番向けDBスキーマを定義しています
- 実データベース接続や Supabase/Auth/API 契約がなくても、UI と案件フローを確認できます

## 主な画面

- `/` トップページ
- `/login` ログイン
- `/dashboard` 案件一覧
- `/cases/new` 案件登録
- `/cases/[id]` 評価結果
- `/cases/[id]/report` レポート確認

## 今後の差し替えポイント

- `src/lib/auth/*` を Supabase Auth に置き換え
- `src/lib/db/repository.ts` を永続DB実装に置き換え
- `src/lib/providers/mock/*` を制裁/企業/ニュースAPI接続に置き換え
- `src/app/api/webhooks/inngest/route.ts` を実ジョブ実行に接続