import { promises as fs } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container } from "@/components/chrome/Container";

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
      return await fs.readFile(p, "utf8");
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
  return (
    <Container className="py-10 md:py-16">
      <article className="prose-journal">
        <MDXRemote source={source} />
      </article>
    </Container>
  );
}

export async function generateStaticParams() {
  return [
    { slug: "00-philosophy" },
    { slug: "01-first-principles" },
    { slug: "02-energy-protocol" },
    { slug: "03-attention-protocol" },
    { slug: "04-failure-recovery" },
    { slug: "05-anti-patterns" },
    { slug: "06-tldr" },
    { slug: "07-next-7-days" },
    { slug: "08-framework-comparison" },
    { slug: "cadence" },
    { slug: "decision-log" },
    { slug: "diagnosis" },
    { slug: "sleep-protocol" },
    { slug: "deep-work-protocol" },
    { slug: "exercise-protocol" },
    { slug: "recovery-protocol" },
  ];
}
