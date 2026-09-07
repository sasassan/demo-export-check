import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/lib/constants";

/**
 * セッションCookieの設定を一箇所に集約する（login/verify両ルートから使用）。
 * オプション（sameSite/httpOnly/secure/maxAge等）を二重管理してズレが生じないようにする。
 */
export async function setSessionCookie(cookieValue: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: cookieValue,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14,
  });
}
