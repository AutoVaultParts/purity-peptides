"use client";

import { useEffect, useState, useCallback } from "react";
import { supabaseAuth as supabase } from "@/lib/supabase-browser-ssr";

type OrderItem = { sku: string; name: string; price: number; quantity: number; unit: string };

type Address = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type AdminOrder = {
  id: string;
  order_number: string;
  email: string;
  address: Address;
  payment_method: string;
  status: string;
  subtotal: number;
  discount_rate: number;
  discount_amount: number;
  total: number;
  created_at: string;
  order_items: OrderItem[];
};

const STATUS_OPTIONS = ["pending_payment", "paid", "processing", "shipped", "completed", "cancelled", "refunded"];

const STATUS_COLORS: Record<string, string> = {
  pending_payment: "bg-yellow-100 text-yellow-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (error) showToast(`Failed to load orders: ${error.message}`, "error");
    setOrders(data || []);
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      showToast(`Failed to update status: ${error.message}`, "error");
    } else {
      showToast("Order status updated.", "success");
      fetchOrders();
    }
  }

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

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold text-ink">{orders.length} Orders</h1>
        <button onClick={fetchOrders} className="text-sm font-medium text-sky hover:underline">
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-gray-400">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-400">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = expandedId === order.id;
            return (
              <div key={order.id} className={`overflow-hidden rounded-xl border bg-white ${isOpen ? "border-sky" : "border-gray-200"}`}>
                <div
                  className="cursor-pointer p-4 hover:bg-gray-50"
                  onClick={() => setExpandedId(isOpen ? null : order.id)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-bold text-ink">{order.order_number}</span>
                      <span className={`rounded px-2 py-1 text-xs font-medium capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {order.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-sky">${order.total.toFixed(2)}</span>
                      <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span>{order.address.firstName} {order.address.lastName}</span>
                    <span>{order.email}</span>
                    <span className="capitalize">{order.payment_method.replace("_", " ")}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Customer details
                        </h4>
                        <div className="space-y-1 text-xs">
                          <p><span className="text-gray-500">Name: </span><span className="font-medium text-ink">{order.address.firstName} {order.address.lastName}</span></p>
                          <p><span className="text-gray-500">Email: </span><span className="font-medium text-ink">{order.address.email}</span></p>
                          <p><span className="text-gray-500">Phone: </span><span className="font-medium text-ink">{order.address.phone || "N/A"}</span></p>
                          <p>
                            <span className="text-gray-500">Address: </span>
                            <span className="font-medium text-ink">
                              {order.address.address1}{order.address.address2 ? `, ${order.address.address2}` : ""}, {order.address.city}
                              {order.address.state ? `, ${order.address.state}` : ""} {order.address.zip}, {order.address.country}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Items</h4>
                        <div className="space-y-1">
                          {order.order_items.map((item) => (
                            <div key={item.sku} className="flex justify-between text-xs">
                              <span className="text-ink">{item.name} &times; {item.quantity}</span>
                              <span className="font-mono text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 space-y-1 border-t border-gray-200 pt-2 text-xs">
                          <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          {order.discount_rate > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount ({Math.round(order.discount_rate * 100)}%)</span>
                              <span>-${order.discount_amount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-ink">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Update status
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(order.id, status)}
                            className={`rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                              order.status === status
                                ? "bg-ink text-white"
                                : "border border-gray-200 bg-white text-gray-600 hover:border-sky hover:text-sky"
                            }`}
                          >
                            {status.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}