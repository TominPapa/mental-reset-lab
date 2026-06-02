import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/Container";
import { FrameworkForm } from "@/components/admin/FrameworkForm";
import type { Framework } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditFrameworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("frameworks")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const fw = data as Framework;

  return (
    <Container size="wide" className="py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit framework</h1>
        <Link
          href="/admin/frameworks"
          className="text-sm text-muted hover:text-foreground"
        >
          ← All frameworks
        </Link>
      </div>
      <FrameworkForm
        initial={{
          id: fw.id,
          title: fw.title,
          slug: fw.slug,
          statement: fw.statement,
          explanation: fw.explanation ?? "",
          category: fw.category,
          tags: fw.tags ?? [],
          status: fw.status,
        }}
      />
    </Container>
  );
}
