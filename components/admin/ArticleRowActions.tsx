"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteArticle, setArticleStatus } from "@/app/admin/actions";
import type { ArticleStatus } from "@/lib/constants";

export function ArticleRowActions({
  id,
  status,
}: {
  id: string;
  status: ArticleStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function changeStatus(next: ArticleStatus) {
    startTransition(async () => {
      const res = await setArticleStatus(id, next);
      if (res.ok) router.refresh();
      else alert(res.error);
    });
  }

  function onDelete() {
    if (!confirm("Delete this article permanently?")) return;
    startTransition(async () => {
      const res = await deleteArticle(id);
      if (res.ok) router.refresh();
      else alert(res.error);
    });
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      {status !== "published" && (
        <button
          onClick={() => changeStatus("published")}
          disabled={pending}
          className="text-muted hover:text-foreground disabled:opacity-50"
        >
          Publish
        </button>
      )}
      {status === "published" && (
        <button
          onClick={() => changeStatus("draft")}
          disabled={pending}
          className="text-muted hover:text-foreground disabled:opacity-50"
        >
          Unpublish
        </button>
      )}
      {status !== "archived" && (
        <button
          onClick={() => changeStatus("archived")}
          disabled={pending}
          className="text-muted hover:text-foreground disabled:opacity-50"
        >
          Archive
        </button>
      )}
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
