"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Notebook, BarChart3, BookOpen, GitBranch, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Today", icon: Notebook },
  { href: "/track", label: "Track", icon: BarChart3 },
  { href: "/review", label: "Review", icon: ScrollText },
  { href: "/insights", label: "Insights", icon: GitBranch },
  { href: "/protocols/00-philosophy", label: "Docs", icon: BookOpen },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-bg/95 backdrop-blur z-30 flex">
      {ITEMS.map((it) => {
        const Icon = it.icon;
        const active =
          it.href === "/"
            ? pathname === "/"
            : pathname === it.href || pathname.startsWith(it.href + "/");
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[10px]",
              active ? "text-accent" : "text-muted",
            )}
          >
            <Icon className="h-4 w-4" />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
