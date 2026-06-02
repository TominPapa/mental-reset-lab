import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/Container";
import { formatDate } from "@/lib/utils/format";
import type { Article, TopicIdea } from "@/lib/types";

export const dynamic = "force-dynamic";

async function countByStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  status: string,
) {
  const { count } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("status", status);
  return count ?? 0;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [drafts, published, scheduled, archived] = await Promise.all([
    countByStatus(supabase, "draft"),
    countByStatus(supabase, "published"),
    countByStatus(supabase, "scheduled"),
    countByStatus(supabase, "archived"),
  ]);

  const { data: recent } = await supabase
    .from("articles")
    .select("id,title,status,updated_at,slug")
    .order("updated_at", { ascending: false })
    .limit(6);

  const { data: topics } = await supabase
    .from("topic_ideas")
    .select("*")
    .eq("status", "new")
    .order("priority", { ascending: false })
    .limit(8);

  const total = drafts + published + scheduled + archived;
  const stats = [
    { label: "Total", value: total },
    { label: "Published", value: published },
    { label: "Scheduled", value: scheduled },
    { label: "Drafts", value: drafts },
  ];

  return (
    <Container size="wide" className="py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <Link
          href="/admin/articles/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:opacity-90"
        >
          + New content
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-5">
            <p className="text-3xl font-semibold">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Recent
          </h2>
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface">
            {(recent as Pick<Article, "id" | "title" | "status" | "updated_at" | "slug">[] | null)?.length ? (
              (recent as Article[]).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 p-4">
                  <Link
                    href={`/admin/articles/${a.id}/edit`}
                    className="truncate text-sm hover:underline"
                  >
                    {a.title}
                  </Link>
                  <span className="shrink-0 text-xs text-muted">
                    {a.status} · {formatDate(a.updated_at)}
                  </span>
                </li>
              ))
            ) : (
              <li className="p-4 text-sm text-muted">No content yet.</li>
            )}
          </ul>
        </section>

        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Topic ideas
            </h2>
            <Link
              href="/admin/topics"
              className="text-xs text-muted hover:text-foreground"
            >
              Manage →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface">
            {(topics as TopicIdea[] | null)?.length ? (
              (topics as TopicIdea[]).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 p-4">
                  <span className="truncate text-sm">{t.topic}</span>
                  <span className="shrink-0 text-xs text-muted">
                    {t.category ?? "—"}
                  </span>
                </li>
              ))
            ) : (
              <li className="p-4 text-sm text-muted">No open topic ideas.</li>
            )}
          </ul>
        </section>
      </div>
    </Container>
  );
}
