import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SITE, MEDICAL_DISCLAIMER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `What ${SITE.name} is, and what it deliberately is not.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title={`What ${SITE.name} is`} />
      <Container size="narrow" className="py-14">
        <div className="prose-article">
          <p>
            {SITE.name} is a collection of short mental frameworks for focus,
            self-mastery, and execution in the AI era. The goal is simple: give
            you one clear, usable idea at a time — and nothing you have to wade
            through.
          </p>
          <h2>What this is</h2>
          <p>
            Practical thinking tools. A claim, an uncomfortable truth, a small
            framework, and three rules you can act on today. Built to be
            repeated, not just consumed.
          </p>
          <h2>What this is not</h2>
          <p>
            Not a quote wall. Not generic motivation. Not therapy, diagnosis, or
            medical advice. If you need clinical support, talk to a qualified
            professional.
          </p>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="eyebrow">Newsletter</p>
          <h2 className="font-display mt-3 text-2xl font-medium tracking-tight">
            Get one framework a week
          </h2>
          <div className="mt-4">
            <NewsletterSignup source="about" />
          </div>
        </div>

        <p className="mt-12 text-xs text-muted">{MEDICAL_DISCLAIMER}</p>
      </Container>
    </>
  );
}
