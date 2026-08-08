"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseAuth as supabase } from "@/lib/supabase-browser-ssr";

type Badges = {
  reviews: number;
  messages: number;
};

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true, badgeKey: null },
  { href: "/admin/products", label: "Products", badgeKey: null },
  { href: "/admin/categories", label: "Categories", badgeKey: null },
  { href: "/admin/orders", label: "Orders", badgeKey: null },
  { href: "/admin/reviews", label: "Reviews", badgeKey: "reviews" as const },
  { href: "/admin/messages", label: "Messages", badgeKey: "messages" as const },
  { href: "/admin/shipping", label: "Shipping Rates", badgeKey: null },
  { href: "/admin/customers", label: "Customers", badgeKey: null },
];

export default function AdminSidebar({
  userEmail,
  badges,
}: {
  userEmail: string;
  badges: Badges;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-ink font-body">
      <div className="border-b border-white/10 p-5">
        <img src="/logo.png" alt="Purity Peptides" className="h-10 w-auto object-contain" />
        <p className="mt-2 font-heading text-xs text-gray-400">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-sky text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              {badgeCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link href="/" className="mb-3 block text-sm text-gray-400 hover:text-white">
          View Website
        </Link>
        <p className="mb-2 truncate text-xs font-semibold text-sky">{userEmail}</p>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-400 transition-colors hover:text-red-400"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}