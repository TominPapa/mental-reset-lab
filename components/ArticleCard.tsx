import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/utils/format";

export function ArticleCard({
  article,
  headingLevel = 3,
}: {
  article: Article;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return (
    <article className="group relative flex flex-col border-t border-border pt-5">
      <div className="flex items-center gap-2 text-xs">
        <span className="eyebrow">{article.category}</span>
      </div>
      <Heading className="mt-3 text-lg font-semibold leading-snug tracking-tight">
        <Link href={`/articles/${article.slug}`} className="after:absolute after:inset-0">
          {article.title}
        </Link>
      </Heading>
      {article.one_line_insight && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {article.one_line_insight}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        {article.published_at && (
          <time dateTime={article.published_at}>
            {formatDate(article.published_at)}
          </time>
        )}
        <span aria-hidden>·</span>
        <span>{readingTime(article.body)}</span>
      </div>
    </article>
  );
}
