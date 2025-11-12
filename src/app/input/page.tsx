'use client';

export default function InputPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-8 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">輸出可否評価AI - 入力</h1>
      <p className="text-gray-600 mb-4">商品名と用途を入力してください。</p>
      <form className="w-full max-w-md flex flex-col gap-4">
        <input
          type="text"
          placeholder="商品名（例：カメラレンズ）"
          className="border border-gray-300 px-4 py-2 rounded-md"
        />
        <input
          type="text"
          placeholder="用途（例：農業ドローン監視）"
          className="border border-gray-300 px-4 py-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
        >
          評価を実行する
        </button>
      </form>
    </main>
  );
}
