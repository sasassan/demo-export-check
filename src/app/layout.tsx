import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { BetaBanner } from "@/components/layout/beta-banner";

import "./globals.css";

export const dynamic = "force-static";

const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const appUrl = rawAppUrl.replace(/\/$/, "");

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Export Risk Navi",
  description: "中小企業向けの輸出リスク調査・評価Webアプリ",
  metadataBase: new URL(appUrl),
  applicationName: "Export Risk Navi",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Export Risk Navi",
    description: "中小企業向けの輸出リスク調査・評価Webアプリ",
    url: appUrl,
    siteName: "Export Risk Navi",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Export Risk Navi",
    description: "中小企業向けの輸出リスク調査・評価Webアプリ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white">
        <BetaBanner />
        {children}
      </body>
    </html>
  );
}