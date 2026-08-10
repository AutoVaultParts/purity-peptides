import Link from "next/link";
import { formatUsd } from "@/lib/pricing";
import { PAYMENT_METHODS } from "@/lib/checkout-data";
import { getOrderByNumber } from "@/lib/data";

export default async function OrderConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const order = await getOrderByNumber(params.orderNumber);

  if (!order) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="mb-3 font-display text-3xl font-medium text-ink">Order not found</h1>
        <p className="mb-8 text-gray-600">
          We could not find order {params.orderNumber}. Please check the order number or contact support.
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
        <div className="mb-4 space-y-3">
          {order.items.map((item) => (
            <div key={item.sku} className="flex items-center gap-3 text-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sky-bg">
                {item.image ? (
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="1.5">
                    <path d="M9 2h6M10 2v6l-5.5 9.5A2 2 0 006.2 21h11.6a2 2 0 001.7-3.5L14 8V2" />
                  </svg>
                )}
              </div>
              <span className="flex-1 text-gray-600">{item.name} &times; {item.quantity}</span>
              <span className="font-mono text-ink">{formatUsd(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-mono">{formatUsd(order.subtotal)}</span>
          </div>
          {order.discountRate > 0 && (
            <div className="flex justify-between font-medium text-success">
              <span>Bulk discount ({Math.round(order.discountRate * 100)}%)</span>
              <span className="font-mono">-{formatUsd(order.discountAmount)}</span>
            </div>
          )}
          {order.shippingAmount > 0 ? (
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-mono">{formatUsd(order.shippingAmount)}</span>
            </div>
          ) : (
            <div className="flex justify-between font-medium text-success">
              <span>Shipping</span>
              <span className="font-mono">Free</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-ink">
            <span>Total</span>
            <span className="font-mono">{formatUsd(order.total)}</span>
          </div>
        </div>
      </div>

      {method && (
        <div className={`mb-6 flex items-center gap-3 rounded-card border p-6 ${method.panel.bg} ${method.panel.border}`}>
          {method.logo ? (
            <img src={method.logo} alt={method.label} className="h-8 w-auto flex-shrink-0 object-contain" />
          ) : (
            <span className="flex h-8 flex-shrink-0 items-center gap-1">
              <img src="/pay-visa.png" alt="Visa" className="h-8 w-auto object-contain" />
              <img src="/pay-mastercard.png" alt="Mastercard" className="h-8 w-auto object-contain" />
            </span>
          )}
          <div>
            <h2 className={`mb-1 font-heading text-sm font-semibold ${method.panel.heading}`}>
              Next step, {method.heading.toLowerCase()}
            </h2>
            <p className={`text-sm leading-relaxed ${method.panel.body}`}>{method.instructions}</p>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/shop" className="text-sm font-medium text-sky hover:underline">Continue shopping</Link>
      </div>
    </section>
  );
}
