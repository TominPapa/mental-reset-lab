import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/Container";
import { TopicManager } from "@/components/admin/TopicManager";
import type { TopicIdea } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminTopicsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("topic_ideas")
    .select("*")
    .order("created_at", { ascending: false });
  const topics = (data as TopicIdea[]) ?? [];

  return (
    <Container size="wide" className="py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Topic ideas</h1>
      <p className="mt-2 text-sm text-muted">
        Your backlog. Hit <span className="font-medium">Generate</span> to send a
        topic straight into the article generator.
      </p>
      <div className="mt-8">
        <TopicManager initial={topics} />
      </div>
    </Container>
  );
}
