// Lightweight text-similarity for dedup (no embeddings needed).

const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "to", "of", "in", "on", "for", "your",
  "you", "is", "are", "it", "not", "no", "be", "do", "don't", "dont", "with",
  "that", "this", "what", "how", "why",
]);

function tokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

// Jaccard similarity of significant words (0..1).
export function titleSimilarity(a: string, b: string): number {
  const A = tokens(a);
  const B = tokens(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter += 1;
  return inter / (A.size + B.size - inter);
}

// Returns the most similar existing title and its score.
export function mostSimilar(
  candidate: string,
  existing: string[],
): { title: string; score: number } {
  let best = { title: "", score: 0 };
  for (const t of existing) {
    const score = titleSimilarity(candidate, t);
    if (score > best.score) best = { title: t, score };
  }
  return best;
}
