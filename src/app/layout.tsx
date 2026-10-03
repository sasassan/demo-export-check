import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import { CtaClickTracker } from "@/components/analytics/cta-click-tracker";
import { RouteTracker } from "@/components/analytics/route-tracker";
import { BetaBanner } from "@/components/layout/beta-banner";
import { APP_NAME } from "@/lib/constants";
import { CORE_KEYWORDS, OG_IMAGE, SITE_NAME_FULL, SITE_URL } from "@/lib/seo";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME_FULL,
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  description:
    "輸出リスク・該非判定・輸出管理の一次確認をAIが支援する、中小企業向けの輸出コンプライアンス支援サービス。",
  knowsAbout: [
    "輸出リスク",
    "該非判定",
    "輸出管理",
    "安全保障貿易",
    "EAR",
    "キャッチオール規制",
    "輸出コンプライアンス",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME_FULL}｜輸出管理のAI一次確認・該非判定支援`,
  description:
    "輸出リスク・該非判定・キャッチオール規制まで、輸出管理の一次確認をAIが支援。中小企業の営業担当者が商談前に5分でチェックできる輸出コンプライアンス支援サービスです。",
  keywords: CORE_KEYWORDS,
  applicationName: APP_NAME,
  authors: [{ name: APP_NAME, url: SITE_URL }],
  creator: APP_NAME,
  publisher: APP_NAME,
  category: "business",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME_FULL}｜輸出管理のAI一次確認・該非判定支援`,
    description:
      "輸出リスク・該非判定・キャッチオール規制まで、輸出管理の一次確認をAIが支援する中小企業向けサービス。",
    url: SITE_URL,
    siteName: SITE_NAME_FULL,
    locale: "ja_JP",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME_FULL}｜輸出管理のAI一次確認・該非判定支援`,
    description:
      "輸出リスク・該非判定・キャッチオール規制まで、輸出管理の一次確認をAIが支援する中小企業向けサービス。",
    images: [OG_IMAGE.url],
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
        },
      }
    : {}),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Suspense fallback={null}>
          <RouteTracker />
        </Suspense>
        <CtaClickTracker />
        <BetaBanner />
        {children}
      </body>
    </html>
  );
}
