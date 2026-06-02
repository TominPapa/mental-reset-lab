import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { getPublishedArticles, countPublishedArticles } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Short, practical mindset frameworks for focus, discipline, and clarity in the AI era.",
};

const PAGE_SIZE = 12;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const offset = (current - 1) * PAGE_SIZE;

  const [articles, total] = await Promise.all([
    getPublishedArticles({ limit: PAGE_SIZE, offset }),
    countPublishedArticles(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        eyebrow="Writing"
        title="Articles"
        description="Clear thinking for focus, self-mastery, and execution."
      />
      <Container size="wide" className="py-14">
        {articles.length === 0 ? (
          <p className="text-sm text-muted">No articles yet.</p>
        ) : (
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} headingLevel={2} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-14 flex items-center justify-between border-t border-border pt-6 text-sm">
            {current > 1 ? (
              <Link
                href={`/articles?page=${current - 1}`}
                className="text-muted hover:text-foreground"
              >
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="text-muted">
              Page {current} of {totalPages}
            </span>
            {current < totalPages ? (
              <Link
                href={`/articles?page=${current + 1}`}
                className="text-muted hover:text-foreground"
              >
                Next →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </Container>
    </>
  );
}
