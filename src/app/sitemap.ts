import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${appUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${appUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/login`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${appUrl}/demo`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${appUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${appUrl}/terms`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${appUrl}/privacy`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}