// Banned / caution phrases (master plan §13.3).
// These keep the content out of medical, therapeutic, and over-promising territory.

export const BANNED_PHRASES = [
  "cure anxiety",
  "treat depression",
  "heal trauma",
  "guaranteed success",
  "scientifically proven",
  "secret formula",
  "never fail",
  "always works",
  "change your life forever",
  "therapy",
  "clinical",
  "trauma healing",
  "mental illness treatment",
] as const;

export interface BannedPhraseHit {
  phrase: string;
  index: number;
  context: string;
}

// Returns every banned-phrase occurrence found in `text` (case-insensitive),
// with a little surrounding context for the admin review UI.
export function findBannedPhrases(text: string): BannedPhraseHit[] {
  if (!text) return [];
  const hits: BannedPhraseHit[] = [];
  const lower = text.toLowerCase();

  for (const phrase of BANNED_PHRASES) {
    let from = 0;
    for (;;) {
      const index = lower.indexOf(phrase, from);
      if (index === -1) break;
      const start = Math.max(0, index - 30);
      const end = Math.min(text.length, index + phrase.length + 30);
      hits.push({
        phrase,
        index,
        context:
          (start > 0 ? "…" : "") +
          text.slice(start, end).trim() +
          (end < text.length ? "…" : ""),
      });
      from = index + phrase.length;
    }
  }
  return hits.sort((a, b) => a.index - b.index);
}

// Convenience: scan all text-bearing fields of generated content at once.
export function scanContent(fields: Record<string, string | undefined>) {
  const all: (BannedPhraseHit & { field: string })[] = [];
  for (const [field, value] of Object.entries(fields)) {
    if (!value) continue;
    for (const hit of findBannedPhrases(value)) {
      all.push({ ...hit, field });
    }
  }
  return all;
}
