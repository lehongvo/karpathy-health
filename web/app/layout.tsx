import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/chrome/Providers";
import { SideNav } from "@/components/chrome/SideNav";
import { BottomNav } from "@/components/chrome/BottomNav";
import { Header } from "@/components/chrome/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "karpathy/health — PersonalOS",
  description: "Sustainable productivity OS for a multi-tasking dev. Journal-first, ritual-driven, citation-backed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
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
