import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { createSessionCookieValue } from "@/lib/auth/server";

const loginSchema = z.object({
  email: z.email("正しいメールアドレスを入力してください。"),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。",
      },
      { status: 400 },
    );
  }

  const cookieValue = await createSessionCookieValue(parsed.data.email);
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

  return NextResponse.json({ ok: true });
}
