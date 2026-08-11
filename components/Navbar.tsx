"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import SearchBar from "./SearchBar";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/learn", label: "Learn" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Purity Peptides"
            className="h-16 w-auto object-contain transition-transform hover:animate-[shake_0.4s_ease-in-out] active:animate-[shake_0.4s_ease-in-out]"
          />
        </Link>
        <nav className="hidden gap-8 text-base font-bold text-black-600 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-block transition-transform hover:text-sky hover:animate-[shake_0.4s_ease-in-out]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <SearchBar />
          <Link
            href="/cart"
            className="relative inline-block text-ink transition-transform hover:text-sky hover:animate-[shake_0.4s_ease-in-out]"
          >
            <img src="/icon-cart.png" alt="Cart" className="h-5 w-5 object-contain" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-sky text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link href="/account" className="hidden text-sm font-medium text-ink hover:text-sky md:inline">
            Sign in
          </Link>
          <Link
            href="/shop"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky sm:inline-block"
          >
            Shop now
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center text-ink md:hidden"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-semibold text-ink hover:bg-sky-bg hover:text-sky"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-base font-semibold text-ink hover:bg-sky-bg hover:text-sky"
            >
              Sign in
            </Link>
          </div>
        </nav>
      )}

      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          20% {
            transform: translateX(-3px) rotate(-3deg);
          }
          40% {
            transform: translateX(3px) rotate(3deg);
          }
          60% {
            transform: translateX(-3px) rotate(-2deg);
          }
          80% {
            transform: translateX(3px) rotate(2deg);
          }
        }
      `}</style>
    </header>
  );
}
