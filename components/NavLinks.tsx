"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/articles", label: "Articles" },
  { href: "/frameworks", label: "Frameworks" },
  { href: "/watch", label: "Watch" },
  { href: "/about", label: "About" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="-mx-1 flex items-center gap-4 overflow-x-auto text-sm sm:gap-5"
    >
      {NAV.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 px-1 transition-colors ${
              active
                ? "font-medium text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
