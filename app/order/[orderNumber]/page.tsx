"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatUsd } from "@/lib/pricing";
import { PAYMENT_METHODS } from "@/lib/checkout-data";

type StoredOrder = {
  orderNumber: string;
  createdAt: string;
  address: { firstName: string; lastName: string; email: string; city: string; country: string };
  paymentMethod: string;
  items: { sku: string; name: string; price: number; quantity: number; unit: string }[];
  rawSubtotal: number;
  discountRate: number;
  discountAmount: number;
  total: number;
};

export default function OrderConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const [order, setOrder] = useState<StoredOrder | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`purity-peptides-order-${params.orderNumber}`);
      setOrder(raw ? JSON.parse(raw) : null);
    } catch {
      setOrder(null);
    }
  }, [params.orderNumber]);

  if (order === undefined) return null;

  if (order === null) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="mb-3 font-display text-3xl font-medium text-ink">Order not found</h1>
        <p className="mb-8 text-gray-600">
          We could not find order {params.orderNumber} in this browser. This is expected once real order storage
          (Supabase) replaces this temporary local version.
        </p>
        <Link href="/shop" className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white hover:bg-sky">
          Back to shop
        </Link>
      </section>
    );
  }

  const method = PAYMENT_METHODS.find((m) => m.id === order.paymentMethod);

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <img src="/icon-success.png" alt="" className="h-6 w-6 object-contain" />
        </div>
        <h1 className="mb-2 font-display text-3xl font-medium text-ink">Order received</h1>
        <p className="text-gray-600">
          Order <span className="font-mono font-medium text-ink">{order.orderNumber}</span> is confirmed and pending
          payment.
        </p>
      </div>

      <div className="mb-6 rounded-card border border-gray-200 p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-ink">Order summary</h2>
        <div className="mb-4 space-y-2">
          {order.items.map((item) => (
            <div key={item.sku} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.name} &times; {item.quantity}</span>
              <span className="font-mono text-ink">{formatUsd(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-mono">{formatUsd(order.rawSubtotal)}</span>
          </div>
          {order.discountRate > 0 && (
            <div className="flex justify-between font-medium text-success">
              <span>Bulk discount ({Math.round(order.discountRate * 100)}%)</span>
              <span className="font-mono">-{formatUsd(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-ink">
            <span>Total</span>
            <span className="font-mono">{formatUsd(order.total)}</span>
          </div>
        </div>
      </div>

      {method && (
        <div className={`rounded-card border p-6 ${method.panel.bg} ${method.panel.border}`}>
          <h2 className={`mb-2 font-heading text-sm font-semibold ${method.panel.heading}`}>
            Next step, {method.heading.toLowerCase()}
          </h2>
          <p className={`text-sm leading-relaxed ${method.panel.body}`}>{method.instructions}</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/shop" className="text-sm font-medium text-sky hover:underline">Continue shopping</Link>
      </div>
    </section>
  );
}