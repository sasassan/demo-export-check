'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-8 bg-white">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        輸出可否評価AI デモ
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        商品名と用途を入力するだけ。リスクを可視化し、営業資料に活用。
      </p>
      <button
        onClick={() => router.push('/input')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
      >
        評価を始める
      </button>
    </main>
  ); 
}　　　