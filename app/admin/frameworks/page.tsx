import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/Container";
import { FrameworkRowActions } from "@/components/admin/FrameworkRowActions";
import type { Framework } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminFrameworksPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("frameworks")
    .select("*")
    .order("updated_at", { ascending: false });
  const frameworks = (data as Framework[]) ?? [];

  return (
    <Container size="wide" className="py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Frameworks</h1>
        <Link
          href="/admin/frameworks/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:opacity-90"
        >
          + New
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
        {frameworks.length === 0 ? (
          <p className="p-6 text-sm text-muted">No frameworks yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Statement</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {frameworks.map((fw) => (
                <tr key={fw.id}>
                  <td className="max-w-md px-4 py-3">
                    <Link
                      href={`/admin/frameworks/${fw.id}/edit`}
                      className="line-clamp-2 font-medium hover:underline"
                    >
                      {fw.statement}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">
                    {fw.category}
                  </td>
                  <td className="px-4 py-3 capitalize text-muted">
                    {fw.status}
                  </td>
                  <td className="px-4 py-3">
                    <FrameworkRowActions id={fw.id} status={fw.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Container>
  );
}
