import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { FrameworkCard } from "@/components/FrameworkCard";
import { getPublishedFrameworks } from "@/lib/data";
import { CATEGORIES } from "@/lib/constants";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Frameworks",
  description:
    "Short mental frameworks you can apply today — one sharp idea per card.",
};

export default async function FrameworksPage() {
  const frameworks = await getPublishedFrameworks();

  const byCategory = CATEGORIES.map((c) => ({
    category: c,
    items: frameworks.filter((f) => f.category === c.name),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="Frameworks"
        description="One sharp idea per card. Built to be remembered, not just read."
      />
      <Container size="wide" className="py-14">
        {frameworks.length === 0 ? (
          <p className="text-sm text-muted">No frameworks yet.</p>
        ) : (
          <div className="space-y-14">
            {byCategory.map(({ category, items }) => (
              <section key={category.slug}>
                <h2 className="eyebrow">{category.name}</h2>
                <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((f) => (
                    <FrameworkCard key={f.id} framework={f} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
