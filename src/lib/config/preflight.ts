/**
 * 本番投入前の設定プリフライトチェック。
 *
 * 目的: 「安全でない設定のまま本番起動してしまう事故」を検出し、管理者に報告する。
 * 値そのもの（シークレット・APIキー・メールアドレス等）は一切ログ/レスポンスに含めない。
 * 報告するのは常に「設定名 + 問題の種類 + 対処方針」のみ。
 *
 * 設計方針（既存コードの挙動に合わせる）:
 * - このモジュール自体はモジュール読込時に例外を投げたり process.exit したりしない。
 *   Next.jsのビルド時評価やedge実行環境でモジュール読込自体が失敗すると
 *   ビルド/デプロイそのものが壊れるため、既存コードも同様に「実際に使われる
 *   タイミングで遅延チェックする」設計になっている
 *   （例: src/lib/auth/server.ts の assertProductionSessionSecret は
 *   セッションCookie署名時に初めて例外を投げる。
 *   src/lib/ai/rate-limit.ts の resolveRateLimitHashSecret は
 *   IPハッシュ化の初回呼び出し時に警告を出すだけで継続する）。
 * - 本モジュールはその「遅延チェック」群を横断的に呼び出し可能なオンデマンド関数
 *   として提供し、/api/config/preflight 経由で管理者が確認できるようにする。
 * - severity="blocking" の項目は「本番投入をブロックすべき」という判断を表すが、
 *   実際にプロセスを落とす/例外を投げるのは既存の該当コード（SESSION_SECRETは
 *   auth/server.ts が既に強制）に委ね、本モジュールは新たなクラッシュ経路を
 *   追加しない（既存の設計・スコープ最小の原則に合わせるため）。
 *   ADMIN_EMAILSのようにまだ実行時強制が存在しない項目については、
 *   severity="blocking"として明示し、対応が必須であることを管理者に伝える
 *   （このアプリはパスワードレスログイン方式のため、ADMIN_EMAILSが
 *   demo@example.com のままだと任意の訪問者がそのメールアドレスを入力するだけで
 *   管理者権限を取得できてしまう。SESSION_SECRETの漏洩・推測より対処が容易な
 *   攻撃であり、実務上は同等以上に重大）。
 */

export type PreflightSeverity = "blocking" | "warning" | "info";

export type PreflightCategory =
  | "auth"
  | "admin"
  | "rate-limit"
  | "ai-provider"
  | "database";

export type PreflightFinding = {
  /** 問題のある設定名（環境変数名）。値そのものは含めない。 */
  key: string;
  category: PreflightCategory;
  severity: PreflightSeverity;
  /** 問題の種類（例: "placeholder-value" | "weak-secret" | "missing-in-production"）。 */
  issueType: string;
  /** 人間向けの問題説明（値は含めない）。 */
  issue: string;
  /** 対処方針（人間向け）。値は含めない。 */
  remediation: string;
};

export type PreflightReport = {
  checkedAt: string;
  environment: string;
  isProduction: boolean;
  findings: PreflightFinding[];
  hasBlockingIssues: boolean;
};

/** SESSION_SECRETとして「明らかに置き換え忘れ」と判断できる既知のプレースホルダー値。 */
const SESSION_SECRET_PLACEHOLDERS = new Set([
  "dev-secret-change-in-production",
  "replace-with-a-long-random-secret",
]);

/** ADMIN_EMAILSとして「明らかに置き換え忘れ」と判断できる既知のプレースホルダー値。 */
const ADMIN_EMAIL_PLACEHOLDERS = new Set(["demo@example.com"]);

/**
 * SESSION_SECRETに要求する最小許容長（この未満は「弱い」として本番でblocking）。
 * 背景ドキュメント（docs/account-migration.md）が要求する推奨長は64文字以上。
 * 32文字未満は明確に不十分（HMAC-SHA256の鍵として脆弱）と判断し、
 * 32〜63文字は「動作はするが推奨値未満」としてwarningに留める。
 */
const SESSION_SECRET_MIN_ACCEPTABLE_LENGTH = 32;
const SESSION_SECRET_RECOMMENDED_LENGTH = 64;

function isSessionSecretPlaceholder(value: string): boolean {
  return SESSION_SECRET_PLACEHOLDERS.has(value) || /^replace-with/i.test(value.trim());
}

