"use client";

import { useEffect, useState, useCallback } from "react";
import { supabaseAuth as supabase } from "@/lib/supabase-browser-ssr";

type Address = {
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

type Customer = {
  id: string;
  full_name: string | null;
  phone: string | null;
  default_address: Address | null;
  saved_cart: any[] | null;
  is_banned: boolean;
  can_review: boolean;
  created_at: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) showToast(`Failed to load customers: ${error.message}`, "error");
    setCustomers(data || []);
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  async function toggleBanned(customer: Customer) {
    setUpdatingId(customer.id);
    const { error } = await supabase
      .from("profiles")
      .update({ is_banned: !customer.is_banned })
      .eq("id", customer.id);
    if (error) {
      showToast(`Failed to update: ${error.message}`, "error");
    } else {
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, is_banned: !c.is_banned } : c))
      );
    }
    setUpdatingId(null);
  }

  async function toggleCanReview(customer: Customer) {
    setUpdatingId(customer.id);
    const { error } = await supabase
      .from("profiles")
      .update({ can_review: !customer.can_review })
      .eq("id", customer.id);
    if (error) {
      showToast(`Failed to update: ${error.message}`, "error");
    } else {
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, can_review: !c.can_review } : c))
      );
    }
    setUpdatingId(null);
  }

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (c.full_name || "").toLowerCase().includes(term) || (c.phone || "").includes(term);
  });

  return (
    <div className="p-6 font-body">
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[999] rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-xl font-bold text-ink">{customers.length} Customers</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="admin-input w-full sm:w-64"
        />
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-gray-400">Loading...</p>
      ) : customers.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-400">No customers yet. Accounts will appear here as they sign up.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-400">No customers match &quot;{search}&quot;.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((customer) => {
            const addr = customer.default_address || {};
            const hasAddress = addr.address1 || addr.city || addr.country;
            const cartCount = Array.isArray(customer.saved_cart) ? customer.saved_cart.length : 0;

            return (
              <div
                key={customer.id}
                className={`rounded-xl border bg-white p-5 ${customer.is_banned ? "border-red-200" : "border-gray-200"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ink">
                      <span className="text-sm font-bold text-white">
                        {(customer.full_name || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-ink">{customer.full_name || "Unnamed customer"}</p>
                        {customer.is_banned && (
                          <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                            Banned
                          </span>
                        )}
                        {customer.can_review === false && (
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                            Reviews disabled
                          </span>
                        )}
                      </div>
                      {customer.phone && <p className="mt-0.5 text-xs text-gray-500">{customer.phone}</p>}
                      <p className="mt-0.5 text-xs text-gray-400">
                        Joined{" "}
                        {new Date(customer.created_at).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {cartCount > 0 && (
                    <span className="flex-shrink-0 rounded bg-sky/10 px-2 py-1 text-xs font-medium text-sky">
                      {cartCount} item{cartCount !== 1 ? "s" : ""} in saved cart
                    </span>
                  )}
                </div>

                {hasAddress && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">Default address</p>
                    <p className="text-xs leading-relaxed text-gray-600">
                      {addr.address1}
                      {addr.address2 ? `, ${addr.address2}` : ""}
                      {addr.city ? `, ${addr.city}` : ""}
                      {addr.state ? `, ${addr.state}` : ""} {addr.zip || ""}
                      {addr.country ? `, ${addr.country}` : ""}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => toggleBanned(customer)}
                    disabled={updatingId === customer.id}
                    className={`rounded px-3 py-1.5 text-xs font-bold ${
                      customer.is_banned
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                  >
                    {customer.is_banned ? "Unban customer" : "Ban customer"}
                  </button>
                  <button
                    onClick={() => toggleCanReview(customer)}
                    disabled={updatingId === customer.id}
                    className={`rounded px-3 py-1.5 text-xs font-bold ${
                      customer.can_review === false
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {customer.can_review === false ? "Enable reviews" : "Disable reviews"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}