"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";
import { runAutoPublish, type AutoPublishResult } from "@/lib/ai/pipeline";
import type { ArticleStatus } from "@/lib/constants";

export interface ArticleFormInput {
  id?: string;
  title: string;
  slug: string;
  seo_title: string;
  meta_description: string;
  category: string;
  tags: string[];
  body: string;
  summary: string;
  one_line_insight: string;
  practical_rules: string[];
  reflection_question: string;
  youtube_url: string;
  status: ArticleStatus;
  published_at: string | null;
  // content_assets
  shorts_script: string;
  youtube_titles: string[];
  thumbnail_texts: string[];
  social_posts: string[];
  video_prompt: string;
  description_draft: string;
}

export interface ActionResult {
  ok: boolean;
  id?: string;
  error?: string;
}

// Ensure the slug is unique, appending -2, -3, … if needed.
async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  excludeId?: string,
): Promise<string> {
  const root = slugify(base) || "untitled";
  let candidate = root;
  let n = 1;
  for (;;) {
    let query = supabase.from("articles").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

export async function saveArticle(
  input: ArticleFormInput,
): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  if (!input.title.trim()) return { ok: false, error: "Title is required." };
  if (!input.category.trim())
    return { ok: false, error: "Category is required." };

  // Default published_at for published/scheduled if missing.
  let publishedAt = input.published_at;
  if (
    (input.status === "published" || input.status === "scheduled") &&
    !publishedAt
  ) {
    publishedAt = new Date().toISOString();
  }

  const slug = await uniqueSlug(supabase, input.slug || input.title, input.id);

  const articleRow = {
    title: input.title.trim(),
    slug,
    seo_title: input.seo_title || null,
    meta_description: input.meta_description || null,
    category: input.category,
    tags: input.tags,
    body: input.body,
    summary: input.summary || null,
    one_line_insight: input.one_line_insight || null,
    practical_rules: input.practical_rules,
    reflection_question: input.reflection_question || null,
    youtube_url: input.youtube_url || null,
    status: input.status,
    published_at: publishedAt,
  };

  let articleId = input.id;

  if (articleId) {
    const { error } = await supabase
      .from("articles")
      .update(articleRow)
      .eq("id", articleId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("articles")
      .insert(articleRow)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    articleId = data.id;
  }

  // Upsert the content asset (one per article in practice).
  const assetRow = {
    article_id: articleId!,
    shorts_script: input.shorts_script || null,
    youtube_titles: input.youtube_titles,
    thumbnail_texts: input.thumbnail_texts,
    social_posts: input.social_posts,
    video_prompt: input.video_prompt || null,
    description_draft: input.description_draft || null,
  };

  const { data: existingAsset } = await supabase
    .from("content_assets")
    .select("id")
    .eq("article_id", articleId!)
    .maybeSingle();

  if (existingAsset) {
    await supabase
      .from("content_assets")
      .update(assetRow)
      .eq("id", existingAsset.id);
  } else {
    await supabase.from("content_assets").insert(assetRow);
  }

  revalidatePath("/admin/articles");
  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath(`/articles/${slug}`);

  return { ok: true, id: articleId };
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/articles");
  revalidatePath("/");
  revalidatePath("/articles");
  return { ok: true };
}

export async function setArticleStatus(
  id: string,
  status: ArticleStatus,
): Promise<ActionResult> {
  const supabase = await createClient();
  const patch: { status: ArticleStatus; published_at?: string } = { status };
  if (status === "published") {
    // Publish now if no date set yet.
    const { data } = await supabase
      .from("articles")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();
    if (!data?.published_at) patch.published_at = new Date().toISOString();
  }
  const { error } = await supabase
    .from("articles")
    .update(patch)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/articles");
  revalidatePath("/");
  revalidatePath("/articles");
  return { ok: true };
}

// Manually run the auto-publish pipeline once (same logic as the daily cron).
export async function triggerAutoPublish(): Promise<AutoPublishResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const result = await runAutoPublish();

  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/");
  revalidatePath("/articles");
  if (result.slug) revalidatePath(`/articles/${result.slug}`);
  return result;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
