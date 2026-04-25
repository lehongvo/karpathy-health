"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Battery,
  Brain,
  ListChecks,
  GraduationCap,
  LineChart,
  Notebook,
} from "lucide-react";

const ITEMS = [
  { href: "/", label: "Today", icon: LayoutDashboard },
  { href: "/energy", label: "Energy", icon: Battery },
  { href: "/attention", label: "Attention", icon: Brain },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/learning", label: "Learning", icon: GraduationCap },
  { href: "/insights", label: "Insights", icon: LineChart },
  { href: "/protocols/sleep-protocol", label: "Protocols", icon: Notebook },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2">
        <Link href="/" className="mr-2 flex items-center gap-1 font-mono text-sm font-semibold">
          <span>karpathy</span>
          <span className="text-[var(--color-health)]">/health</span>
        </Link>
        <div className="ml-2 flex items-center gap-1">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href.split("/").slice(0, 2).join("/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
