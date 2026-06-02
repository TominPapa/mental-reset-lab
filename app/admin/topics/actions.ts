"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function addTopic(input: {
  topic: string;
  category: string;
  priority: number;
  notes?: string;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };
  if (!input.topic.trim()) return { ok: false, error: "Topic is required." };

  const { error } = await supabase.from("topic_ideas").insert({
    topic: input.topic.trim(),
    category: input.category || null,
    priority: input.priority || 0,
    notes: input.notes || null,
    source: "manual",
    status: "new",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/topics");
  revalidatePath("/admin");
  return { ok: true };
}

export async function setTopicStatus(
  id: string,
  status: "new" | "used" | "ignored",
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("topic_ideas")
    .update({ status })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/topics");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteTopic(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("topic_ideas").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/topics");
  revalidatePath("/admin");
  return { ok: true };
}
