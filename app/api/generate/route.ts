import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateContent } from "@/lib/ai/generate";
import type { GenerateInput } from "@/lib/ai/prompts";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  // Admin only.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let input: GenerateInput;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!input.topic?.trim() || !input.category?.trim()) {
    return NextResponse.json(
      { error: "Topic and category are required." },
      { status: 400 },
    );
  }

  try {
    const content = await generateContent(input);
    return NextResponse.json({ content });
  } catch (err) {
    console.error("generate:", err);
    const message =
      err instanceof Error ? err.message : "Generation failed. Try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
