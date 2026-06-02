// Human-readable, kebab-case, lowercase slugs (SEO_RULES.md).
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[‘’“”]/g, "") // smart quotes
    .replace(/[^a-z0-9]+/g, "-") // non-alnum → hyphen
    .replace(/^-+|-+$/g, "") // trim hyphens
    .replace(/-{2,}/g, "-") // collapse repeats
    .slice(0, 80);
}
