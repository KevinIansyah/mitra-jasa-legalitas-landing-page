"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PortalHero } from "./portal-hero";
import { BRAND_BLUE } from "@/lib/types/constants";

const tabs = [
  { href: "/portal", label: "Ringkasan" },
  { href: "/portal/notifikasi", label: "Notifikasi" },
  { href: "/portal/proyek", label: "Proyek" },
  { href: "/portal/permintaan-penawaran", label: "Permintaan penawaran" },
  { href: "/portal/faktur", label: "Faktur" },
  { href: "/portal/proposal", label: "Proposal" },
  { href: "/portal/estimasi", label: "Estimasi" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/portal") {
    return pathname === "/portal";
  }
  if (href === "/portal/faktur") {
    return pathname === "/portal/faktur" || pathname.startsWith("/portal/faktur/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PortalLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabLink = (href: string, label: string, variant: "mobile" | "desktop") => {
    const active = isActive(pathname, href);
    if (variant === "mobile") {
      return (
        <Link
          key={href}
          href={href}
          className={cn(
            "-mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 text-sm transition-colors",
            active ? "font-semibold text-gray-900 dark:text-white" : "border-transparent font-medium text-muted-foreground hover:text-gray-800 dark:hover:text-gray-200",
          )}
          style={active ? { borderBottomColor: BRAND_BLUE } : undefined}
        >
          {label}
        </Link>
      );
    }
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          "block border-l-2 py-2.5 pl-4 text-sm transition-colors",
          active
            ? "font-semibold text-gray-900 dark:text-white"
            : "border-transparent text-muted-foreground hover:border-gray-200 hover:bg-gray-50/90 hover:text-gray-900 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-white",
        )}
        style={active ? { borderLeftColor: BRAND_BLUE } : undefined}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <PortalHero />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <nav className="mb-8 flex gap-6 overflow-x-auto border-b border-gray-200 pb-0 dark:border-white/10 md:hidden" aria-label="Portal">
          {tabs.map((t) => tabLink(t.href, t.label, "mobile"))}
        </nav>

        <div className="flex flex-col gap-10 md:flex-row md:gap-12 lg:gap-16">
          <nav className="hidden w-52 shrink-0 flex-col gap-0.5 md:flex lg:w-56" aria-label="Portal">
            {tabs.map((t) => tabLink(t.href, t.label, "desktop"))}
          </nav>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
