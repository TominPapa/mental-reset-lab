// AI generation entrypoint. SERVER ONLY.
import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt, type GenerateInput } from "./prompts";
import { generatedContentSchema, type GeneratedContentParsed } from "./schema";
import { slugify } from "@/lib/utils/slug";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

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

export async function generateContent(
  input: GenerateInput,
): Promise<GeneratedContentParsed> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local to enable AI generation.",
    );
  }

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(input) }],
  });

  const text = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  const parsed = generatedContentSchema.parse(JSON.parse(extractJson(text)));

  // Always normalise the slug ourselves; never trust the model's URL safety.
  parsed.slug = slugify(parsed.slug || parsed.title);
  if (!parsed.category) parsed.category = input.category;

  return parsed;
}
