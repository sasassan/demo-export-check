# 本番投入前 設定プリフライトチェック — パス条件マニュアル

本ドキュメントは `/api/config/preflight`（実装: `src/lib/config/preflight.ts`）の
blocking 項目を調査し、本番（`NODE_ENV=production`）で全項目がパスするための
条件を文書化したものである。

> 重要な前提: プリフライトチェックは**値そのものを一切出力しない**。
> 報告されるのは常に「設定名 + 問題の種類 + 対処方針」のみ。
> シークレット・APIキー・メールアドレス等をログやレスポンスに含めない設計になっている。

---

## 0. severity の読み方

| severity | 意味 | 本番での扱い |
| --- | --- | --- |
| `blocking` | 本番投入をブロックすべき致命的な設定漏れ | 全項目を解消しないと `hasBlockingIssues=true` |
| `warning` | 推奨未達 / 機能縮退 | 起動は可能だが、対処を強く推奨 |
| `info` | 参考情報 | 対応任意 |

`/api/config/preflight` のレスポンスに含まれる `hasBlockingIssues` が `false` のとき、
blocking 項目はすべてパスしている。

---

## 1. blocking 項目の一覧とパス条件

本番（`NODE_ENV=production`）で `severity="blocking"` になるのは以下の 4 群のみ。

### 1-1. SESSION_SECRET（category: auth）

| 判定 | issueType | severity（本番） |
| --- | --- | --- |
| 未設定 | `missing` | **blocking** |
| 既知プレースホルダー値 | `placeholder-value` | **blocking** |
| 32 文字未満 | `weak-secret` | **blocking** |
| 32〜63 文字 | `below-recommended-length` | warning |
| 64 文字以上（非プレースホルダー） | — | パス |

- プレースホルダーとして判定される値:
  - `dev-secret-change-in-production`
  - `replace-with-a-long-random-secret`
  - `/^replace-with/i` にマッチする文字列
- **パス条件（blocking を解消）**: 上記プレースホルダー以外で **32 文字以上**。
- **推奨条件（warning も解消）**: **64 文字以上**のランダム値。
  - 生成例: `openssl rand -hex 32` → 64 文字の16進文字列。
- 補足: 実行時の強制（`src/lib/auth/server.ts` の `assertProductionSessionSecret`）は
  リテラル既定値 `dev-secret-change-in-production` のみ例外を投げるが、プリフライトは
  それより広い範囲（短い鍵・他プレースホルダー）を blocking として検出する。

### 1-2. ADMIN_EMAILS（category: admin）

| 判定 | issueType | severity（本番） |
| --- | --- | --- |
| 未設定 | `missing` | warning |
| `demo@example.com` を含む | `placeholder-value` | **blocking** |

- **パス条件（blocking を解消）**: カンマ区切りの一覧から **`demo@example.com` を除外**し、
  実際の運用管理者メールアドレスを設定する。
- 理由: 本アプリはパスワードレスログイン（メールアドレス入力のみ）のため、
  `demo@example.com` が残っていると誰でもそのアドレスを入力して管理者権限を取得できる。
- 補足: 未設定の場合は blocking ではなく **warning**（管理者が誰もログインできなくなる
  状態を警告するのみ）。

### 1-3. ADMIN_PASSWORD（category: admin）

| 判定 | issueType | severity（本番） |
| --- | --- | --- |
| 未設定 | `missing-in-production` | **blocking** |

- **パス条件**: `ADMIN_PASSWORD` に空でない値を設定する。
  - 生成例: `openssl rand -base64 32`
- 理由: 管理者メールでのログインは OTP 検証に加えて `ADMIN_PASSWORD` の一致を要求する
  二要素構成。未設定の間は検証ルートが fail-closed で管理者ログインを拒否する。

### 1-4. SMTP_USER / SMTP_PASS（category: mail）

| 判定 | issueType | severity（本番） |
| --- | --- | --- |
| どちらか一方でも未設定 | `missing-in-production` | **blocking** |

- **パス条件**: `SMTP_USER` と `SMTP_PASS` の**両方**を設定する。
- 理由: ログイン時のメール確認コード（OTP）送信に必須。未設定だとログイン API が
  fail-closed で新規ログインを拒否する（検証なしログインを防ぐため）。
- 補足: `SMTP_HOST` / `SMTP_PORT` はコード側（`src/lib/mail/sender.ts`）に
  Gmail 想定の既定値（`smtp.gmail.com:587`）があるため必須ではない。
- Gmail の場合: 2段階認証を有効化し、アプリパスワードを `SMTP_PASS` に設定する
  （通常のログインパスワードは SMTP 認証では拒否される）。

---

## 2. blocking ではないが本番で対処すべき項目（warning）

ユーザー要望で列挙された以下の項目は、**現行実装では blocking ではなく warning**
である点に注意（`hasBlockingIssues` には影響しない）。ただし本番運用では対処が望ましい。

### 2-1. DATABASE_URL（category: database）— warning

| 判定 | issueType | severity（本番） |
| --- | --- | --- |
| 未設定 | `missing-in-production` | warning |

- 未設定時の影響: AI 実行 API のレート制限がプロセス内メモリにフォールバックし、
  複数インスタンス環境で上限が共有されない。案件データの永続化にも影響する。
- 推奨: Neon 等のプール済み（`-pooler` 付き / PgBouncer transaction mode 互換）
  接続文字列を設定する（同時リクエストでの接続枯渇を防ぐため）。

### 2-2. AI API キー群（category: ai-provider）— warning

対象: `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY`

| 判定 | issueType | severity（本番） |
| --- | --- | --- |
| 1 つも未設定 | `no-provider-configured` | warning |

- 推奨: **少なくとも 1 つ**のプロバイダー API キーを設定する
  （AI 調査・AI 相談室を有効化するため）。個別の疎通状況は `/admin/ai-health` で確認できる。

### 2-3. RATE_LIMIT_HASH_SECRET（category: rate-limit）— info/warning

- 未設定でも `SESSION_SECRET` に委譲される（`info`）。
- `SESSION_SECRET` も未設定の場合は固定の開発用フォールバック値となり `warning`（安全でない）。
- 推奨: 専用の `RATE_LIMIT_HASH_SECRET` を設定する（レート制限用途とセッション署名用途の鍵分離）。

---

## 3. 本番で全項目をパスさせるための最小設定

以下をすべて満たせば `hasBlockingIssues=false` となる（blocking 4 群 + 推奨 warning 解消を含む）。

```bash
# 1. SESSION_SECRET: 64文字以上のランダム値
openssl rand -hex 32   # → SESSION_SECRET に設定

# 2. ADMIN_EMAILS: 実運用の管理者メール（demo@example.com を除外）
#    ADMIN_EMAILS=you@example.com,admin@example.com

# 3. ADMIN_PASSWORD: 空でない値
openssl rand -base64 32   # → ADMIN_PASSWORD に設定

# 4. SMTP_USER / SMTP_PASS: Gmail アプリパスワード等
#    SMTP_USER=you@example.com
#    SMTP_PASS=<アプリパスワード>

# 5.（warning）DATABASE_URL: 本番Postgres接続文字列
# 6.（warning）AI APIキー: 少なくとも1つ
```

---

## 4. 検証方法

1. 管理者としてログインし、`GET /api/config/preflight` を実行する（管理者以外は 403）。
2. レスポンスの `findings` に `severity: "blocking"` の項目が無いこと、
   かつ `hasBlockingIssues` が `false` であることを確認する。
3. 値そのものは一切返らないため、`key` + `issueType` + `remediation` を手がかりに対処する。
