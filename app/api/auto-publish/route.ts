// Daily auto-publish cron. Generates one article, runs the AI/quality gate,
// publishes if approved (else holds as draft), then revalidates public caches.
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { runAutoPublish } from "@/lib/ai/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (request.headers.get("authorization") === `Bearer ${secret}`) return true;
  return new URL(request.url).searchParams.get("secret") === secret;
}

async function run() {
  // Flip any due scheduled posts to published (manual-schedule safety net).
  try {
    const sb = createAdminClient();
    await sb
      .from("articles")
      .update({ status: "published" })
      .eq("status", "scheduled")
      .lte("published_at", new Date().toISOString());
  } catch {
    /* non-fatal */
  }

  const result = await runAutoPublish();

  // Refresh public surfaces.
  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  if (result.slug) revalidatePath(`/articles/${result.slug}`);

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

export async function GET(request: Request) {
  if (!authorized(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return run();
}

export async function POST(request: Request) {
  if (!authorized(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return run();
}
