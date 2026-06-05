// Shared constants for Mental Reset Lab.

// Resolve the canonical site URL robustly:
// 1. An explicit NEXT_PUBLIC_SITE_URL (used for a real custom domain) wins —
//    unless it's a localhost value left over from local dev.
// 2. On Vercel, fall back to the auto-provided production domain.
// 3. Otherwise localhost for local dev.
const PRODUCTION_URL = "https://mentalresetlab.com";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  // Honor an explicit real custom domain (not localhost, not a vercel.app value).
  if (
    explicit &&
    !explicit.includes("localhost") &&
    !explicit.includes(".vercel.app")
  ) {
    return explicit;
  }
  // Anywhere on Vercel, use the canonical custom domain.
  if (process.env.VERCEL) return PRODUCTION_URL;
  // Local dev.
  return explicit || "http://localhost:3000";
}

const YOUTUBE_URL = "https://www.youtube.com/@TheMind-g4l";

function resolveYouTubeUrl(): string {
  const env = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL;
  // Ignore the placeholder; honor a real configured URL, else the canonical one.
  if (env && !env.includes("your-channel")) return env;
  return YOUTUBE_URL;
}

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Mental Reset Lab",
  url: resolveSiteUrl(),
  tagline:
    "Short mental frameworks for focus, discipline, and clear decisions in the AI age.",
  description:
    "Practical mindset frameworks for focus, self-mastery, and execution in the AI era. No clichés, no therapy talk — just clear, repeatable thinking.",
  youtubeUrl: resolveYouTubeUrl(),
} as const;

// Content categories (master plan §6.1). `slug` is the URL form.
// `color` = deep tone for light backgrounds (covers, body emphasis on light).
// `colorDark` = lighter tone for dark backgrounds (readable emphasis in dark mode).
export const CATEGORIES = [
  {
    slug: "ai-era-mindset",
    name: "AI-Era Mindset",
    description:
      "Direction, focus, and execution in a world of accelerating tools. The threat is rarely AI — it is a vague direction.",
    color: "#4338ca",
    colorDark: "#a5b4fc",
  },
  {
    slug: "self-mastery",
    name: "Self-Mastery",
    description:
      "Habits, restraint, and consistency. How to keep small promises to yourself until they compound.",
    color: "#15803d",
    colorDark: "#4ade80",
  },
  {
    slug: "emotional-clarity",
    name: "Emotional Clarity",
    description:
      "Thinking clearly without being run by your moods. Separating signal from emotional noise.",
    color: "#b45309",
    colorDark: "#fbbf24",
  },
  {
    slug: "focus-attention",
    name: "Focus & Attention",
    description:
      "Protecting attention in an environment built to fragment it. Distraction, phones, and staying with one thing.",
    color: "#0f766e",
    colorDark: "#5eead4",
  },
  {
    slug: "resilience",
    name: "Resilience",
    description:
      "Staying steady through failure, stress, and uncertainty. Recovering fast and keeping perspective when things go wrong.",
    color: "#9f1239",
    colorDark: "#fda4af",
  },
  {
    slug: "taking-action",
    name: "Taking Action",
    description:
      "Systems over motivation. Starting, following through, and beating procrastination when you don't feel like it.",
    color: "#c2410c",
    colorDark: "#fb923c",
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

// Accent colors for a category, with a sensible fallback (amber).
export function categoryColor(name: string): { color: string; colorDark: string } {
  const c = categoryByName(name);
  return { color: c?.color ?? "#b45309", colorDark: c?.colorDark ?? "#fbbf24" };
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

// Auto-publish quality gate thresholds.
export const QUALITY = {
  minWords: 450,
  maxWords: 1000,
  minScore: 7, // AI editor score (1-10) required to auto-publish
  maxTitleSimilarity: 0.6, // Jaccard on title words; above this = too similar
} as const;

export const MEDICAL_DISCLAIMER =
  "This content is for self-management and personal reflection only. It is not medical, psychological, or therapeutic advice.";
