import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "初期版では同期実行のため、将来の非同期ジョブ入口を予約しています。",
  });
}