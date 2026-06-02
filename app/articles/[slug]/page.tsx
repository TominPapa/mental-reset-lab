import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Markdown } from "@/components/Markdown";
import { ArticleCard } from "@/components/ArticleCard";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { getArticleBySlug, getRelatedArticles } from "@/lib/data";
import { categoryByName, categoryColor, SITE } from "@/lib/constants";
import { formatDate, readingTime } from "@/lib/utils/format";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not found" };

  const title = article.seo_title || article.title;
  const description = article.meta_description || article.summary || SITE.description;
  const url = `${SITE.url}/articles/${article.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: article.published_at || undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article, 3);
  const cat = categoryByName(article.category);
  const accent = categoryColor(article.category);
  const accentStyle = {
    "--cat-accent": accent.color,
    "--cat-accent-dark": accent.colorDark,
  } as React.CSSProperties;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.meta_description || article.summary || undefined,
    image: `${SITE.url}/articles/${article.slug}/opengraph-image`,
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at,
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/opengraph-image`,
      },
    },
    mainEntityOfPage: `${SITE.url}/articles/${article.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      ...(cat
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: cat.name,
              item: `${SITE.url}/categories/${cat.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: cat ? 3 : 2,
        name: article.title,
        item: `${SITE.url}/articles/${article.slug}`,
      },
    ],
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Container size="narrow" className="py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            {cat && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden>/</li>
            <li className="truncate text-foreground" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>
        <div className="flex items-center gap-2 text-sm text-muted">
          {cat ? (
            <Link href={`/categories/${cat.slug}`} className="hover:text-foreground">
              {article.category}
            </Link>
          ) : (
            <span>{article.category}</span>
          )}
          <span aria-hidden>·</span>
          <time dateTime={article.published_at ?? undefined}>
            {formatDate(article.published_at)}
          </time>
          <span aria-hidden>·</span>
          <span>{readingTime(article.body)}</span>
        </div>

        <h1 className="font-display mt-4 text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl">
          {article.title}
        </h1>
        {article.one_line_insight && (
          <p className="mt-5 text-xl leading-relaxed text-muted">
            {article.one_line_insight}
          </p>
        )}

        {article.youtube_url && (
          <div className="mt-8">
            <YouTubeEmbed url={article.youtube_url} title={article.title} />
          </div>
        )}

        <div className="mt-10" style={accentStyle}>
          <Markdown>{article.body}</Markdown>
        </div>

        {article.practical_rules?.length > 0 && (
          <section className="mt-12 rounded-lg border border-border bg-surface p-6">
            <h2 className="eyebrow">3 Practical Rules</h2>
            <ol className="mt-4 space-y-3">
              {article.practical_rules.map((rule, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-semibold text-muted">{i + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {article.reflection_question && (
          <section className="mt-8 border-l-2 border-foreground/40 pl-5">
            <h2 className="eyebrow">Reflection</h2>
            <p className="font-display mt-2 text-2xl font-medium italic leading-snug">
              {article.reflection_question}
            </p>
          </section>
        )}

        {SITE.youtubeUrl && (
          <div className="mt-12 border-t border-border pt-8">
            <a
              href={SITE.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40"
            >
              See more →
            </a>
          </div>
        )}
      </Container>

      {related.length > 0 && (
        <section className="border-t border-border bg-surface">
          <Container size="wide" className="py-16">
            <h2 className="font-display text-2xl font-medium tracking-tight">
              Related
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
