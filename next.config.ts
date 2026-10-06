import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy（段階導入）。
 *
 * 現在は Report-Only モード（Content-Security-Policy-Report-Only）で配信し、
 * 違反はブラウザのコンソールに報告されるだけでブロックはしない。
 * 実サイトでの違反ログを確認した上で、ヘッダー名を `Content-Security-Policy` に
 * 変更すれば enforce に移行できる。
 *
 * Next.js 固有の要件:
 * - script-src: layout.tsx / page.tsx にJSON-LDのインライン<script>があるため
 *   `'unsafe-inline'` を許可（nonce方式へ移行すれば除去可能）。
 * - style-src: React / Tailwind のインライン style 属性に対応するため `'unsafe-inline'` を許可。
 * - img-src: next/image の最適化（/_next/image = 同一オリジン）とブラー・
 *   クライアント生成画像のため `data:` `blob:` を許可。
 * - connect-src: アナリティクス等は全て同一オリジンの /api/* への fetch。
 * - 開発時は React がエラースタック復元に eval を使うため `'unsafe-eval'` が必要。
 */
const cspHeader = [
  "default-src 'self'",
  "base-uri 'self'",
  "font-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "0" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Content-Security-Policy-Report-Only", value: cspHeader },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // サーバー起動時の自動DBマイグレーション（src/instrumentation.ts）が
  // drizzle/ 配下のマイグレーションファイルを読み込むため、全てのルートの
  // 出力トレースに含める（Vercel等のサーバーレス環境でフォルダが欠落するのを防ぐ）。
  outputFileTracingIncludes: {
    "/**": ["./drizzle/**/*"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // 公開アセット（OG画像・ヒーロー画像）は内容更新時にファイル名を変える運用のため
        // 長期キャッシュ（immutable）を付与し、再取得・最適化コストを最小化する。
        source: "/(og-image\\.png|trade-hero\\.webp|login-trade-hero\\.webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
