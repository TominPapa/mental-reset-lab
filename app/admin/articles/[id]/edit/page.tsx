import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/Container";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import type { ArticleFormInput } from "@/app/admin/actions";
import type { Article, ContentAsset } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!article) notFound();

  const a = article as Article;

  const { data: asset } = await supabase
    .from("content_assets")
    .select("*")
    .eq("article_id", id)
    .maybeSingle();
  const c = asset as ContentAsset | null;

  const initial: ArticleFormInput = {
    id: a.id,
    title: a.title,
    slug: a.slug,
    seo_title: a.seo_title ?? "",
    meta_description: a.meta_description ?? "",
    category: a.category,
    tags: a.tags ?? [],
    body: a.body ?? "",
    summary: a.summary ?? "",
    one_line_insight: a.one_line_insight ?? "",
    practical_rules: a.practical_rules ?? [],
    reflection_question: a.reflection_question ?? "",
    youtube_url: a.youtube_url ?? "",
    status: a.status,
    published_at: a.published_at,
    shorts_script: c?.shorts_script ?? "",
    youtube_titles: c?.youtube_titles ?? [],
    thumbnail_texts: c?.thumbnail_texts ?? [],
    social_posts: c?.social_posts ?? [],
    video_prompt: c?.video_prompt ?? "",
    description_draft: c?.description_draft ?? "",
  };

  return (
    <Container size="wide" className="py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="truncate text-2xl font-semibold tracking-tight">
          Edit: {a.title}
        </h1>
        <div className="flex shrink-0 items-center gap-4 text-sm">
          {(a.status === "published" || a.status === "scheduled") && (
            <Link
              href={`/articles/${a.slug}`}
              target="_blank"
              className="text-muted hover:text-foreground"
            >
              View ↗
            </Link>
          )}
          <Link href="/admin/articles" className="text-muted hover:text-foreground">
            ← All articles
          </Link>
        </div>
      </div>
      <ArticleEditor initial={initial} />
    </Container>
  );
}
