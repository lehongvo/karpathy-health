import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/Providers";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "karpathy/health — PersonalOS",
  description:
    "Sustainable productivity OS for a multi-tasking dev. Karpathy-style minimal, citation-backed protocols, daily-driver dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <SiteNav />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
