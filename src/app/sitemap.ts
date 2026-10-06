import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/main`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/demo`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/glossary`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/ai-room`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/evaluation-logic`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/operator`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/supervision`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/learning`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/security`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/training`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/updates`, lastModified, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
