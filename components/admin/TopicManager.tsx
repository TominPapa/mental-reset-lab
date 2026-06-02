"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  addTopic,
  setTopicStatus,
  deleteTopic,
} from "@/app/admin/topics/actions";
import { CATEGORY_NAMES } from "@/lib/constants";
import type { TopicIdea } from "@/lib/types";

const inputCls =
  "rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground/40";

function generatorHref(t: TopicIdea) {
  const params = new URLSearchParams({ topic: t.topic });
  if (t.category) params.set("category", t.category);
  return `/admin/articles/new?${params.toString()}`;
}

export function TopicManager({ initial }: { initial: TopicIdea[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [topics] = useState(initial);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState(CATEGORY_NAMES[0] as string);
  const [priority, setPriority] = useState(5);
  const [error, setError] = useState("");

  function add() {
    setError("");
    if (!topic.trim()) return;
    startTransition(async () => {
      const res = await addTopic({ topic, category, priority });
      if (!res.ok) {
        setError(res.error || "Failed.");
        return;
      }
      setTopic("");
      router.refresh();
    });
  }

  function changeStatus(id: string, status: "new" | "used" | "ignored") {
    startTransition(async () => {
      const res = await setTopicStatus(id, status);
      if (res.ok) router.refresh();
      else alert(res.error);
    });
  }

  function remove(id: string) {
    if (!confirm("Delete this topic?")) return;
    startTransition(async () => {
      const res = await deleteTopic(id);
      if (res.ok) router.refresh();
      else alert(res.error);
    });
  }

  const grouped = {
    new: topics.filter((t) => t.status === "new"),
    used: topics.filter((t) => t.status === "used"),
    ignored: topics.filter((t) => t.status === "ignored"),
  };

  return (
    <div className="space-y-8">
      {/* Add form */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-sm font-medium">Add a topic</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            className={`${inputCls} flex-1`}
            placeholder="e.g. Your Calendar Shows Your Real Priorities."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <select
            className={inputCls}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_NAMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className={inputCls}
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            title="Priority"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                P{n}
              </option>
            ))}
          </select>
          <button
            onClick={add}
            disabled={pending || !topic.trim()}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:opacity-90 disabled:opacity-50"
          >
            Add
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      {/* New topics */}
      <Section title={`Open (${grouped.new.length})`}>
        {grouped.new.length === 0 ? (
          <Empty />
        ) : (
          grouped.new
            .sort((a, b) => b.priority - a.priority)
            .map((t) => (
              <Row key={t.id}>
                <div className="min-w-0">
                  <p className="truncate text-sm">{t.topic}</p>
                  <p className="text-xs text-muted">
                    P{t.priority} · {t.category ?? "—"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs">
                  <Link
                    href={generatorHref(t)}
                    className="font-medium text-foreground hover:underline"
                  >
                    Generate →
                  </Link>
                  <button
                    onClick={() => changeStatus(t.id, "used")}
                    disabled={pending}
                    className="text-muted hover:text-foreground"
                  >
                    Used
                  </button>
                  <button
                    onClick={() => changeStatus(t.id, "ignored")}
                    disabled={pending}
                    className="text-muted hover:text-foreground"
                  >
                    Ignore
                  </button>
                  <button
                    onClick={() => remove(t.id)}
                    disabled={pending}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </Row>
            ))
        )}
      </Section>

      {/* Used / ignored */}
      {(["used", "ignored"] as const).map((key) => (
        <Section key={key} title={`${key} (${grouped[key].length})`}>
          {grouped[key].length === 0 ? (
            <Empty />
          ) : (
            grouped[key].map((t) => (
              <Row key={t.id}>
                <p className="truncate text-sm text-muted">{t.topic}</p>
                <div className="flex shrink-0 items-center gap-3 text-xs">
                  <button
                    onClick={() => changeStatus(t.id, "new")}
                    disabled={pending}
                    className="text-muted hover:text-foreground"
                  >
                    Reopen
                  </button>
                  <button
                    onClick={() => remove(t.id)}
                    disabled={pending}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </Row>
            ))
          )}
        </Section>
      ))}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        {title}
      </h2>
      <div className="mt-3 divide-y divide-border rounded-lg border border-border bg-surface">
        {children}
      </div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">{children}</div>
  );
}

function Empty() {
  return <p className="p-4 text-sm text-muted">Nothing here.</p>;
}
