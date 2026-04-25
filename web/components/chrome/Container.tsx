import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const max = size === "sm" ? "max-w-xl" : size === "lg" ? "max-w-4xl" : "max-w-2xl";
  return <div className={cn("mx-auto px-5 md:px-8", max, className)}>{children}</div>;
}
