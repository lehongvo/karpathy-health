import { promises as fs } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/mdx-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CONTENT_DIR = path.join(process.cwd(), "content");
const DOCS_DIR = path.join(process.cwd(), "..", "docs");

async function loadProtocol(slug: string): Promise<string | null> {
  const candidates = [
    path.join(CONTENT_DIR, `${slug}.mdx`),
    path.join(CONTENT_DIR, `${slug}.md`),
    path.join(DOCS_DIR, `${slug}.md`),
  ];
  for (const p of candidates) {
    try {
      const raw = await fs.readFile(p, "utf8");
      return raw;
    } catch {
      continue;
    }
  }
  return null;
}

export default async function ProtocolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const source = await loadProtocol(slug);
  if (!source) notFound();
  const components = useMDXComponents({});

  return (
    <article className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Protocol — {slug}</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <MDXRemote source={source} components={components} />
        </CardContent>
      </Card>
    </article>
  );
}

export async function generateStaticParams() {
  return [
    { slug: "sleep-protocol" },
    { slug: "deep-work-protocol" },
    { slug: "00-philosophy" },
    { slug: "06-tldr" },
    { slug: "02-energy-protocol" },
    { slug: "03-attention-protocol" },
  ];
}
