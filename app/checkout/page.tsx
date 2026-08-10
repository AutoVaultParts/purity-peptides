"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatUsd, MIN_ORDER_VALUE } from "@/lib/pricing";
import { COUNTRIES, US_STATES, PAYMENT_METHODS } from "@/lib/checkout-data";
import { createOrder, getShippingCost } from "@/lib/data";

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

const EMPTY_ADDRESS: Address = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

const STORAGE_KEY = "purity-peptides-checkout-state";

export default function CheckoutPage() {
  const { items, count, rawSubtotal, discountRate, discountAmount, total, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setStep(saved.step || 1);
        setAddress(saved.address || EMPTY_ADDRESS);
        setPaymentMethod(saved.paymentMethod || "card");
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, address, paymentMethod }));
  }, [step, address, paymentMethod, hydrated]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (!address.country || rawSubtotal === 0) return;
    getShippingCost(address.country, rawSubtotal).then(setShippingCost);
  }, [address.country, rawSubtotal]);

  function updateAddress(key: keyof Address, value: string) {
    setAddress((prev) => ({ ...prev, [key]: value }));
  }

  const isAddressValid =
    !!address.firstName &&
    !!address.lastName &&
    !!address.email &&
    !!address.address1 &&
    !!address.city &&
    !!address.country &&
    (address.country !== "US" || !!address.state) &&
    (address.country !== "US" || !!address.zip);

  const availablePaymentMethods = PAYMENT_METHODS.filter(
    (m) => m.global || (m.regions && m.regions.includes(address.country))
  );
  const activeMethod = availablePaymentMethods.find((m) => m.id === paymentMethod) || availablePaymentMethods[0];

  const belowMinimum = rawSubtotal < MIN_ORDER_VALUE;
  const grandTotal = total + shippingCost;

  async function handlePlaceOrder() {
    setLoading(true);
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 90000) + 10000;
    const orderNumber = `PP-${year}-${random}`;

    const { error } = await createOrder({
      orderNumber,
      address,
      paymentMethod,
      items: items.map((i) => ({
        sku: i.sku,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        unit: i.unit,
        image: i.image,
      })),
      rawSubtotal,
      discountRate,
      discountAmount,
      shippingAmount: shippingCost,
      total: grandTotal,
    });

    setLoading(false);

    if (error) {
      alert("Something went wrong placing your order. Please try again or contact support.");
      return;
    }

    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }

    clearCart();
    router.push(`/order/${orderNumber}`);
  }

  if (count === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="mb-3 font-display text-3xl font-medium text-ink">Your cart is empty</h1>
        <p className="mb-8 text-gray-600">Add products before proceeding to checkout.</p>
        <Link href="/shop" className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white hover:bg-sky">
          Go to shop
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center gap-2 text-xs text-gray-500">
        <span className={step >= 1 ? "font-semibold text-sky" : ""}>Shipping</span>
        <span>/</span>
        <span className={step >= 2 ? "font-semibold text-sky" : ""}>Payment</span>
        <span>/</span>
        <span className={step >= 3 ? "font-semibold text-sky" : ""}>Review</span>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="min-w-0 flex-1">
          {step === 1 && (
            <div className="rounded-card border border-gray-200">
              <div className="border-b border-gray-100 px-6 py-5">
                <h1 className="font-display text-2xl font-medium text-ink">Shipping details</h1>
                <p className="mt-1 text-sm text-gray-500">Where should we send your order.</p>
              </div>
              <div className="space-y-4 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="First name" required>
                    <input value={address.firstName} onChange={(e) => updateAddress("firstName", e.target.value)} className="input" placeholder="Jordan" />
                  </Field>
                  <Field label="Last name" required>
                    <input value={address.lastName} onChange={(e) => updateAddress("lastName", e.target.value)} className="input" placeholder="Rivera" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Email address" required>
                    <input type="email" value={address.email} onChange={(e) => updateAddress("email", e.target.value)} className="input" placeholder="jordan@example.com" />
                  </Field>
                  <Field label="Phone number">
                    <input type="tel" value={address.phone} onChange={(e) => updateAddress("phone", e.target.value)} className="input" placeholder="+1 555 000 0000" />
                  </Field>
                </div>
                <Field label="Country" required>
                  <select value={address.country} onChange={(e) => updateAddress("country", e.target.value)} className="input bg-white">
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Street address" required>
                  <input value={address.address1} onChange={(e) => updateAddress("address1", e.target.value)} className="input" placeholder="123 Main Street" />
                </Field>
                <Field label="Apartment, suite, etc. (optional)">
                  <input value={address.address2} onChange={(e) => updateAddress("address2", e.target.value)} className="input" placeholder="Apt 4B" />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="City" required>
                    <input value={address.city} onChange={(e) => updateAddress("city", e.target.value)} className="input" placeholder="Austin" />
                  </Field>
                  {address.country === "US" && (
                    <Field label="State" required>
                      <select value={address.state} onChange={(e) => updateAddress("state", e.target.value)} className="input bg-white">
                        <option value="">Select state</option>
                        {US_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  )}
                  {address.country === "US" && (
                    <Field label="ZIP code" required>
                      <input
                        value={address.zip}
                        onChange={(e) => updateAddress("zip", e.target.value.replace(/\D/g, "").slice(0, 5))}
                        className="input"
                        placeholder="73301"
                      />
                    </Field>
                  )}
                </div>
                <button
                  onClick={() => isAddressValid && setStep(2)}
                  disabled={!isAddressValid}
                  className={`w-full rounded-full py-3.5 text-sm font-semibold transition-colors ${
                    isAddressValid ? "bg-ink text-white hover:bg-sky" : "cursor-not-allowed bg-gray-200 text-gray-400"
                  }`}
                >
                  Continue to payment
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-card border border-gray-200">
              <div className="flex items-center justify-between bg-sky-bg px-6 py-4">
                <div>
                  <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-gray-500">Delivering to</p>
                  <p className="text-sm font-medium text-ink">{address.firstName} {address.lastName}, {address.city}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-xs font-medium text-sky hover:underline">Edit</button>
              </div>
              <div className="border-b border-gray-100 px-6 py-5">
                <h1 className="font-display text-2xl font-medium text-ink">Payment method</h1>
                <p className="mt-1 text-sm text-gray-500">We confirm every order manually, no card processor holds your data on this site.</p>
              </div>
              <div className="space-y-2 p-6">
                {availablePaymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                      paymentMethod === method.id ? "border-sky bg-sky-bg" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-sky"
                    />
                    {method.logo ? (
                      <img src={method.logo} alt={method.label} className="h-6 w-auto flex-shrink-0 object-contain" />
                    ) : (
                      <span className="flex h-6 items-center gap-1">
                        <img src="/pay-visa.png" alt="Visa" className="h-6 w-auto object-contain" />
                        <img src="/pay-mastercard.png" alt="Mastercard" className="h-6 w-auto object-contain" />
                      </span>
                    )}
                    <span className="text-sm font-medium text-ink">{method.label}</span>
                  </label>
                ))}

                {activeMethod && (
                  <div className={`mt-4 rounded-lg border p-4 ${activeMethod.panel.bg} ${activeMethod.panel.border}`}>
                    <p className={`mb-1 text-sm font-bold ${activeMethod.panel.heading}`}>{activeMethod.heading}</p>
                    <p className={`text-xs leading-relaxed ${activeMethod.panel.body}`}>{activeMethod.instructions}</p>
                  </div>
                )}

                <button
                  onClick={() => setStep(3)}
                  className="mt-2 w-full rounded-full bg-ink py-3.5 text-sm font-semibold text-white hover:bg-sky"
                >
                  Review order
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-card border border-gray-200">
              <div className="flex items-center justify-between bg-sky-bg px-6 py-4">
                <div>
                  <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-gray-500">Delivering to</p>
                  <p className="text-sm font-medium text-ink">{address.firstName} {address.lastName}, {address.address1}, {address.city}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-xs font-medium text-sky hover:underline">Edit</button>
              </div>
              <div className="flex items-center justify-between bg-sky-bg px-6 py-4">
                <div className="flex items-center gap-2">
                  {activeMethod?.logo ? (
                    <img src={activeMethod.logo} alt="" className="h-5 w-auto object-contain" />
                  ) : (
                    <span className="flex h-5 items-center gap-1">
                      <img src="/pay-visa.png" alt="Visa" className="h-5 w-auto object-contain" />
                      <img src="/pay-mastercard.png" alt="Mastercard" className="h-5 w-auto object-contain" />
                    </span>
                  )}
                  <div>
                    <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-gray-500">Payment</p>
                    <p className="text-sm font-medium text-ink">{activeMethod?.label}</p>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="text-xs font-medium text-sky hover:underline">Edit</button>
              </div>
              <div className="border-b border-gray-100 px-6 py-5">
                <h1 className="font-display text-2xl font-medium text-ink">Review your order</h1>
              </div>
              <div className="p-6">
                <div className="mb-6 space-y-3">
                  {items.map((item) => (
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

                <div className="mb-6 space-y-2 border-t border-gray-200 pt-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatUsd(rawSubtotal)}</span>
                  </div>
                  {discountRate > 0 && (
                    <div className="flex justify-between font-medium text-success">
                      <span>Bulk discount ({Math.round(discountRate * 100)}%)</span>
                      <span className="font-mono">-{formatUsd(discountAmount)}</span>
                    </div>
                  )}
                  {shippingCost > 0 ? (
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-mono">{formatUsd(shippingCost)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between font-medium text-success">
                      <span>Shipping</span>
                      <span className="font-mono">Free</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-ink">
                    <span>Total</span>
                    <span className="font-mono">{formatUsd(grandTotal)}</span>
                  </div>
                </div>

                <div className="mb-6 rounded-lg bg-sky-bg p-4 text-xs leading-relaxed text-gray-600">
                  By placing your order, you agree to Purity Peptides&apos; terms of service. Research products are sold
                  for laboratory and educational research use only.
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || belowMinimum}
                  className={`w-full rounded-full py-3.5 text-sm font-semibold transition-colors ${
                    loading || belowMinimum ? "cursor-not-allowed bg-gray-200 text-gray-400" : "bg-ink text-white hover:bg-sky"
                  }`}
                >
                  {loading ? "Placing order..." : `Place order, ${formatUsd(grandTotal)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 lg:flex-shrink-0">
          <div className="sticky top-24 rounded-card border border-gray-200">
            <div className="rounded-t-card bg-ink px-5 py-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white">Order summary</h2>
            </div>
            <div className="p-5">
              <div className="mb-4 space-y-3">
                {items.map((item) => (
                  <div key={item.sku} className="flex items-center gap-2 text-xs">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sky-bg">
                      {item.image ? (
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="1.5">
                          <path d="M9 2h6M10 2v6l-5.5 9.5A2 2 0 006.2 21h11.6a2 2 0 001.7-3.5L14 8V2" />
                        </svg>
                      )}
                    </div>
                    <span className="flex-1 text-gray-600">{item.name} &times; {item.quantity}</span>
                    <span className="font-mono font-medium text-ink">{formatUsd(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatUsd(rawSubtotal)}</span>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between font-medium text-success">
                    <span>Bulk discount ({Math.round(discountRate * 100)}%)</span>
                    <span className="font-mono">-{formatUsd(discountAmount)}</span>
                  </div>
                )}
                {shippingCost > 0 ? (
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-mono">{formatUsd(shippingCost)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between font-medium text-success">
                    <span>Shipping</span>
                    <span className="font-mono">Free</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-100 pt-2 font-semibold text-ink">
                  <span>Total</span>
                  <span className="font-mono text-lg">{formatUsd(grandTotal)}</span>
                </div>
              </div>
              {belowMinimum && (
                <p className="mt-3 rounded-lg border border-warn/30 bg-warn/10 p-3 text-xs text-gray-700">
                  Add {formatUsd(MIN_ORDER_VALUE - rawSubtotal)} more to reach the {formatUsd(MIN_ORDER_VALUE)} minimum order.
                </p>
              )}
              {discountRate === 0 && rawSubtotal >= MIN_ORDER_VALUE && (
                <p className="mt-3 text-xs text-gray-500">
                  Orders of $1,000 or more receive a bulk discount automatically.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
        {label} {required && "*"}
      </span>
      {children}
    </label>
  );
}
