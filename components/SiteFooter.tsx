import Link from "next/link";
import { Container } from "./Container";
import { SITE, CATEGORIES, MEDICAL_DISCLAIMER } from "@/lib/constants";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <Container size="wide">
        <div className="grid gap-8 py-12 sm:grid-cols-3">
          <div>
            <p className="font-semibold tracking-tight">{SITE.name}</p>
            <p className="mt-2 max-w-xs text-sm text-muted">{SITE.tagline}</p>
          </div>
          <nav aria-label="Categories">
            <p className="text-sm font-medium">Categories</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="More">
            <p className="text-sm font-medium">More</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/articles" className="hover:text-foreground">
                  All articles
                </Link>
              </li>
              <li>
                <Link href="/frameworks" className="hover:text-foreground">
                  Frameworks
                </Link>
              </li>
              <li>
                <Link href="/watch" className="hover:text-foreground">
                  Watch on YouTube
                </Link>
              </li>
              <li>
                <Link href="/feed.xml" className="hover:text-foreground">
                  RSS feed
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-border py-6">
          <p className="text-xs text-muted">{MEDICAL_DISCLAIMER}</p>
          <p className="mt-2 text-xs text-muted">
            © {year} {SITE.name}.
          </p>
        </div>
      </Container>
    </footer>
  );
}