function checkSessionSecret(env: NodeJS.ProcessEnv, isProduction: boolean): PreflightFinding[] {
  const findings: PreflightFinding[] = [];
  const raw = env.SESSION_SECRET;
  const value = raw?.trim() ?? "";

  if (!value) {
    findings.push({
      key: "SESSION_SECRET",
      category: "auth",
      severity: isProduction ? "blocking" : "info",
      issueType: "missing",
      issue: "SESSION_SECRETが未設定です。未設定時は開発用の固定フォールバック値が使われ、セッションCookieの署名鍵が推測可能になります。",
      remediation:
        "macOSのターミナルで `openssl rand -hex 32` を実行し、出力された64文字の16進文字列をSESSION_SECRETに設定してください。",
    });
    return findings;
  }

  if (isSessionSecretPlaceholder(value)) {
    findings.push({
      key: "SESSION_SECRET",
      category: "auth",
      severity: isProduction ? "blocking" : "warning",
      issueType: "placeholder-value",
      issue: ".env.example / env.production.example / READMEに記載されている開発用のプレースホルダー文字列のまま設定されています。",
      remediation:
        "macOSのターミナルで `openssl rand -hex 32` を実行し、出力された64文字の16進文字列にSESSION_SECRETを置き換えてください。",
    });
    return findings;
  }

  if (value.length < SESSION_SECRET_MIN_ACCEPTABLE_LENGTH) {
    findings.push({
      key: "SESSION_SECRET",
      category: "auth",
      severity: isProduction ? "blocking" : "warning",
      issueType: "weak-secret",
      issue: `SESSION_SECRETが${SESSION_SECRET_MIN_ACCEPTABLE_LENGTH}文字未満です。セッションCookie署名の強度が不十分で、総当たりや推測のリスクがあります。`,
      remediation:
        "macOSのターミナルで `openssl rand -hex 32` を実行し、出力された64文字の16進文字列にSESSION_SECRETを置き換えてください。",
    });
    return findings;
  }

  if (value.length < SESSION_SECRET_RECOMMENDED_LENGTH) {
    findings.push({
      key: "SESSION_SECRET",
      category: "auth",
      severity: "warning",
      issueType: "below-recommended-length",
      issue: `SESSION_SECRETは${SESSION_SECRET_RECOMMENDED_LENGTH}文字以上を推奨していますが、現在の長さはそれ未満です。`,
      remediation:
        "macOSのターミナルで `openssl rand -hex 32` を実行し、出力された64文字の16進文字列にSESSION_SECRETを置き換えることを推奨します。",
    });
  }

  return findings;
}

function checkAdminEmails(env: NodeJS.ProcessEnv, isProduction: boolean): PreflightFinding[] {
  const raw = env.ADMIN_EMAILS ?? "";
  const emails = raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (emails.length === 0) {
    return [
      {
        key: "ADMIN_EMAILS",
        category: "admin",
        severity: isProduction ? "warning" : "info",
        issueType: "missing",
        issue: "ADMIN_EMAILSが未設定です。管理者権限を持つアカウントが存在せず、/adminの各画面に誰もアクセスできません。",
        remediation: "本番で実際に運用する管理者のメールアドレスをカンマ区切りでADMIN_EMAILSに設定してください。",
      },
    ];
  }

  const hasPlaceholder = emails.some((email) => ADMIN_EMAIL_PLACEHOLDERS.has(email));
  if (hasPlaceholder) {
    return [
      {
        key: "ADMIN_EMAILS",
        category: "admin",
        severity: isProduction ? "blocking" : "warning",
        issueType: "placeholder-value",
        issue:
          ".env.exampleに記載されている開発用のデモアカウントのメールアドレスが含まれています。本アプリはパスワードレスログイン（メールアドレスの入力のみ）のため、このままでは誰でもそのメールアドレスを入力して管理者権限を取得できてしまいます。",
        remediation: "本番の実際の管理者メールアドレスに置き換え、開発用のデモアカウントのメールアドレスを削除してください。",
      },
    ];
  }

  return [];
}

