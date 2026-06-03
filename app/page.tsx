import Link from "next/link";
import { Container } from "@/components/Container";
import { ArticleCard } from "@/components/ArticleCard";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { FrameworkCard } from "@/components/FrameworkCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { YouTubeCTA } from "@/components/YouTubeCTA";
import { HeroBackground } from "@/components/HeroBackground";
import { getPublishedArticles, getPublishedFrameworks } from "@/lib/data";
import { SITE, CATEGORIES } from "@/lib/constants";

export const revalidate = 300;

export default async function Home() {
  const [articles, frameworks] = await Promise.all([
    getPublishedArticles({ limit: 7 }),
    getPublishedFrameworks(),
  ]);

  const [featured, ...rest] = articles;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <HeroBackground />
        <Container size="wide" className="py-28 sm:py-40">
          <p className="eyebrow">Mindset frameworks for the AI age</p>
          <h1 className="font-display mt-5 max-w-4xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            {SITE.tagline}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
            No clichés. No therapy talk. Just clear, repeatable thinking for
            focus, self-mastery, and execution.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/articles"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
            >
              Read the articles
            </Link>
            <YouTubeCTA label="Watch on YouTube" />
          </div>
        </Container>
      </section>

      {/* Featured + latest */}
      {articles.length > 0 && (
        <Container size="wide" className="py-16">
          {featured && <FeaturedArticle article={featured} />}

          {rest.length > 0 && (
            <div className="mt-14">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow">More articles</p>
                <Link
                  href="/articles"
                  className="text-sm text-muted hover:text-foreground"
                >
                  All articles →
                </Link>
              </div>
              <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          )}
        </Container>
      )}

      {articles.length === 0 && (
        <Container size="wide" className="py-16">
          <p className="text-sm text-muted">
            No articles published yet. Create one in the admin.
          </p>
        </Container>
      )}

      {/* Categories — editorial index */}
      <section className="border-y border-border bg-surface">
        <Container size="wide" className="py-16">
          <h2 className="eyebrow">Browse by theme</h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                style={
                  {
                    "--cat": c.color,
                    "--cat-dark": c.colorDark,
                  } as React.CSSProperties
                }
                className="group flex gap-4 bg-surface p-6 transition-colors hover:bg-background"
              >
                <span className="cat-accent font-display text-lg font-medium">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="font-display block text-lg font-medium group-hover:underline">
                    {c.name}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {c.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Frameworks */}
      {frameworks.length > 0 && (
        <Container size="wide" className="py-16">
          <div className="flex items-baseline justify-between">
            <h2 className="eyebrow">Frameworks</h2>
            <Link
              href="/frameworks"
              className="text-sm text-muted hover:text-foreground"
            >
              All frameworks →
            </Link>
          </div>
          <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {frameworks.slice(0, 6).map((f) => (
              <FrameworkCard key={f.id} framework={f} />
            ))}
          </div>
        </Container>
      )}

      {/* Newsletter */}
      <section className="border-t border-border bg-surface">
        <Container size="wide" className="py-16">
          <div className="max-w-2xl">
            <p className="eyebrow">Newsletter</p>
            <h2 className="font-display mt-3 text-2xl font-medium tracking-tight">
              One framework a week
            </h2>
            <p className="mt-2 text-muted">
              A short, practical mental framework in your inbox. No spam, no
              fluff.
            </p>
            <div className="mt-5">
              <NewsletterSignup source="home" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
