"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/Container";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import type { ArticleFormInput } from "@/app/admin/actions";
import type { GeneratedContent } from "@/lib/types";
import { CATEGORY_NAMES, TONE_OPTIONS, DEFAULT_TONE } from "@/lib/constants";

const inputCls =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground/40";

function toFormInput(
  c: GeneratedContent,
  youtubeUrl: string,
): ArticleFormInput {
  return {
    title: c.title,
    slug: c.slug,
    seo_title: c.seoTitle,
    meta_description: c.metaDescription,
    category: c.category,
    tags: c.tags ?? [],
    body: c.articleBody,
    summary: c.summary ?? "",
    one_line_insight: c.oneLineInsight ?? "",
    practical_rules: c.practicalRules ?? [],
    reflection_question: c.reflectionQuestion ?? "",
    youtube_url: youtubeUrl,
    status: "draft",
    published_at: null,
    shorts_script: c.shortsScript ?? "",
    youtube_titles: c.youtubeTitles ?? [],
    thumbnail_texts: c.thumbnailTexts ?? [],
    social_posts: c.socialPosts ?? [],
    video_prompt: c.videoPrompt ?? "",
    description_draft: c.descriptionDraft ?? "",
  };
}

function NewArticleInner() {
  const searchParams = useSearchParams();
  const prefillTopic = searchParams.get("topic") ?? "";
  const prefillCategory = searchParams.get("category");
  const [form, setForm] = useState({
    topic: prefillTopic,
    category:
      prefillCategory &&
      (CATEGORY_NAMES as readonly string[]).includes(prefillCategory)
        ? prefillCategory
        : (CATEGORY_NAMES[0] as string),
    targetAudience: "",
    tone: DEFAULT_TONE as string,
    mainArgument: "",
    avoidedClaims: "",
    youtubeUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<ArticleFormInput | null>(null);

  function upd<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      setDraft(toFormInput(data.content as GeneratedContent, form.youtubeUrl));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  if (draft) {
    return (
      <Container size="wide" className="py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Review &amp; edit
          </h1>
          <button
            onClick={() => setDraft(null)}
            className="text-sm text-muted hover:text-foreground"
          >
            ← Back to generator
          </button>
        </div>
        <ArticleEditor initial={draft} />
      </Container>
    );
  }

  return (
    <Container size="narrow" className="py-10">
      <h1 className="text-2xl font-semibold tracking-tight">New content</h1>
      <p className="mt-2 text-sm text-muted">
        Enter a topic. The AI produces a draft article plus a YouTube content
        package. You review and edit before anything is published.
      </p>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-medium">Topic</span>
          <input
            className={`${inputCls} mt-1`}
            value={form.topic}
            onChange={(e) => upd("topic", e.target.value)}
            placeholder="e.g. Discipline Is Not Intensity. It Is Consistency."
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Category</span>
            <select
              className={`${inputCls} mt-1`}
              value={form.category}
              onChange={(e) => upd("category", e.target.value)}
            >
              {CATEGORY_NAMES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Tone</span>
            <select
              className={`${inputCls} mt-1`}
              value={form.tone}
              onChange={(e) => upd("tone", e.target.value)}
            >
              {TONE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Main argument</span>
          <span className="ml-2 text-xs text-muted">optional</span>
          <textarea
            className={`${inputCls} mt-1 min-h-[70px]`}
            value={form.mainArgument}
            onChange={(e) => upd("mainArgument", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Target audience</span>
          <span className="ml-2 text-xs text-muted">optional</span>
          <input
            className={`${inputCls} mt-1`}
            value={form.targetAudience}
            onChange={(e) => upd("targetAudience", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Avoid these claims/angles</span>
          <span className="ml-2 text-xs text-muted">optional</span>
          <input
            className={`${inputCls} mt-1`}
            value={form.avoidedClaims}
            onChange={(e) => upd("avoidedClaims", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Related YouTube URL</span>
          <span className="ml-2 text-xs text-muted">optional</span>
          <input
            className={`${inputCls} mt-1`}
            value={form.youtubeUrl}
            onChange={(e) => upd("youtubeUrl", e.target.value)}
          />
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          onClick={generate}
          disabled={loading || !form.topic.trim()}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate draft"}
        </button>
      </div>
    </Container>
  );
}

export default function NewArticlePage() {
  return (
    <Suspense
      fallback={
        <Container size="narrow" className="py-10">
          <p className="text-sm text-muted">Loading…</p>
        </Container>
      }
    >
      <NewArticleInner />
    </Suspense>
  );
}
