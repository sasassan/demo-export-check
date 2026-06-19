import type { MetadataRoute } from "next";

const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const appUrl = rawAppUrl.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/cases/"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
