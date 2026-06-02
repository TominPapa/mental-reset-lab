// Zod schema validating the AI generator's JSON output (master plan §13.1).
import { z } from "zod";

export const generatedContentSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  seoTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  oneLineInsight: z.string().min(1),
  summary: z.string().default(""),
  articleBody: z.string().min(1),
  practicalRules: z.array(z.string()).default([]),
  reflectionQuestion: z.string().default(""),
  shortsScript: z.string().default(""),
  youtubeTitles: z.array(z.string()).default([]),
  thumbnailTexts: z.array(z.string()).default([]),
  socialPosts: z.array(z.string()).default([]),
  descriptionDraft: z.string().default(""),
  videoPrompt: z.string().default(""),
});

export type GeneratedContentParsed = z.infer<typeof generatedContentSchema>;
