"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/learn", label: "Learn" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { count } = useCart();

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
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky"
          >
            Shop now
          </Link>
        </div>
      </div>

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