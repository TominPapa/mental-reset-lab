// Auto-publish pipeline. SERVER ONLY. Runs from the daily cron.
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateContent, reviewContent, generateTopic } from "./generate";
import { scanContent } from "./banned-phrases";
import { mostSimilar } from "@/lib/utils/similarity";
import { slugify } from "@/lib/utils/slug";
import { CATEGORY_NAMES, DEFAULT_TONE, QUALITY } from "@/lib/constants";
import type { ArticleReview } from "@/lib/types";

type Sb = ReturnType<typeof createAdminClient>;

async function uniqueSlug(sb: Sb, base: string): Promise<string> {
  const root = slugify(base) || "untitled";
  let candidate = root;
  let n = 1;
  for (;;) {
    const { data } = await sb
      .from("articles")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

export interface AutoPublishResult {
  ok: boolean;
  status?: "published" | "draft";
  title?: string;
  slug?: string;
  score?: number;
  reason?: string;
  issues?: string[];
  topicSource?: "backlog" | "generated";
  error?: string;
}

export async function runAutoPublish(): Promise<AutoPublishResult> {
  const sb = createAdminClient();

  // Existing titles (any status) for dedup + topic variety.
  const { data: arts } = await sb.from("articles").select("title,category,status");
  const all = arts ?? [];
  const existingTitles = all.map((a) => a.title as string);

  // Published count per category → drive balanced distribution (least first).
  const counts: Record<string, number> = {};
  for (const name of CATEGORY_NAMES) counts[name] = 0;
  for (const a of all) {
    if (a.status === "published" && counts[a.category as string] != null) {
      counts[a.category as string] += 1;
    }
  }
  const categoriesByCoverage = [...CATEGORY_NAMES].sort(
    (a, b) => counts[a] - counts[b],
  );

  // Available backlog topics (highest priority first within a category).
  const { data: newTopics } = await sb
    .from("topic_ideas")
    .select("id,topic,category,priority")
    .eq("status", "new")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: true });
  const backlog = newTopics ?? [];

  // 1) Pick a topic for the least-covered category that still has a backlog
  //    topic; otherwise generate one for the least-covered category.
  let topic: string;
  let category: string;
  let topicId: string | null = null;
  let topicSource: "backlog" | "generated";

  let picked: { id: string; topic: string; category: string } | null = null;
  for (const cat of categoriesByCoverage) {
    const match = backlog.find((b) => b.category === cat);
    if (match) {
      picked = { id: match.id as string, topic: match.topic as string, category: cat };
      break;
    }
  }
  // Fallback: any backlog topic with an unknown/legacy category.
  if (!picked && backlog.length) {
    const b = backlog[0];
    picked = {
      id: b.id as string,
      topic: b.topic as string,
      category: (CATEGORY_NAMES as readonly string[]).includes(b.category as string)
        ? (b.category as string)
        : CATEGORY_NAMES[0],
    };
  }

  if (picked) {
    topic = picked.topic;
    category = picked.category;
    topicId = picked.id;
    topicSource = "backlog";
  } else {
    const g = await generateTopic(existingTitles, categoriesByCoverage[0]);
    topic = g.topic;
    category = g.category;
    topicSource = "generated";
  }

  // 2) Generate the article (+ Korean summary).
  const c = await generateContent({ topic, category, tone: DEFAULT_TONE });

  // 3) Mechanical checks.
  const banned = scanContent({
    title: c.title,
    body: c.articleBody,
    meta_description: c.metaDescription,
    one_line_insight: c.oneLineInsight,
    summary: c.summary,
    shorts_script: c.shortsScript,
  }).map((h) => h.phrase);
  const words = c.articleBody.trim().split(/\s+/).filter(Boolean).length;
  const sim = mostSimilar(c.title, existingTitles);

  // 4) AI editor review (independent second opinion).
  const r = await reviewContent({
    title: c.title,
    category: c.category,
    oneLineInsight: c.oneLineInsight,
    articleBody: c.articleBody,
  });

  // 5) Combine into a verdict.
  const issues = [...r.issues];
  if (banned.length) issues.push(`Banned phrases: ${[...new Set(banned)].join(", ")}`);
  if (words < QUALITY.minWords || words > QUALITY.maxWords)
    issues.push(`Word count ${words} outside ${QUALITY.minWords}-${QUALITY.maxWords}`);
  if (sim.score >= QUALITY.maxTitleSimilarity)
    issues.push(`Too similar to "${sim.title}" (${sim.score.toFixed(2)})`);

  const approved =
    r.approved &&
    r.score >= QUALITY.minScore &&
    banned.length === 0 &&
    words >= QUALITY.minWords &&
    words <= QUALITY.maxWords &&
    sim.score < QUALITY.maxTitleSimilarity;

  const review: ArticleReview = {
    approved,
    score: r.score,
    issues,
    reason: r.reason,
    checks: {
      banned: [...new Set(banned)],
      words,
      tooSimilarTo: sim.score >= QUALITY.maxTitleSimilarity ? sim.title : undefined,
    },
  };

  // 6) Insert (published if approved, else held as draft for oversight).
  const slug = await uniqueSlug(sb, c.slug || c.title);
  const { data: art, error } = await sb
    .from("articles")
    .insert({
      title: c.title,
      slug,
      seo_title: c.seoTitle,
      meta_description: c.metaDescription,
      category: c.category,
      tags: c.tags,
      body: c.articleBody,
      summary: c.summary,
      summary_ko: c.summaryKo,
      one_line_insight: c.oneLineInsight,
      practical_rules: c.practicalRules,
      reflection_question: c.reflectionQuestion,
      status: approved ? "published" : "draft",
      published_at: approved ? new Date().toISOString() : null,
      auto_generated: true,
      review,
    })
    .select("id,slug")
    .single();

  if (error) return { ok: false, error: error.message };

  await sb.from("content_assets").insert({
    article_id: art.id,
    shorts_script: c.shortsScript,
    youtube_titles: c.youtubeTitles,
    thumbnail_texts: c.thumbnailTexts,
    social_posts: c.socialPosts,
    video_prompt: c.videoPrompt,
    description_draft: c.descriptionDraft,
  });

  if (topicId) await sb.from("topic_ideas").update({ status: "used" }).eq("id", topicId);

  return {
    ok: true,
    status: approved ? "published" : "draft",
    title: c.title,
    slug: art.slug,
    score: r.score,
    reason: r.reason,
    issues,
    topicSource,
  };
}
