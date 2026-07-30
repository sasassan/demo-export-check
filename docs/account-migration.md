# 法人アカウント移行手順書

**この文書の目的**: Export Risk Navigator AI を個人（開発者）アカウントから法人（Organization / Team）アカウントへ移行する「その日」に、この手順書だけを見ながら作業できるようにすること。

**前提**:
- 本文書作成時点では法人アカウントは未取得。移行の実行はスコープ外。
- コードは「envを差し替えるだけで移行が完了する」状態に対応済み（`src/lib/ai/config.ts`, `src/lib/ai/client-factory.ts`, `/api/ai/health`）。
- 憶測を避けるため、各サービスの公式ドキュメントを確認した上で記載している。未確定の点は「要確認」と明記する。

---

## 目次

1. [移行対象サービスの一覧と現状](#1-移行対象サービスの一覧と現状)
2. [サービスごとの移行手順](#2-サービスごとの移行手順)
3. [推奨実行順序](#3-推奨実行順序)
4. [移行後の検証チェックリスト](#4-移行後の検証チェックリスト)
5. [法人契約時に検討すべき事項](#5-法人契約時に検討すべき事項)

---

## 1. 移行対象サービスの一覧と現状

リポジトリ（`package.json` / `.env.example` / 設定ファイル）を実際に調査した結果、このプロジェクトが依存する外部サービスは以下の通り。

| サービス | 現状（個人アカウント） | 用途 | 判定根拠 |
|---|---|---|---|
| OpenAI | APIキー（`OPENAI_API_KEY`）、Org/Project未指定 | GPT-4o呼び出し（AI調査・チャット） | `src/lib/providers/openai.ts`, `openai-provider.ts`, `assistant.ts` |
| Anthropic | APIキー（`ANTHROPIC_API_KEY`） | Claude呼び出し（AI調査） | `src/lib/providers/claude-provider.ts` |
| Google (AI Studio) | APIキー（`GOOGLE_GENERATIVE_AI_API_KEY`） | Gemini呼び出し（AI調査） | `src/lib/providers/gemini-provider.ts` |
| GitHub | `sasassan/demo-export-check`（個人リポジトリ） | ソースコード管理・CI/CDのトリガー元 | `git remote -v` の出力（`https://github.com/sasassan/demo-export-check.git`） |
| Vercel | 未設定（`.vercel`ディレクトリ・`vercel.json`とも存在しない） | 想定デプロイ先（本プロジェクトはNext.js製で、Vercelへのデプロイを前提とした構成） | ローカルリポジトリにVercel連携ファイルが存在しないため、**現状はまだVercelへの連携自体が行われていない可能性が高い**。要確認: 実際に稼働中のVercelプロジェクトが別途存在するか、リポジトリのOwnerに確認すること |
| データベース | `DATABASE_URL=postgres://...`（ジェネリックなPostgres接続文字列） | Drizzle ORM経由でのデータ永続化 | `.env.example`の`DATABASE_URL`形式、`package.json`の`postgres`パッケージ + `drizzle-orm`/`drizzle-kit` |
| 独自ドメイン | 未設定 | - | `.env.example`の`NEXT_PUBLIC_APP_URL`はデフォルトで`http://localhost:3000`。カスタムドメイン設定ファイルなし |

### データベースについて（要確認）

`DATABASE_URL`は標準的なPostgres接続文字列形式（`postgres://user:pass@host:port/db`）であり、これ自体からはNeon / Supabase / RDS / 自前ホストのいずれであるかは判別できない。`package.json`の依存関係は素の`postgres`（porsager/postgres）ドライバーであり、Neon専用ドライバー（`@neondatabase/serverless`）やSupabase SDK（`@supabase/supabase-js`）への依存は**存在しない**。

→ **要確認**: 実際にどのホスティングサービス（Neon / Supabase / 自前のRDS等）を使っているかは、本番運用中の`.env.local`または本番環境変数（Vercelダッシュボード等）の接続文字列ホスト名を実際に見て判断すること。ホスト名に`neon.tech`が含まれればNeon、`supabase.co`が含まれればSupabase。

### その他の外部依存（AI以外）

- `@react-pdf/renderer`, `pdfjs-dist`: PDF生成・解析（外部サービスではなくnpmライブラリ、移行対象外）
- `zod`, `drizzle-orm`, `drizzle-kit`: ライブラリ（移行対象外）
- `SANCTIONS_API_KEY`, `COMPANY_INTELLIGENCE_API_KEY`, `NEWS_API_KEY`: `.env.example`にプレースホルダーのみ存在し、**現状コード内で未使用**（将来拡張用）。今回の移行対象には含めない

---

## 2. サービスごとの移行手順

### 2.1 OpenAI

**移管方法**:
1. [OpenAI Platform](https://platform.openai.com/settings/organization/general) で法人用Organizationを作成（または既存の法人Organizationに参加）
2. 法人Organization配下にProjectを作成: `https://platform.openai.com/settings/organization/projects`
3. そのProject専用のAPIキーを発行: Project設定内の「API keys」タブ
4. 新しいAPIキーを本番環境変数に設定:
   - `OPENAI_API_KEY` = 新しい法人Projectのキー
   - `OPENAI_ORG_ID` = Organization ID（`org-`で始まる文字列。Organization設定ページに表示）
   - `OPENAI_PROJECT_ID` = Project ID（`proj_`で始まる文字列。Project設定ページに表示）
5. コード側は対応済みのため、上記3つのenvを設定するだけで自動的にヘッダー（`OpenAI-Organization` / `OpenAI-Project`）が送信されるようになる（`src/lib/ai/client-factory.ts`の`createOpenAiClient`）

**壊れるもの**: なし（個人キーを法人キーに差し替えるだけ。ヘッダー追加はOpenAI側で許可された動作）

**ダウンタイム**: 環境変数の再設定・再デプロイのタイミングでのみ瞬断の可能性あり（Vercelの環境変数更新は通常次回デプロイから反映）

**事前バックアップ**: 個人アカウントの使用量・請求履歴のスクリーンショット（アカウント削除・アクセス権限変更に備えて）

**参照**: [OpenAI Platform - Organization settings](https://platform.openai.com/settings/organization/general)、[Data Processing Addendum](https://openai.com/policies/data-processing-addendum/)

---

### 2.2 Anthropic

**調査結果（重要）**: Anthropic の Node SDK（`@anthropic-ai/sdk` v0.104.2）の型定義（`ClientOptions`）には `organization` や `project` に相当するフィールドが**存在しない**。Anthropic の API キーは発行時点で Workspace 単位のスコープが既に確定しており、リクエスト時に追加のヘッダーで Organization/Workspace を明示する仕組みは提供されていない。

→ **したがって、Organization/Projectスコープ用の追加ヘッダー実装は不要と判断し、実装していない。** これは実際にSDKのソース（型定義）を確認した上での結論であり、憶測ではない。

**移管方法**:
1. [Anthropic Console](https://console.anthropic.com/settings/keys) で法人Workspaceを作成（または既存の法人Workspaceに招待を受ける）
2. 法人Workspace配下でAPIキーを新規発行
3. 新しいAPIキーを`ANTHROPIC_API_KEY`に設定するだけで移行完了（コード変更不要）
4. プロキシ経由で利用したい場合のみ`ANTHROPIC_BASE_URL`を設定（今回のために予約済み。デフォルトでは未設定＝`https://api.anthropic.com`が使われる）

**壊れるもの**: なし

**ダウンタイム**: なし（キー差し替えのみ）

**事前バックアップ**: 個人アカウントの使用量・請求履歴

**参照**: [Anthropic Console](https://console.anthropic.com/), [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)

---

### 2.3 Google (Gemini / AI Studio → 将来Vertex AI)

**現状**: AI Studio APIキー方式（`GOOGLE_GENERATIVE_AI_API_KEY`）。

**調査結果**: AI StudioのAPIキーには「Unpaid Services」と「Paid Services」の区別があり、これはアカウントの法人/個人の区別ではなく、**キーが紐づくGoogle CloudプロジェクトにCloud Billingアカウントが有効化されているかどうか**で決まる（[Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms)）。

- **Unpaid Services**（無料枠）: 入力・出力データが「Googleの製品改善」に使われる可能性があり、人間レビュアーがアカウント情報を切り離した上で読む場合がある。**機密情報を送るべきではない**と明記されている
- **Paid Services**（Cloud Billing紐付き）: プロンプト・レスポンスはモデル改善に使われず、[Data Processing Addendum for Products Where Google is a Data Processor](https://business.safety.google/processorterms/) に従って処理される。ただし違反検知目的で一定期間ログが保持される
- EEA/スイス/英国向けにサービス提供する場合は **Paid Servicesの利用が必須**（無料枠の利用は規約上禁止）

**今回の対応方針**: Vertex AI（GCPプロジェクト+リージョン+サービスアカウント認証）への切り替えは**実装しない**（スコープ外）。ただし将来の切り替えに備えて以下を予約済み:
- `GOOGLE_CLOUD_PROJECT_ID`: 現時点では`/api/ai/health`の表示用途のみ（認証には使われない）
- `GOOGLE_VERTEX_LOCATION`: 未使用の予約枠

**法人移行時に最低限やるべきこと（Vertex AI化しない場合）**:
1. AI Studioで使っているAPIキーに紐づくGoogle CloudプロジェクトでCloud Billingを有効化し、**Paid Servicesとして動作させる**（これをしないと入力データが学習に使われるリスクが残る）
2. 可能であればGCPプロジェクトを法人のGoogle Workspace/Cloud Organization配下に作成し直す

**Vertex AI へ将来移行する場合（本書のスコープ外・要別途実装）**:
- サービスアカウント認証（JSON鍵 or Workload Identity）への切り替えが必要
- リージョン選択、GCPプロジェクトの権限設計が必要
- 参照: [Vertex AI Generative AI ドキュメント](https://cloud.google.com/vertex-ai/generative-ai/docs)（要確認: 本プロジェクトのSDK `@google/generative-ai` はVertex AI経路と互換性がない可能性があるため、移行時は別SDK（`@google-cloud/vertexai`等）の検証が必要）

**壊れるもの**: Cloud Billing有効化に伴うプロジェクトの請求先変更（個人カード→法人請求）

**ダウンタイム**: 基本的になし。ただしCloud Billing切り替え中に一時的にAPI呼び出しが失敗する可能性は要検証

**事前バックアップ**: 現在のGCPプロジェクトID、APIキーの利用状況

---

### 2.4 GitHub

**現状**: `sasassan/demo-export-check`（個人アカウント配下のリポジトリ）

**移管方法**:
1. GitHub上でOrganizationを作成（法人アカウント）
2. リポジトリ設定 → "Transfer ownership" で個人リポジトリを法人Organizationへ移管
   参照: [Transferring a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository)
3. 移管後、ローカルの`git remote`のURLを更新:
   ```
   git remote set-url origin https://github.com/<法人Org名>/demo-export-check.git
   ```

**壊れるもの**:
- リポジトリURLが変わる（`github.com/sasassan/...` → `github.com/<Org>/...`）。**GitHubは旧URLからのリダイレクトを提供するが、恒久的に依存しないこと**
- **Vercelとの連携が切れる可能性が高い**。VercelはGitHubリポジトリへのGitHub App権限（Webhook）を通じてPush検知しているため、Owner変更後は再連携（Vercel側でGitHub Appのインストール先を法人Orgに追加）が必要になるケースがある
- ローカル開発者の`git remote`更新が全員分必要

**ダウンタイム**: リポジトリ移管自体は数秒〜数分。ただし移管直後はVercelのCI/CD（Push検知）が切れている可能性があるため、**移管直後に必ずVercel連携を確認すること**（詳細は3章の推奨順序を参照）

**事前バックアップ**: リポジトリの完全クローン（`git clone --mirror`）、Issues/PRの内容（GitHub Organization移管ではIssue/PRは保持されるが念のため）

**参照**: [Transferring a repository - GitHub Docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository)

---

### 2.5 Vercel

**現状**: リポジトリ内に`.vercel`ディレクトリや`vercel.json`が存在しないため、**このローカルリポジトリからは現在Vercelとどう連携されているか確認できない**。

→ **要確認**: 実際に本番稼働中のVercelプロジェクトが存在するかどうか、Vercelダッシュボードで直接確認すること。

**移管方法（個人アカウント→Vercel Team）**:
1. Vercelダッシュボードで「Team」を新規作成（法人用）
2. 対象プロジェクトの Settings → "Transfer Project" で個人アカウントからTeamへ移管
   参照: [Transferring a Project - Vercel Docs](https://vercel.com/docs/accounts/team-members-and-roles/transfer-projects)

**移管時に壊れるもの（公式ドキュメントで確認済み）**:
- **環境変数**: プロジェクト移管時に環境変数は転送される（再設定不要）
- **ドメイン・DNS設定**: 転送される
- **デプロイURL**: `*.vercel.app`のデフォルトドメインはプロジェクトに紐づくため基本的に維持されるが、**要確認**: Team移管前後でデフォルトドメインのサブドメイン部分が変わるケースがあるため、移管後に実際のURLを必ず確認すること
- **GitHub連携**: 前述の通り、GitHub側のOwnerも同時に法人化する場合は、Vercel側でのGitHub App権限の再認可が必要になることがある

**ダウンタイム**: Vercel公式には「ゼロダウンタイムで移管可能」と案内されているが、DNS移管を伴う場合は伝播時間分のリスクがある

**事前バックアップ**: 環境変数の一覧（念のためダッシュボードからエクスポートまたはスクリーンショット）、カスタムドメインのDNS設定内容

**参照**: [Transferring a Project - Vercel Docs](https://vercel.com/docs/accounts/team-members-and-roles/transfer-projects)

---

### 2.6 データベース（Neon / Supabase 等 — 要確認）

前述の通り、実際にどのサービスを使っているかは本番環境変数を直接確認する必要がある。一般的な移管手順は以下（該当するサービス側の実際の手順を移行時に確認すること）:

**共通の移管方法**:
1. 法人アカウントでプロジェクト（インスタンス）を新規作成、またはプロジェクトのOwnership移管機能を利用（NeonもSupabaseもプロジェクト単位のOrganization移管機能を提供している場合が多いが、**要確認**: 現行プランで対応しているか）
2. 新しい接続文字列を`DATABASE_URL`に設定
3. Drizzle ORMのスキーマ・データをマイグレーション/バックアップから復元（`npm run db:migrate`を新DB相手に実行）

**壊れるもの**: 接続文字列のホスト名が変わる場合、Vercel環境変数の`DATABASE_URL`更新と再デプロイが必要

**ダウンタイム**: 新規インスタンス作成→データ移行→切り替えの間、書き込みを止める必要がある（要確認: 対象サービスがゼロダウンタイム移行をサポートするか）

**事前バックアップ**: **必須**。`pg_dump`等でのフルバックアップを移行直前に取得すること

---

## 3. 推奨実行順序

依存関係を考慮すると、以下の順序を推奨する（逆順にするとCI/CDやデプロイが一時的に切れるリスクがある）:

```mermaid
flowchart TD
    A["1. データベースのバックアップ取得"] --> B["2. GitHubリポジトリの法人Organizationへの移管"]
    B --> C["3. Vercelプロジェクトの法人Teamへの移管 + GitHub連携の再確認"]
    C --> D["4. AIプロバイダー各社の法人アカウント作成・キー発行"]
    D --> E["5. データベースの法人アカウントへの移行（必要な場合）"]
    E --> F["6. Vercel環境変数の更新（新APIキー・新DATABASE_URL）"]
    F --> G["7. 再デプロイ"]
    G --> H["8. /api/ai/health + 検証チェックリストの実施"]
```

**理由**:
1. **データベースバックアップが最初**: 何かが壊れても復旧できる状態を先に作る
2. **GitHub移管が先、Vercel移管が後**: VercelはGitHubリポジトリへの連携（Webhook/GitHub App）を通じてデプロイをトリガーしているため、先にVercel側だけ移管するとGitHubとの紐付きが不整合になるリスクがある。GitHub移管後にVercel側の連携を確認・再設定する方が手戻りが少ない
3. **AIプロバイダーキー発行はVercel移管後でも独立して進められる**（依存関係がないため並行可能だが、環境変数の設定作業はVercel Team移管後に行うのが自然）
4. **環境変数更新とデプロイは最後**: 全ての新アカウントでの資材（キー・接続文字列）が揃ってから一括で反映し、デプロイ回数を最小化する
5. **検証は必ず最後**: 全ての切り替えが完了した状態で、チェックリストに従って確認する

---

## 4. 移行後の検証チェックリスト

- [ ] `GET /api/ai/health` で全プロバイダー（GPT-4o / Claude / Gemini）が `reachable: true`
- [ ] `/api/ai/health` の `orgId` / `projectId` が、意図した法人アカウントのマスク済み値と一致している（例: OpenAIなら新しい`org-...`のマスク値、`proj_...`のマスク値が表示されること）
- [ ] `/api/ai/health` のレスポンスにAPIキーの実値が含まれていないことを目視確認
- [ ] ログイン機能の疎通確認（既存ユーザーでログインできる）
- [ ] 案件登録機能の疎通確認（新規案件が登録できる）
- [ ] AI調査機能の疎通確認（GPT-4o / Claude / Geminiそれぞれで調査結果が返る）
- [ ] PDF出力機能の疎通確認（調査結果からPDFが生成できる）
- [ ] 管理者分析画面の疎通確認（管理者ダッシュボードが表示される）
- [ ] Vercelのデプロイが法人Teamのプロジェクトから正常に行われている
- [ ] GitHubのPushからVercelへの自動デプロイ（CI/CD）が機能している
- [ ] データベースの既存データが法人アカウントの新インスタンスでも参照できる（移行した場合）
- [ ] カスタムドメインが設定されている場合、DNS解決・SSL証明書が正常

---

## 5. 法人契約時に検討すべき事項

### 5.1 DPA（データ処理契約）の必要性

本サービスは顧客の輸出取引情報（取引先企業名・取引内容等、機微度の高い情報を含み得る）をAIプロバイダーに送信して分析するため、B2B SaaSとして顧客と契約する際は、**自社が顧客に対してDPAを提示できる立場になっている必要がある**。そのためには、まず自社とAIプロバイダー間のDPAを締結しておく必要がある。

- **OpenAI**: [Data Processing Addendum](https://openai.com/policies/data-processing-addendum/) を提供。API/ChatGPT Enterpriseの利用に付随して締結可能
- **Anthropic**: Commercial Terms（Claude for Work、APIなど）の下でDPA相当の契約が可能。詳細は[Anthropic Privacy Center](https://privacy.claude.com/)を参照。**要確認**: 具体的なDPA締結手続きの窓口
- **Google**: Paid Servicesの利用時に[Data Processing Addendum for Products Where Google is a Data Processor](https://business.safety.google/processorterms/)が適用される

### 5.2 各AIプロバイダーの「学習に使わない」デフォルト挙動

- **OpenAI**: 商用API（Business Data）はデフォルトで学習に使用されない（[Enterprise privacy at OpenAI](https://openai.com/enterprise-privacy/)）
- **Anthropic**: 商用製品（Claude for Work、APIなど）の入力・出力はデフォルトで学習に使用されない。フィードバックボタン経由で明示的に許可した場合のみ例外（[Is my data used for model training?](https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training)）
- **Google**: **重要な注意点** — AI StudioのUnpaid Servicesでは学習に使われる可能性がある。**Paid Services（Cloud Billing紐付き）にしない限り、個人アカウントと同じ学習利用リスクが残る**（[Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms)）。法人としてB2B顧客データを扱うなら、Paid Services化は必須と考えるべき

### 5.3 レート制限とTierの考え方

- **OpenAI**: 使用量（支払い実績）に応じてUsage Tierが自動的に上がり、レート制限（RPM/TPM）が緩和される仕組み。法人アカウントでも即座に上限が上がるわけではなく、実績に基づく。**要確認**: 現行のTierと必要なTierのギャップ
- **Anthropic**: 同様にUsage Tierに基づくレート制限。大量利用が見込まれる場合は営業担当への相談でカスタムレート上限交渉が可能な場合がある（**要確認**: 具体的な交渉窓口・条件）
- **Google**: Paid Services化により無料枠より高いレート制限が適用される

### 5.4 請求書払い / 前払いクレジットの違い

- **前払いクレジット（Prepaid Credit）**: 個人アカウントで一般的な方式。クレジットカードで事前にチャージし、使用量に応じて消費される
- **請求書払い（Invoicing）**: 法人向けに一定の利用実績・契約規模がある場合に提供されることが多い。月末締めで請求書が発行され、後払いになる。**要確認**: 各プロバイダーの請求書払い移行の具体的な条件（多くの場合、営業担当との直接契約が必要）
- B2B SaaS運営者としては、キャッシュフロー管理の観点から請求書払いへの移行を検討する価値があるが、契約締結までの間は前払いクレジットで運用を継続する必要がある

---

## 残課題・要確認事項（本書作成時点で確定できなかった点）

- Vercelの本番プロジェクトが実際に存在するか、その設定内容（このリポジトリには連携情報が含まれていない）
- データベースが実際にNeon/Supabase/自前ホストのいずれであるか（本番の接続文字列ホスト名を直接確認する必要がある）
- 独自ドメインの有無（現状の設定からは未設定と判断されるが、本番運用で別途取得している可能性は排除できない）
- Anthropic・OpenAIそれぞれの法人向け請求書払いの具体的な申込条件・最低利用金額
- Vertex AI移行時に必要となる正確なSDK・実装方式（`@google/generative-ai`との互換性、または`@google-cloud/vertexai`への切り替えが必要か）
