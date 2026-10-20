import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_EMAILS, SESSION_COOKIE_NAME } from "@/lib/constants";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-in-production";

function assertProductionSessionSecret() {
  if (
    process.env.NODE_ENV === "production" &&
    SESSION_SECRET === "dev-secret-change-in-production"
  ) {
    throw new Error("SESSION_SECRET must be set in production.");
  }
}

async function hmacSign(value: string): Promise<string> {
  assertProductionSessionSecret();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Buffer.from(signature).toString("base64url");
}

async function hmacVerify(value: string, signature: string): Promise<boolean> {
  const expected = await hmacSign(value);
  return expected === signature;
}

export async function createSessionCookieValue(email: string): Promise<string> {
  const sig = await hmacSign(email);
  return `${email}.${sig}`;
}

export async function parseSessionCookieValue(raw: string): Promise<string | null> {
  const lastDot = raw.lastIndexOf(".");
  if (lastDot === -1) return null;
  const email = raw.slice(0, lastDot);
  const sig = raw.slice(lastDot + 1);
  const valid = await hmacVerify(email, sig);
  return valid ? email : null;
}

export async function getSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return null;
  return parseSessionCookieValue(raw);
}

export async function requireSessionEmail(returnPath?: string): Promise<string> {
  const email = await getSessionEmail();
  if (!email) {
    redirect(
      returnPath
        ? `/login?next=${encodeURIComponent(returnPath)}`
        : "/login",
    );
  }
  return email;
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export async function requireAdminEmail(returnPath?: string): Promise<string> {
  const email = await requireSessionEmail(returnPath);
  if (!isAdminEmail(email)) {
    redirect("/dashboard");
  }
  return email;
}
