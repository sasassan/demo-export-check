import type { Metadata } from "next";

import { APP_NAME } from "./constants";

const rawAppUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://export-risk-navi-prod.vercel.app";

/** Canonical site origin (no trailing slash). */
export const SITE_URL = rawAppUrl.replace(/\/$/, "");

/** Japanese-facing site name used in titles and structured data. */
export const SITE_NAME = "輸出リスクナビ";

/** Full brand name shown as a title suffix. */
export const SITE_NAME_FULL = `${SITE_NAME}（${APP_NAME}）`;

/** Target keywords shared across public pages. */
export const CORE_KEYWORDS = [
  "輸出リスク",
  "該非判定",
  "輸出管理",
  "安全保障貿易",
  "EAR",
  "キャッチオール規制",
  "輸出コンプライアンス",
];

/** Default Open Graph / Twitter image (1200x630). */
export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME_FULL} — 輸出管理のAI一次確認・該非判定支援`,
};

export type BuildSeoOptions = {
  /** Page-specific title (site name is appended automatically). */
  title: string;
  /** 120–160 character meta description. */
  description: string;
  /** Route path, e.g. "/about". Defaults to "/". */
  path?: string;
  /** Extra keywords merged with the core keywords. */
  keywords?: string[];
  /** Hide from search engines (authenticated pages). */
  noindex?: boolean;
};

/**
 * Builds a consistent Metadata object with title, description, keywords,
 * canonical URL, robots, Open Graph and Twitter cards.
 */
export function buildSeo({
  title,
  description,
  path = "/",
  keywords = [],
  noindex = false,
}: BuildSeoOptions): Metadata {
  const canonical = path.startsWith("http") ? path : `${SITE_URL}${path}`;
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME_FULL}`;

  return {
    title: fullTitle,
    description,
    keywords: [...CORE_KEYWORDS, ...keywords],
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: false }
      : {
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
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME_FULL,
      locale: "ja_JP",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

/** Metadata for authenticated / non-public pages. */
export const NOINDEX_METADATA: Metadata = {
  robots: { index: false, follow: false },
};
