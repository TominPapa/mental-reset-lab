// Shared constants for Mental Reset Lab.

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Mental Reset Lab",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
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
    slug: "focus-systems",
    name: "Focus Systems",
    description:
      "Protecting attention in an environment engineered to fragment it. Distraction, phones, and deep work.",
  },
  {
    slug: "founder-mindset",
    name: "Founder Mindset",
    description:
      "Solo building, failure, and uncertainty. Operating with clarity when no one hands you a plan.",
  },
  {
    slug: "action-systems",
    name: "Action Systems",
    description:
      "Systems over motivation. Designing actions your tired, unmotivated self can still follow.",
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
