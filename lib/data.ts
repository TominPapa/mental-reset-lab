// Data access helpers. Public reads apply the live-visibility filter explicitly
// (status in published/scheduled AND published_at <= now), so they stay correct
// even when an admin is logged in on the same server client.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Article, Framework } from "@/lib/types";

const LIVE_STATUSES = ["published", "scheduled"];

function nowIso() {
  return new Date().toISOString();
}

// ── Public: articles ────────────────────────────────────────────
export async function getPublishedArticles(options?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<Article[]> {
  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select("*")
    .in("status", LIVE_STATUSES)
    .lte("published_at", nowIso())
    .order("published_at", { ascending: false });

  if (options?.category) query = query.eq("category", options.category);
  if (typeof options?.limit === "number") {
    const offset = options.offset ?? 0;
    query = query.range(offset, offset + options.limit - 1);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getPublishedArticles:", error.message);
    return [];
  }
  return (data as Article[]) ?? [];
}

export async function countPublishedArticles(category?: string): Promise<number> {
  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .in("status", LIVE_STATUSES)
    .lte("published_at", nowIso());
  if (category) query = query.eq("category", category);
  const { count, error } = await query;
  if (error) {
    console.error("countPublishedArticles:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .in("status", LIVE_STATUSES)
    .lte("published_at", nowIso())
    .maybeSingle();
  if (error) {
    console.error("getArticleBySlug:", error.message);
    return null;
  }
  return (data as Article) ?? null;
}

// Related: same category first, then most recent, excluding the current one.
export async function getRelatedArticles(
  article: Pick<Article, "id" | "category">,
  limit = 3,
): Promise<Article[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .in("status", LIVE_STATUSES)
    .lte("published_at", nowIso())
    .eq("category", article.category)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(limit);

  let related = (data as Article[]) ?? [];
  if (related.length < limit) {
    const { data: more } = await supabase
      .from("articles")
      .select("*")
      .in("status", LIVE_STATUSES)
      .lte("published_at", nowIso())
      .neq("id", article.id)
      .neq("category", article.category)
      .order("published_at", { ascending: false })
      .limit(limit - related.length);
    related = [...related, ...((more as Article[]) ?? [])];
  }
  return related;
}

// ── Public: frameworks ──────────────────────────────────────────
export async function getPublishedFrameworks(
  category?: string,
): Promise<Framework[]> {
  const supabase = await createClient();
  let query = supabase
    .from("frameworks")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) {
    console.error("getPublishedFrameworks:", error.message);
    return [];
  }
  return (data as Framework[]) ?? [];
}

export async function getFrameworkBySlug(
  slug: string,
): Promise<Framework | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("frameworks")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as Framework) ?? null;
}

// ── Admin: full access (RLS allows authenticated) ───────────────
export async function getAllArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("getAllArticles:", error.message);
    return [];
  }
  return (data as Article[]) ?? [];
}

export async function getArticleById(id: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Article) ?? null;
}
