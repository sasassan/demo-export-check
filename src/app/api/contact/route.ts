import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { purpose, name, email, message } = body as {
      purpose?: string;
      name?: string;
      email?: string;
      company?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "name, email, message は必須です" },
        { status: 400 },
      );
    }

    // 本番ではメール送信サービス(Resend, SendGrid等)やDB保存に差し替え
    console.log("[Contact]", { purpose, name, email, company: body.company, message });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました" },
      { status: 500 },
    );
  }
}
