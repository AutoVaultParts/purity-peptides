import { redirect } from "next/navigation";
import { createSupabaseServerClient, ADMIN_EMAILS } from "@/lib/supabase-server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    redirect("/admin/login");
  }

  const [{ count: pendingReviews }, { count: unreadMessages }] = await Promise.all([
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("contact_requests").select("*", { count: "exact", head: true }).eq("status", "unread"),
  ]);

  return (
    <div className="flex min-h-screen bg-gray-100 font-body">
      <AdminSidebar
        userEmail={user.email}
        badges={{
          reviews: pendingReviews ?? 0,
          messages: unreadMessages ?? 0,
        }}
      />
      <div className="relative flex-1 overflow-auto">
        <div
          className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat opacity-[0.04]"
          style={{ backgroundImage: "url('/logo.png')" }}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}