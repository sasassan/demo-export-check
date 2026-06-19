import type { AssistantAnswer } from "@/lib/ai/types";

export type DocumentChunk = {
  id: string;
  text: string;
  sourceType: "sourceText" | "urlFetched";
  score: number;
};

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function splitIntoChunks(text: string, chunkSize = 500, overlap = 80) {
  const normalized = normalizeText(text);
  if (!normalized) {
    return [];
  }

  const chunks: string[] = [];
  let start = 0;
  while (start < normalized.length) {
    const end = Math.min(normalized.length, start + chunkSize);
    chunks.push(normalized.slice(start, end));
    if (end >= normalized.length) {
      break;
    }
    start = Math.max(0, end - overlap);
  }

  return chunks;
}

function scoreChunk(chunk: string, keywords: string[]) {
  const lower = chunk.toLowerCase();
  return keywords.reduce((score, keyword) => {
    if (!keyword) return score;
    return score + (lower.includes(keyword.toLowerCase()) ? 1 : 0);
  }, 0);
}

export function retrieveRelevantChunks(input: {
  message: string;
  sourceText?: string;
  fetchedUrlText?: string;
  limit?: number;
}) {
  const keywords = input.message
    .split(/[\s、。,.!?！？]+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2);

  const chunks: DocumentChunk[] = [];

  const addChunks = (text: string | undefined, sourceType: "sourceText" | "urlFetched") => {
    if (!text) return;
    splitIntoChunks(text).forEach((chunk, index) => {
      chunks.push({
        id: `${sourceType}-${index}`,
        text: chunk,
        sourceType,
        score: scoreChunk(chunk, keywords),
      });
    });
  };

  addChunks(input.sourceText, "sourceText");
  addChunks(input.fetchedUrlText, "urlFetched");

  return chunks
    .sort((left, right) => right.score - left.score || right.text.length - left.text.length)
    .slice(0, input.limit ?? 4);
}

export function buildCitationsFromChunks(chunks: DocumentChunk[]): AssistantAnswer["citations"] {
  return chunks.slice(0, 4).map((chunk, index) => ({
    label: `根拠${index + 1}`,
    snippet: chunk.text.slice(0, 180),
    sourceType: chunk.sourceType,
  }));
}

export function classifyConfidence(input: {
  chunks: DocumentChunk[];
  hasDictionaryHit: boolean;
  hasSourceMaterial: boolean;
}) {
  if (input.chunks.length >= 2 && input.hasSourceMaterial) return "高" as const;
  if (input.chunks.length >= 1 || input.hasDictionaryHit) return "中" as const;
  return "低" as const;
}