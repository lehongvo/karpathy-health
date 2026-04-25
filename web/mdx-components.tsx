import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-8 mb-4 text-3xl font-semibold tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-3 text-2xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 text-xl font-semibold tracking-tight">{children}</h3>
    ),
    p: ({ children }) => <p className="my-3 leading-7 text-foreground/90">{children}</p>,
    ul: ({ children }) => <ul className="my-3 ml-6 list-disc space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="my-3 ml-6 list-decimal space-y-1">{children}</ol>,
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{children}</code>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-accent pl-4 italic text-foreground/70">
        {children}
      </blockquote>
    ),
    ...components,
  };
}
