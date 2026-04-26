import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    wrapper: ({ children }) => <article className="prose-journal">{children}</article>,
    ...components,
  };
}
