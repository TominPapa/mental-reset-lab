// AI generation + review entrypoints. SERVER ONLY.
import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  SYSTEM_PROMPT,
  buildUserPrompt,
  REVIEW_SYSTEM_PROMPT,
  buildReviewPrompt,
  type GenerateInput,
} from "./prompts";
import {
  generatedContentSchema,
  reviewSchema,
  type GeneratedContentParsed,
  type ReviewParsed,
} from "./schema";
import { slugify } from "@/lib/utils/slug";
import { CATEGORY_NAMES } from "@/lib/constants";
import { z } from "zod";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

function client(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to the environment to enable AI generation.",
    );
  }
  return new Anthropic({ apiKey });
}

// Pull the first balanced JSON object out of a model response, tolerating
// stray prose or ```json fences.
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in model output.");
  }
  return candidate.slice(start, end + 1);
}

async function askJson(
  system: string,
  user: string,
  maxTokens: number,
): Promise<unknown> {
  const message = await client().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  return JSON.parse(extractJson(text));
}

export async function generateContent(
  input: GenerateInput,
): Promise<GeneratedContentParsed> {
  const parsed = generatedContentSchema.parse(
    await askJson(SYSTEM_PROMPT, buildUserPrompt(input), 4096),
  );
  // Always normalise the slug ourselves; never trust the model's URL safety.
  parsed.slug = slugify(parsed.slug || parsed.title);
  if (!parsed.category) parsed.category = input.category;
  return parsed;
}

const topicSchema = z.object({
  topic: z.string().min(1),
  category: z.string().min(1),
});

// Invent a fresh topic when the backlog is empty (keeps the pipeline running).
// If targetCategory is given, the topic is forced into that category (for balance).
export async function generateTopic(
  existingTitles: string[],
  targetCategory?: string,
): Promise<{ topic: string; category: string }> {
  const avoid = existingTitles.slice(0, 60).join("\n");
  const valid =
    targetCategory && (CATEGORY_NAMES as readonly string[]).includes(targetCategory)
      ? targetCategory
      : undefined;
  const system =
    "You generate article topics for Mental Reset Lab — short, practical mindset frameworks for focus, discipline, self-mastery, resilience, and execution in the AI era. Reply with a SINGLE JSON object only.";
  const categoryLine = valid
    ? `The topic MUST be in this category: ${valid}.`
    : `The topic must fit exactly one of these categories: ${CATEGORY_NAMES.join(", ")}.`;
  const user = `Propose ONE fresh, specific article topic that is NOT similar to any of these existing titles:
${avoid || "(none yet)"}

${categoryLine}
It should be a sharp, concrete angle (not generic motivation).

Return ONLY: { "topic": "a clear article title", "category": "${valid ?? "one of the categories above"}" }`;
  const parsed = topicSchema.parse(await askJson(system, user, 512));
  parsed.category = valid ?? parsed.category;
  if (!(CATEGORY_NAMES as readonly string[]).includes(parsed.category)) {
    parsed.category = CATEGORY_NAMES[0];
  }
  return parsed;
}

// Second-opinion editor pass — independent quality judgement.
export async function reviewContent(a: {
  title: string;
  category: string;
  oneLineInsight: string;
  articleBody: string;
}): Promise<ReviewParsed> {
  return reviewSchema.parse(
    await askJson(REVIEW_SYSTEM_PROMPT, buildReviewPrompt(a), 1024),
  );
}
