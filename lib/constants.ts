// Shared constants for Mental Reset Lab.

// Resolve the canonical site URL robustly:
// 1. An explicit NEXT_PUBLIC_SITE_URL (used for a real custom domain) wins —
//    unless it's a localhost value left over from local dev.
// 2. On Vercel, fall back to the auto-provided production domain.
// 3. Otherwise localhost for local dev.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit && !explicit.includes("localhost")) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return explicit || "http://localhost:3000";
}

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Mental Reset Lab",
  url: resolveSiteUrl(),
  tagline:
    "Short mental frameworks for focus, discipline, and clear decisions in the AI age.",
  description:
    "Practical mindset frameworks for focus, self-mastery, and execution in the AI era. No clichés, no therapy talk — just clear, repeatable thinking.",
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL || "",
} as const;

// Content categories (master plan §6.1). `slug` is the URL form.
export const CATEGORIES = [
  {
    slug: "ai-era-mindset",
    name: "AI-Era Mindset",
    description:
      "Direction, focus, and execution in a world of accelerating tools. The threat is rarely AI — it is a vague direction.",
  },
  {
    slug: "self-mastery",
    name: "Self-Mastery",
    description:
      "Habits, restraint, and consistency. How to keep small promises to yourself until they compound.",
  },
  {
    slug: "emotional-clarity",
    name: "Emotional Clarity",
    description:
      "Thinking clearly without being run by your moods. Separating signal from emotional noise.",
  },
  {
    slug: "focus-attention",
    name: "Focus & Attention",
    description:
      "Protecting attention in an environment built to fragment it. Distraction, phones, and staying with one thing.",
  },
  {
    slug: "resilience",
    name: "Resilience",
    description:
      "Staying steady through failure, stress, and uncertainty. Recovering fast and keeping perspective when things go wrong.",
  },
  {
    slug: "taking-action",
    name: "Taking Action",
    description:
      "Systems over motivation. Starting, following through, and beating procrastination when you don't feel like it.",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryByName(name: string) {
  return CATEGORIES.find((c) => c.name === name);
}

// Tone options (master plan §13.4)
export const TONE_OPTIONS = [
  "Calm but direct",
  "Stoic",
  "Founder-focused",
  "Practical",
  "Harsh truth",
  "Reflective",
] as const;

export const DEFAULT_TONE = "Calm but direct";

export const ARTICLE_STATUSES = [
  "draft",
  "published",
  "scheduled",
  "archived",
] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export const MEDICAL_DISCLAIMER =
  "This content is for self-management and personal reflection only. It is not medical, psychological, or therapeutic advice.";
