"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveFramework,
  type FrameworkFormInput,
} from "@/app/admin/frameworks/actions";
import { CATEGORY_NAMES } from "@/lib/constants";

const inputCls =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground/40";

export function FrameworkForm({ initial }: { initial: FrameworkFormInput }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [f, setF] = useState({
    ...initial,
    tagsText: initial.tags.join(", "),
  });

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((p) => ({ ...p, [k]: v }));
  }

  function save(status: "draft" | "published") {
    setError("");
    startTransition(async () => {
      const res = await saveFramework({
        id: initial.id,
        title: f.title,
        slug: f.slug,
        statement: f.statement,
        explanation: f.explanation,
        category: f.category,
        tags: f.tagsText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status,
      });
      if (!res.ok) {
        setError(res.error || "Save failed.");
        return;
      }
      router.push("/admin/frameworks");
      router.refresh();
    });
  }

  return (
    <div className="max-w-2xl space-y-5">
      <label className="block">
        <span className="text-sm font-medium">Statement</span>
        <span className="ml-2 text-xs text-muted">the core one-liner</span>
        <textarea
          className={`${inputCls} mt-1 min-h-[80px]`}
          value={f.statement}
          onChange={(e) => set("statement", e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Explanation</span>
        <span className="ml-2 text-xs text-muted">optional, 1–2 sentences</span>
        <textarea
          className={`${inputCls} mt-1 min-h-[80px]`}
          value={f.explanation}
          onChange={(e) => set("explanation", e.target.value)}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <span className="ml-2 text-xs text-muted">short label</span>
          <input
            className={`${inputCls} mt-1`}
            value={f.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="auto from statement if blank"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <select
            className={`${inputCls} mt-1`}
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
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Tags</span>
        <span className="ml-2 text-xs text-muted">comma-separated</span>
        <input
          className={`${inputCls} mt-1`}
          value={f.tagsText}
          onChange={(e) => set("tagsText", e.target.value)}
        />
      </label>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={() => save("draft")}
          disabled={pending}
          className="rounded-md border border-border px-4 py-2 text-sm hover:border-foreground/40 disabled:opacity-50"
        >
          Save draft
        </button>
        <button
          onClick={() => save("published")}
          disabled={pending}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:opacity-90 disabled:opacity-50"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
