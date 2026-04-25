import * as React from "react";
import { cn } from "@/lib/utils";

export function FieldLabel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-xs font-medium uppercase tracking-wider text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export const TextInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "block w-full bg-transparent border-0 border-b border-border px-0 py-2 text-text placeholder:text-muted/60 focus:border-text focus:outline-none focus:ring-0 transition-colors",
        className,
      )}
      {...props}
    />
  ),
);
TextInput.displayName = "TextInput";

export const TextAreaInput = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "block w-full bg-transparent border border-border rounded-md px-3 py-2 text-text placeholder:text-muted/60 focus:border-text focus:outline-none transition-colors",
      className,
    )}
    {...props}
  />
));
TextAreaInput.displayName = "TextAreaInput";

export function FormBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}
