"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveArticle, type ArticleFormInput } from "@/app/admin/actions";
import { scanContent } from "@/lib/ai/banned-phrases";
import { CATEGORY_NAMES } from "@/lib/constants";
import { wordCount } from "@/lib/utils/format";

const linesToArray = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const arrayToLines = (a: string[]) => (a ?? []).join("\n");

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="ml-2 text-xs text-muted">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground/40";

export function ArticleEditor({ initial }: { initial: ArticleFormInput }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [f, setF] = useState({
    ...initial,
    tagsText: initial.tags.join(", "),
    rulesText: arrayToLines(initial.practical_rules),
    titlesText: arrayToLines(initial.youtube_titles),
    thumbsText: arrayToLines(initial.thumbnail_texts),
    socialText: arrayToLines(initial.social_posts),
    // datetime-local wants "YYYY-MM-DDTHH:mm"
    publishedLocal: initial.published_at
      ? toLocalInput(initial.published_at)
      : "",
  });

  function set<K extends keyof typeof f>(key: K, value: (typeof f)[K]) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  const bannedHits = useMemo(
    () =>
      scanContent({
        title: f.title,
        body: f.body,
        meta_description: f.meta_description,
        one_line_insight: f.one_line_insight,
        summary: f.summary,
        shorts_script: f.shorts_script,
      }),
    [
      f.title,
      f.body,
      f.meta_description,
      f.one_line_insight,
      f.summary,
      f.shorts_script,
    ],
  );

  const words = wordCount(f.body);
  const metaLen = f.meta_description.length;

  function buildPayload(status: ArticleFormInput["status"]): ArticleFormInput {
    let publishedAt: string | null = null;
    if (status === "scheduled" || status === "published") {
      publishedAt = f.publishedLocal
        ? new Date(f.publishedLocal).toISOString()
        : new Date().toISOString();
    }
    return {
      id: initial.id,
      title: f.title,
      slug: f.slug,
      seo_title: f.seo_title,
      meta_description: f.meta_description,
      category: f.category,
      tags: f.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      body: f.body,
      summary: f.summary,
      one_line_insight: f.one_line_insight,
      practical_rules: linesToArray(f.rulesText),
      reflection_question: f.reflection_question,
      youtube_url: f.youtube_url,
      status,
      published_at: publishedAt,
      shorts_script: f.shorts_script,
      youtube_titles: linesToArray(f.titlesText),
      thumbnail_texts: linesToArray(f.thumbsText),
      social_posts: linesToArray(f.socialText),
      video_prompt: f.video_prompt,
      description_draft: f.description_draft,
    };
  }

  function save(status: ArticleFormInput["status"]) {
    setError("");
    if (status === "published" && bannedHits.length > 0) {
      if (
        !confirm(
          `There are ${bannedHits.length} banned/caution phrase(s). Publish anyway?`,
        )
      )
        return;
    }
    startTransition(async () => {
      const res = await saveArticle(buildPayload(status));
      if (!res.ok) {
        setError(res.error || "Save failed.");
        return;
      }
      router.push("/admin/articles");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* Main column */}
      <div className="space-y-5">
        <Field label="Title">
          <input
            className={inputCls}
            value={f.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Slug" hint="lowercase-kebab">
            <input
              className={inputCls}
              value={f.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="auto from title if blank"
            />
          </Field>
          <Field label="Category">
            <select
              className={inputCls}
              value={f.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="">Select…</option>
              {CATEGORY_NAMES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="One-line insight">
          <input
            className={inputCls}
            value={f.one_line_insight}
            onChange={(e) => set("one_line_insight", e.target.value)}
          />
        </Field>

        <Field label="Body" hint={`${words} words (target 500–900) · markdown`}>
          <textarea
            className={`${inputCls} min-h-[360px] font-mono`}
            value={f.body}
            onChange={(e) => set("body", e.target.value)}
          />
        </Field>

        <Field label="Practical rules" hint="one per line">
          <textarea
            className={`${inputCls} min-h-[100px]`}
            value={f.rulesText}
            onChange={(e) => set("rulesText", e.target.value)}
          />
        </Field>

        <Field label="Reflection question">
          <input
            className={inputCls}
            value={f.reflection_question}
            onChange={(e) => set("reflection_question", e.target.value)}
          />
        </Field>

        <details className="rounded-lg border border-border bg-surface p-4">
          <summary className="cursor-pointer text-sm font-medium">
            YouTube / content package
          </summary>
          <div className="mt-4 space-y-5">
            <Field label="Shorts script">
              <textarea
                className={`${inputCls} min-h-[140px]`}
                value={f.shorts_script}
                onChange={(e) => set("shorts_script", e.target.value)}
              />
            </Field>
            <Field label="YouTube title candidates" hint="one per line">
              <textarea
                className={`${inputCls} min-h-[100px]`}
                value={f.titlesText}
                onChange={(e) => set("titlesText", e.target.value)}
              />
            </Field>
            <Field label="Thumbnail texts" hint="one per line">
              <textarea
                className={`${inputCls} min-h-[80px]`}
                value={f.thumbsText}
                onChange={(e) => set("thumbsText", e.target.value)}
              />
            </Field>
            <Field label="Social posts" hint="one per line">
              <textarea
                className={`${inputCls} min-h-[80px]`}
                value={f.socialText}
                onChange={(e) => set("socialText", e.target.value)}
              />
            </Field>
            <Field label="YouTube description draft">
              <textarea
                className={`${inputCls} min-h-[100px]`}
                value={f.description_draft}
                onChange={(e) => set("description_draft", e.target.value)}
              />
            </Field>
            <Field label="Video prompt">
              <textarea
                className={`${inputCls} min-h-[80px]`}
                value={f.video_prompt}
                onChange={(e) => set("video_prompt", e.target.value)}
              />
            </Field>
          </div>
        </details>
      </div>

      {/* Sidebar */}
      <aside className="space-y-5">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm font-medium">Publish</p>
          <div className="mt-3 space-y-3">
            <Field label="Schedule for" hint="optional">
              <input
                type="datetime-local"
                className={inputCls}
                value={f.publishedLocal}
                onChange={(e) => set("publishedLocal", e.target.value)}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => save("draft")}
                disabled={pending}
                className="rounded-md border border-border px-3 py-2 text-sm hover:border-foreground/40 disabled:opacity-50"
              >
                Save draft
              </button>
              <button
                onClick={() => save("scheduled")}
                disabled={pending || !f.publishedLocal}
                className="rounded-md border border-border px-3 py-2 text-sm hover:border-foreground/40 disabled:opacity-50"
                title={!f.publishedLocal ? "Set a schedule date first" : ""}
              >
                Schedule
              </button>
              <button
                onClick={() => save("published")}
                disabled={pending}
                className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-contrast hover:opacity-90 disabled:opacity-50"
              >
                Publish
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm font-medium">SEO</p>
          <div className="mt-3 space-y-4">
            <Field label="SEO title" hint="≤ 60 chars">
              <input
                className={inputCls}
                value={f.seo_title}
                onChange={(e) => set("seo_title", e.target.value)}
              />
            </Field>
            <Field
              label="Meta description"
              hint={`${metaLen}/160 (140–160 ideal)`}
            >
              <textarea
                className={`${inputCls} min-h-[80px]`}
                value={f.meta_description}
                onChange={(e) => set("meta_description", e.target.value)}
              />
            </Field>
            <Field label="Tags" hint="comma-separated">
              <input
                className={inputCls}
                value={f.tagsText}
                onChange={(e) => set("tagsText", e.target.value)}
              />
            </Field>
            <Field label="YouTube URL" hint="optional">
              <input
                className={inputCls}
                value={f.youtube_url}
                onChange={(e) => set("youtube_url", e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div
          className={`rounded-lg border p-4 ${
            bannedHits.length
              ? "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
              : "border-border bg-surface"
          }`}
        >
          <p className="text-sm font-medium">
            Banned-phrase check{" "}
            {bannedHits.length === 0 ? "✓" : `(${bannedHits.length})`}
          </p>
          {bannedHits.length > 0 ? (
            <ul className="mt-2 space-y-2 text-xs text-red-700 dark:text-red-300">
              {bannedHits.map((h, i) => (
                <li key={i}>
                  <span className="font-semibold">{h.field}</span>: &quot;
                  {h.phrase}&quot;
                  <br />
                  <span className="text-muted">{h.context}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-xs text-muted">No flagged phrases.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
