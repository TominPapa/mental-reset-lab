import Link from "next/link";
import { Container } from "./Container";
import { NavLinks } from "./NavLinks";
import { SITE } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="shrink-0 font-semibold tracking-tight"
            aria-label={`${SITE.name} home`}
          >
            {SITE.name}
          </Link>
          <NavLinks />
        </div>
      </Container>
    </header>
  );
}
