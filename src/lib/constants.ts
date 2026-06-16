export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ?? "ern_session_email";

export const APP_NAME = "Export Risk Navi";

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