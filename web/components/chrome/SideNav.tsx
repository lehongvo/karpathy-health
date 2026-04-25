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
  { href: "/protocols/00-philosophy", label: "Protocols", icon: BookOpen },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/protocols")) return pathname.startsWith("/protocols");
  return pathname === href || pathname.startsWith(href + "/");
}

export function SideNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-48 border-r border-border bg-bg p-6 z-10">
      <div className="font-serif text-lg leading-tight mb-10">
        karpathy<span className="text-muted">/health</span>
      </div>
      <nav className="space-y-1">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const active = isActive(pathname, it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors",
                active ? "text-text bg-accent-soft" : "text-muted hover:text-text hover:bg-accent-soft/40",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="absolute left-6 right-6 bottom-6 text-[10px] text-muted leading-relaxed">
        v0.2 · build before you buy<br />no telemetry · 100% local
      </div>
    </aside>
  );
}
