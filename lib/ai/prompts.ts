// Prompt construction for article + content-asset generation (master plan §13).
import { BANNED_PHRASES } from "./banned-phrases";

export interface GenerateInput {
  topic: string;
  category: string;
  targetAudience?: string;
  tone?: string;
  mainArgument?: string;
  avoidedClaims?: string;
  youtubeUrl?: string;
}

export const SYSTEM_PROMPT = `You are a writer for Mental Reset Lab, an English content hub of short, practical mindset frameworks for focus, discipline, self-mastery, and execution in the AI era.

Voice: calm but direct, realistic, action-oriented. Include one slightly uncomfortable truth. Never sound like generic motivation. Never use clichés such as "believe in yourself" or "never give up."

Hard constraints:
- This is NOT medical, psychological, or therapeutic content. Make no medical, clinical, or treatment claims.
- Never use any of these phrases: ${BANNED_PHRASES.join(", ")}.
- No invented statistics or fake science ("scientifically proven", etc.).
- Plain, natural English. Short sentences. No purple prose, no em-dash overuse.

You always reply with a SINGLE valid JSON object and nothing else — no markdown fences, no commentary.`;

// The article body is markdown. Length 500–900 words (master plan §7.1).
export function buildUserPrompt(input: GenerateInput): string {
  const {
    topic,
    category,
    targetAudience = "English-speaking adults (25–40) who want focus, discipline, and clarity in the AI era",
    tone = "Calm but direct",
    mainArgument = "",
    avoidedClaims = "",
  } = input;

  return `Write one concise, practical, non-medical mindset article.

Topic: ${topic}
Category: ${category}
Target audience: ${targetAudience}
Tone: ${tone}
${mainArgument ? `Main argument: ${mainArgument}` : ""}
${avoidedClaims ? `Specifically avoid these claims/angles: ${avoidedClaims}` : ""}

Requirements:
- The article body must be 500–900 words, written in markdown (use ## subheadings).
- Include exactly one uncomfortable truth.
- Include one practical mental framework.
- Include exactly three concrete, actionable rules.
- End the body with one reflection question.
- Also produce a 30–45 second Shorts script: Hook (1–3s), Problem (5–8s), Core insight (8–12s), 3 rules (15–20s), Reflection/CTA (3–5s).

Return ONLY this JSON object (all fields required):
{
  "title": "string — clear, no hype",
  "slug": "string — lowercase kebab-case, human-readable, max ~70 chars",
  "seoTitle": "string — <= 60 chars",
  "metaDescription": "string — 140–160 characters",
  "category": "${category}",
  "tags": ["3–5 lowercase tags"],
  "oneLineInsight": "string — one sharp sentence",
  "summary": "string — 1–2 sentence summary",
  "articleBody": "string — markdown, 500–900 words",
  "practicalRules": ["rule 1", "rule 2", "rule 3"],
  "reflectionQuestion": "string",
  "shortsScript": "string — the spoken script with line breaks",
  "youtubeTitles": ["5 candidate YouTube titles"],
  "thumbnailTexts": ["5 short thumbnail text candidates, <= 5 words each"],
  "socialPosts": ["2–3 short posts for X/Threads"],
  "descriptionDraft": "string — YouTube description draft",
  "videoPrompt": "string — a prompt describing visuals for an AI video tool"
}`;
}
