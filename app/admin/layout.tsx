import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/Container";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated (i.e. the login page) renders without the admin chrome.
  if (!user) return <>{children}</>;

  return (
    <div>
      <div className="border-b border-border bg-surface">
        <Container size="wide">
          <div className="flex h-12 items-center justify-between gap-4 text-sm">
            <nav className="flex items-center gap-5">
              <Link href="/admin" className="font-medium hover:underline">
                Dashboard
              </Link>
              <Link href="/admin/articles" className="text-muted hover:text-foreground">
                Articles
              </Link>
              <Link
                href="/admin/frameworks"
                className="text-muted hover:text-foreground"
              >
                Frameworks
              </Link>
              <Link href="/admin/topics" className="text-muted hover:text-foreground">
                Topics
              </Link>
              <Link
                href="/admin/articles/new"
                className="text-muted hover:text-foreground"
              >
                New
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <span className="hidden text-muted sm:inline">{user.email}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-muted hover:text-foreground"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </Container>
      </div>
      {children}
    </div>
  );
}
