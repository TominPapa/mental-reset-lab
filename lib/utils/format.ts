// Formatting helpers.

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Rough word count for reading-time / length checks.
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function readingTime(text: string): string {
  const words = wordCount(text);
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}
