import { createHash } from "node:crypto";

import type { SourceDocument, SourceFragment } from "@/core/schemas";

export function stableHash(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function normalizeText(value: string): string {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

export function fragmentSource(source: SourceDocument): SourceFragment[] {
  const lines = source.text.split(/\r?\n/);
  const fragments: SourceFragment[] = [];

  lines.forEach((rawLine, index) => {
    const text = rawLine.trim();
    if (!text) return;
    const lineNumber = index + 1;
    const normalizedText = normalizeText(text);
    fragments.push({
      fragmentId: `frag_${source.sourceDocumentId}_${lineNumber}_${stableHash(normalizedText).slice(0, 8)}`,
      sourceDocumentId: source.sourceDocumentId,
      page: null,
      row: source.mimeType === "text/csv" ? lineNumber : null,
      lineStart: lineNumber,
      lineEnd: lineNumber,
      boundingBox: null,
      text,
      normalizedText,
      contentHash: stableHash(text),
      createdAt: source.createdAt,
    });
  });

  return fragments;
}

export function fragmentAllSources(sources: SourceDocument[]): SourceFragment[] {
  return sources.flatMap(fragmentSource);
}
