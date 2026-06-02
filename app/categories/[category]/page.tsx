import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { FrameworkCard } from "@/components/FrameworkCard";
import { getPublishedArticles, getPublishedFrameworks } from "@/lib/data";
import { CATEGORIES, categoryBySlug } from "@/lib/constants";

export const revalidate = 300;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = categoryBySlug(category);
  if (!cat) return { title: "Not found" };
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/categories/${cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = categoryBySlug(category);
  if (!cat) notFound();

  const [articles, frameworks] = await Promise.all([
    getPublishedArticles({ category: cat.name }),
    getPublishedFrameworks(cat.name),
  ]);

  return (
    <>
      <PageHeader eyebrow="Category" title={cat.name} description={cat.description} />
      <Container size="wide" className="py-14">
        <section>
          <h2 className="eyebrow">Articles</h2>
          {articles.length === 0 ? (
            <p className="mt-6 text-sm text-muted">
              No articles in this category yet.
            </p>
          ) : (
            <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </section>

        {frameworks.length > 0 && (
          <section className="mt-16">
            <h2 className="eyebrow">Frameworks</h2>
            <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {frameworks.map((f) => (
                <FrameworkCard key={f.id} framework={f} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
