import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopLoader from "@/components/TopLoader";
import DisableImageActions from "@/components/DisableImageActions";
import { CartProvider } from "@/lib/cart-context";

// Display serif, used only for the large H1 hero line
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

// Technical grotesk, used for H2/H3 and anything bold or "outstanding"
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

// Body copy
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
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
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}