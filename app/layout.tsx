import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopLoader from "@/components/TopLoader";
import DisableImageActions from "@/components/DisableImageActions";
import { CartProvider } from "@/lib/cart-context";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.puritypeptides.com"),
  title: "Purity Peptides | Research-Grade Peptides & Education",
  description:
    "Purity Peptides is a premium peptide education and e-commerce platform built on transparency, quality, and evidence-based information.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body">
        <Suspense fallback={null}>
          <TopLoader />
        </Suspense>
        <DisableImageActions />
        <CartProvider>
          <Navbar />
          <div className="relative">
            <div
              className="pointer-events-none fixed inset-0 z-0 bg-contain bg-center bg-no-repeat opacity-[0.04]"
              style={{ backgroundImage: "url('/logo.png')" }}
            />
            <main className="relative z-10">{children}</main>
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
