"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [{ href: "/intro", label: "Intro" }];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {links.map(({ href, label }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-ds-sm px-2.5 py-1.5 text-sm font-medium transition-colors duration-ds ease-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg ${
              isActive ? "text-ds-accent" : "text-ds-text-muted hover:text-ds-text"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
