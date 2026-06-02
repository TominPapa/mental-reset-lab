"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";

export interface FrameworkFormInput {
  id?: string;
  title: string;
  slug: string;
  statement: string;
  explanation: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
}

export interface ActionResult {
  ok: boolean;
  id?: string;
  error?: string;
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  excludeId?: string,
): Promise<string> {
  const root = slugify(base) || "framework";
  let candidate = root;
  let n = 1;
  for (;;) {
    let query = supabase.from("frameworks").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

export async function saveFramework(
  input: FrameworkFormInput,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  if (!input.statement.trim())
    return { ok: false, error: "Statement is required." };
  if (!input.category.trim())
    return { ok: false, error: "Category is required." };

  const slug = await uniqueSlug(
    supabase,
    input.slug || input.title || input.statement,
    input.id,
  );

  const row = {
    title: input.title.trim() || input.statement.slice(0, 60),
    slug,
    statement: input.statement.trim(),
    explanation: input.explanation || null,
    category: input.category,
    tags: input.tags,
    status: input.status,
  };

  let id = input.id;
  if (id) {
    const { error } = await supabase
      .from("frameworks")
      .update(row)
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("frameworks")
      .insert(row)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    id = data.id;
  }

  revalidatePath("/admin/frameworks");
  revalidatePath("/frameworks");
  revalidatePath("/");
  return { ok: true, id };
}

export async function deleteFramework(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("frameworks").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/frameworks");
  revalidatePath("/frameworks");
  return { ok: true };
}

export async function setFrameworkStatus(
  id: string,
  status: "draft" | "published",
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("frameworks")
    .update({ status })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/frameworks");
  revalidatePath("/frameworks");
  return { ok: true };
}
