import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/Container";
import { ArticleRowActions } from "@/components/admin/ArticleRowActions";
import { formatDate } from "@/lib/utils/format";
import { ARTICLE_STATUSES } from "@/lib/constants";
import type { Article } from "@/lib/types";

export const dynamic = "force-dynamic";

const FILTERS = ["all", ...ARTICLE_STATUSES] as const;

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = "all", q = "" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select("id,title,slug,category,status,published_at,updated_at")
    .order("updated_at", { ascending: false });

  if (status !== "all" && (ARTICLE_STATUSES as readonly string[]).includes(status)) {
    query = query.eq("status", status);
  }
  if (q.trim()) query = query.ilike("title", `%${q.trim()}%`);

  const { data } = await query;
  const articles = (data as Article[]) ?? [];

  return (
    <Container size="wide" className="py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:opacity-90"
        >
          + New
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/articles" : `/admin/articles?status=${f}`}
            className={`rounded-full border px-3 py-1 capitalize ${
              status === f
                ? "border-foreground bg-accent text-accent-contrast"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {f}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
        {articles.length === 0 ? (
          <p className="p-6 text-sm text-muted">No articles found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {a.title}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">
                    {a.category}
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-muted">{a.status}</span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted md:table-cell">
                    {formatDate(a.published_at ?? a.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <ArticleRowActions id={a.id} status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Container>
  );
}
