import type { Metadata } from "next";
import { Providers } from "@/components/chrome/Providers";
import { SideNav } from "@/components/chrome/SideNav";
import { BottomNav } from "@/components/chrome/BottomNav";
import { Header } from "@/components/chrome/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "karpathy/health — PersonalOS",
  description: "Sustainable productivity OS for a multi-tasking dev. Journal-first, ritual-driven, citation-backed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-text antialiased">
        <Providers>
          <SideNav />
          <div className="md:pl-48">
            <Header />
            <main className="pb-24 md:pb-12 pt-2">{children}</main>
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
