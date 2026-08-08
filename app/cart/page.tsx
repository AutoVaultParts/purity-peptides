"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { MIN_ORDER_VALUE, formatUsd } from "@/lib/pricing";

export default function CartPage() {
  const { items, updateQuantity, removeItem, rawSubtotal, discountRate, discountAmount, total } = useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="mb-3 font-display text-3xl font-medium text-ink">Your cart is empty</h1>
        <p className="mb-8 text-gray-600">Browse the catalog to add research peptides or skincare formulations.</p>
        <Link href="/shop" className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white hover:bg-sky">
          Go to shop
        </Link>
      </section>
    );
  }

  const belowMinimum = rawSubtotal < MIN_ORDER_VALUE;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-8 font-display text-3xl font-medium text-ink">Your cart</h1>

      <div className="divide-y divide-gray-200 border-y border-gray-200">
        {items.map((item) => (
          <div key={item.sku} className="flex items-center gap-4 py-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sky-bg">
              {item.image ? (
               <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="1.5">
                  <path d="M9 2h6M10 2v6l-5.5 9.5A2 2 0 006.2 21h11.6a2 2 0 001.7-3.5L14 8V2" />
                </svg>
                )}
            </div>
            <div className="flex-1">
              <Link href={`/product/${item.slug}`} className="font-heading text-sm font-semibold text-ink hover:text-sky">
                {item.name}
              </Link>
              <p className="mt-1 font-mono text-xs text-gray-500">${item.price.toFixed(2)} / {item.unit}</p>
            </div>
            <div className="flex items-center rounded-full border border-gray-300">
              <button onClick={() => updateQuantity(item.sku, item.quantity - 1)} className="px-3 py-2 text-gray-500">-</button>
              <span className="px-2 text-sm font-medium">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.sku, item.quantity + 1)} className="px-3 py-2 text-gray-500">+</button>
            </div>
            <span className="w-20 text-right font-mono text-sm font-medium text-ink">
              {formatUsd(item.price * item.quantity)}
            </span>
            <button onClick={() => removeItem(item.sku)} aria-label={`Remove ${item.name}`} className="text-gray-400 hover:opacity-70">
              <img src="/icon-remove.png" alt="" className="h-4 w-4 object-contain" />
            </button>
          </div>
        ))}
      </div>

      {discountRate === 0 && !belowMinimum && (
        <p className="mt-4 text-xs text-gray-500">
          Orders of $1,000 or more receive a bulk discount automatically. Add {formatUsd(1000 - rawSubtotal)} more to
          qualify.
        </p>
      )}

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="w-full max-w-xs space-y-2 sm:w-64">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-mono font-medium text-ink">{formatUsd(rawSubtotal)}</span>
          </div>
          {discountRate > 0 && (
            <div className="flex justify-between text-sm text-success">
              <span>Bulk discount ({Math.round(discountRate * 100)}%)</span>
              <span className="font-mono font-medium">-{formatUsd(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-semibold text-ink">
            <span>Total</span>
            <span className="font-mono">{formatUsd(total)}</span>
          </div>
        </div>

        {belowMinimum ? (
          <div className="w-full max-w-xs rounded-lg border border-warn/30 bg-warn/10 p-3 text-xs text-gray-700 sm:w-64">
            Add {formatUsd(MIN_ORDER_VALUE - rawSubtotal)} more to reach the {formatUsd(MIN_ORDER_VALUE)} minimum order.
          </div>
        ) : discountRate > 0 ? (
          <p className="max-w-xs text-right text-xs font-medium text-success sm:w-64">
            This order qualifies for bulk pricing.
          </p>
        ) : null}

        {belowMinimum ? (
          <span className="w-full max-w-xs cursor-not-allowed rounded-full bg-gray-200 px-6 py-3.5 text-center text-sm font-semibold text-gray-400 sm:w-64">
            Proceed to checkout
          </span>
        ) : (
          <Link
            href="/checkout"
            className="w-full max-w-xs rounded-full bg-ink px-6 py-3.5 text-center text-sm font-semibold text-white hover:bg-sky sm:w-64"
          >
            Proceed to checkout
          </Link>
        )}
      </div>
    </section>
  );
}