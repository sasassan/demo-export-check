import { z } from "zod";

/** Evidence is not a legal determination. All timestamps are UTC ISO strings. */
export const EvidenceSchema = z.object({
  id: z.string().min(1).max(128),
  sourceName: z.string().min(1).max(200),
  sourceUrl: z.url().refine((url) => new URL(url).protocol === "https:", "HTTPS required"),
  retrievedAt: z.iso.datetime({ offset: true }),
  publishedAt: z.iso.datetime({ offset: true }).optional(),
  excerpt: z.string().max(2000),
  jurisdiction: z.string().min(1).max(100),
  entityMatched: z.string().max(300).optional(),
  matchType: z.enum(["exact", "alias", "fuzzy", "unverified"]).default("unverified"),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export function assessEvidenceFreshness(evidence: Evidence, now = new Date(), maxAgeDays = 7) {
  const ageMs = now.getTime() - new Date(evidence.retrievedAt).getTime();
  if (!Number.isFinite(ageMs) || ageMs < 0 || !Number.isFinite(maxAgeDays) || maxAgeDays < 0)
    return { current: false, reason: "invalid_time" as const };
  return ageMs <= maxAgeDays * 86_400_000
    ? { current: true, reason: "current" as const }
    : { current: false, reason: "stale" as const };
}
