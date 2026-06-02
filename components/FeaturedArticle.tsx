import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/utils/format";

export function FeaturedArticle({ article }: { article: Article }) {
  return (
    <article className="group relative">
      <p className="eyebrow">Latest · {article.category}</p>
      <h2 className="font-display mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
        <Link
          href={`/articles/${article.slug}`}
          className="after:absolute after:inset-0 hover:underline"
        >
          {article.title}
        </Link>
      </h2>
      {(article.one_line_insight || article.summary) && (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          {article.one_line_insight || article.summary}
        </p>
      )}
      <div className="mt-5 flex items-center gap-2 text-sm text-muted">
        {article.published_at && (
          <time dateTime={article.published_at}>
            {formatDate(article.published_at)}
          </time>
        )}
        <span aria-hidden>·</span>
        <span>{readingTime(article.body)}</span>
        <span aria-hidden>·</span>
        <span className="font-medium text-foreground group-hover:underline">
          Read
        </span>
      </div>
    </article>
  );
}
