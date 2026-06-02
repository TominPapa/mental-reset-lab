import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { YouTubeCTA } from "@/components/YouTubeCTA";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Watch",
  description: `Short mindset frameworks on video. Subscribe to ${SITE.name} on YouTube.`,
};

export default function WatchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Video"
        title="Watch"
        description="Every framework here has a 30-second version on YouTube. Same idea, less reading."
      />
      <Container size="narrow" className="py-14">
        <YouTubeCTA label="Subscribe on YouTube" />

        <div className="mt-12 border-t border-border pt-8">
          <p className="eyebrow">What you&apos;ll get</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>· One clear idea per video — no padding.</li>
            <li>· Three concrete rules you can use today.</li>
            <li>· No motivation theater. No therapy talk.</li>
          </ul>
        </div>
      </Container>
    </>
  );
}
