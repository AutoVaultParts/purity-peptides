import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();

  const [
    { count: productsCount },
    { count: ordersCount },
    { count: pendingReviewsCount },
    { count: unreadMessagesCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("contact_requests").select("*", { count: "exact", head: true }).eq("status", "unread"),
  ]);

  const stats = [
    { label: "Total Products", value: productsCount ?? 0 },
    { label: "Total Orders", value: ordersCount ?? 0 },
    { label: "Pending Reviews", value: pendingReviewsCount ?? 0 },
    { label: "Unread Messages", value: unreadMessagesCount ?? 0 },
  ];

  return (
    <div className="p-6">
      <h1 className="mb-6 font-heading text-xl font-bold text-ink">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-3xl font-black text-ink">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}