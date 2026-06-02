"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { triggerAutoPublish } from "@/app/admin/actions";

export function RunPipelineButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "hold" | "err"; text: string } | null>(
    null,
  );

  function run() {
    setMsg(null);
    start(async () => {
      const r = await triggerAutoPublish();
      if (!r.ok) {
        setMsg({ tone: "err", text: `오류: ${r.error ?? "실패"}` });
        return;
      }
      if (r.status === "published") {
        setMsg({
          tone: "ok",
          text: `✅ 발행됨 — "${r.title}" (품질 ${r.score}/10)`,
        });
      } else {
        setMsg({
          tone: "hold",
          text: `⏸ 보류(검수 미통과) — "${r.title}" · 사유: ${r.reason ?? "기준 미달"}`,
        });
      }
      router.refresh();
    });
  }

  const toneCls =
    msg?.tone === "ok"
      ? "text-green-700 dark:text-green-400"
      : msg?.tone === "hold"
        ? "text-amber-700 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={run}
        disabled={pending}
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "생성 중… (1~2분)" : "지금 1편 자동 생성·검수"}
      </button>
      {msg && <p className={`text-sm ${toneCls}`}>{msg.text}</p>}
    </div>
  );
}