function checkRateLimitHashSecret(env: NodeJS.ProcessEnv, isProduction: boolean): PreflightFinding[] {
  const dedicated = env.RATE_LIMIT_HASH_SECRET?.trim();
  if (dedicated) return [];

  const sessionSecret = env.SESSION_SECRET?.trim();
  if (sessionSecret) {
    // SESSION_SECRETに委譲されるが、専用鍵ではないため情報レベルで留める
    // （src/lib/ai/rate-limit.ts の resolveRateLimitHashSecret と同じ優先順位）。
    return [
      {
        key: "RATE_LIMIT_HASH_SECRET",
        category: "rate-limit",
        severity: "info",
        issueType: "using-fallback-secret",
        issue: "RATE_LIMIT_HASH_SECRETが未設定のため、SESSION_SECRETを匿名IPハッシュ化の鍵として流用しています（動作上は問題なし）。",
        remediation: "レート制限用途とセッション署名用途で鍵を分離したい場合は、専用のRATE_LIMIT_HASH_SECRETを設定してください。",
      },
    ];
  }

  return [
    {
      key: "RATE_LIMIT_HASH_SECRET",
      category: "rate-limit",
      severity: isProduction ? "warning" : "info",
      issueType: "missing-fallback-to-insecure-dev-secret",
      issue: "RATE_LIMIT_HASH_SECRETとSESSION_SECRETのいずれも未設定のため、固定の開発用フォールバック秘密鍵で匿名利用者のIPハッシュ化が行われています。事前計算によりIPを逆算できるため安全ではありません。",
      remediation:
        "macOSのターミナルで `openssl rand -hex 32` を実行し、出力された64文字の16進文字列をRATE_LIMIT_HASH_SECRET（またはSESSION_SECRET）に設定してください。",
    },
  ];
}

const API_KEY_ENV_KEYS = [
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "GOOGLE_GENERATIVE_AI_API_KEY",
] as const;

function checkApiKeys(env: NodeJS.ProcessEnv, isProduction: boolean): PreflightFinding[] {
  const configuredCount = API_KEY_ENV_KEYS.filter((key) => {
    const value = env[key];
    return value && value.trim().length > 0;
  }).length;

  if (configuredCount === 0) {
    return [
      {
        key: API_KEY_ENV_KEYS.join(" / "),
        category: "ai-provider",
        severity: isProduction ? "warning" : "info",
        issueType: "no-provider-configured",
        issue: "AIプロバイダーのAPIキー（OPENAI_API_KEY / ANTHROPIC_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY）が1つも設定されていません。AI調査・AI相談室などの機能が利用できません。",
        remediation: "少なくとも1つのAIプロバイダーのAPIキーを設定してください。個別の疎通状況は /admin/ai-health で確認できます。",
      },
    ];
  }

  return [];
}

function checkDatabaseUrl(env: NodeJS.ProcessEnv, isProduction: boolean): PreflightFinding[] {
  const value = env.DATABASE_URL?.trim();
  if (value) return [];

  return [
    {
      key: "DATABASE_URL",
      category: "database",
      severity: isProduction ? "warning" : "info",
      issueType: "missing-in-production",
      issue: "DATABASE_URLが未設定です。AI実行APIのレート制限（コスト暴走ガード）がプロセス内メモリにフォールバックし、複数インスタンス環境では上限が正しく共有されません。案件データ等の永続化にも影響します。",
      remediation: "本番用のPostgres接続文字列をDATABASE_URLに設定してください（`.env.example`のDATABASE_URL形式を参照）。",
    },
  ];
}

/**
 * 設定プリフライトチェックを実行する。値そのものは一切含めない。
 * 呼び出し側（APIルート・管理画面等）で管理者権限チェックを行った上で使うこと
 * （本関数自体は認可判定を持たない）。
 */
export function runConfigPreflight(env: NodeJS.ProcessEnv = process.env): PreflightReport {
  const isProduction = env.NODE_ENV === "production";

  const findings: PreflightFinding[] = [
    ...checkSessionSecret(env, isProduction),
    ...checkAdminEmails(env, isProduction),
    ...checkRateLimitHashSecret(env, isProduction),
    ...checkApiKeys(env, isProduction),
    ...checkDatabaseUrl(env, isProduction),
  ];

  return {
    checkedAt: new Date().toISOString(),
    environment: env.NODE_ENV ?? "development",
    isProduction,
    findings,
    hasBlockingIssues: findings.some((f) => f.severity === "blocking"),
  };
}
