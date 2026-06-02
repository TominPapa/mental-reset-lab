"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  deleteFramework,
  setFrameworkStatus,
} from "@/app/admin/frameworks/actions";

export function FrameworkRowActions({
  id,
  status,
}: {
  id: string;
  status: "draft" | "published";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const res = await setFrameworkStatus(
        id,
        status === "published" ? "draft" : "published",
      );
      if (res.ok) router.refresh();
      else alert(res.error);
    });
  }

  function onDelete() {
    if (!confirm("Delete this framework?")) return;
    startTransition(async () => {
      const res = await deleteFramework(id);
      if (res.ok) router.refresh();
      else alert(res.error);
    });
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      <button
        onClick={toggle}
        disabled={pending}
        className="text-muted hover:text-foreground disabled:opacity-50"
      >
        {status === "published" ? "Unpublish" : "Publish"}
      </button>
      <button
        onClick={onDelete}
        disabled={pending}
        className="text-red-600 hover:text-red-700 disabled:opacity-50 dark:text-red-400"
      >
        Delete
      </button>
    </div>
  );
}
