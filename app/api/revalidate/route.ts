// Scheduled-publish cron. Vercel Cron hits this on a schedule (see vercel.json).
// Flips due "scheduled" articles to "published" and revalidates public caches.
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  // Allow ?secret= for manual triggering / non-Vercel schedulers.
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

async function run() {
  const supabase = createAdminClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("articles")
    .update({ status: "published" })
    .eq("status", "scheduled")
    .lte("published_at", nowIso)
    .select("slug");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const published = data ?? [];

  // Always refresh the indexes; refresh each newly live article too.
  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  for (const row of published) {
    revalidatePath(`/articles/${row.slug}`);
  }

  return NextResponse.json({ published: published.length, slugs: published.map((r) => r.slug) });
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return run();
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return run();
}
