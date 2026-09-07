export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ?? "ern_session_email";

export const APP_NAME = "Export Risk Navi";
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);

export const RISK_DIMENSIONS = [
  "sanctions",
  "endUser",
  "ubo",
  "peps",
  "country",
  "useCase",
  "catchAll",
  "reputation",
] as const;

export type RiskDimension = (typeof RISK_DIMENSIONS)[number];

/**
 * 案件を論理削除してから物理削除（バッチ）対象になるまでの猶予期間。
 * この期間内は作成者本人または管理者が復元できる。
 * 猶予期間経過後の物理削除バッチは今回未実装（docs/case-deletion-design.md 参照）。
 */
export const CASE_DELETION_GRACE_PERIOD_DAYS = 30;