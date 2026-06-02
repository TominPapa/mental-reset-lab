import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container size="narrow" className="py-32 text-center">
      <p className="text-sm font-medium text-muted">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-3 text-muted">
        The link may be broken, or the page may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast hover:opacity-90"
      >
        Back home
      </Link>
    </Container>
  );
}
