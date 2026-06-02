import type { Framework } from "@/lib/types";

export function FrameworkCard({ framework }: { framework: Framework }) {
  return (
    <figure className="flex h-full flex-col border-t border-border pt-5">
      <blockquote className="font-display text-xl font-medium leading-snug tracking-tight">
        {framework.statement}
      </blockquote>
      {framework.explanation && (
        <figcaption className="mt-3 text-sm leading-relaxed text-muted">
          {framework.explanation}
        </figcaption>
      )}
      <span className="eyebrow mt-4">{framework.category}</span>
    </figure>
  );
}
