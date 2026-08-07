"use client";

import { useState } from "react";

type Method = {
  id: string;
  label: string;
  sub: string;
  title: string;
  note: string;
  fields: [string, string][];
};

// Replace placeholder handles/accounts with the client's real payment details before launch.
const methods: Method[] = [
  {
    id: "cashapp",
    label: "CashApp",
    sub: "Fast confirmation",
    title: "CashApp payment details",
    note: "Send the exact total to the $Cashtag below, then upload a screenshot on the confirmation page. Orders are typically confirmed within a few hours.",
    fields: [["Cashtag", "$PurityPeptides"], ["Amount", "As shown at checkout"], ["Note", "Your order number"]],
  },
  {
    id: "venmo",
    label: "Venmo",
    sub: "Fast confirmation",
    title: "Venmo payment details",
    note: "Send the exact total to the handle below, then upload a screenshot on the confirmation page.",
    fields: [["Handle", "@PurityPeptides"], ["Amount", "As shown at checkout"], ["Note", "Your order number"]],
  },
  {
    id: "zelle",
    label: "Zelle",
    sub: "2-4 hour confirmation",
    title: "Zelle payment details",
    note: "Send to the registered email below, then submit your confirmation number on the confirmation page.",
    fields: [["Registered email", "payments@puritypeptides.com"], ["Amount", "As shown at checkout"], ["Note", "Your order number"]],
  },
  {
    id: "chime",
    label: "Chime",
    sub: "2-4 hour confirmation",
    title: "Chime payment details",
    note: "Send to the $ChimeSign below, then upload a screenshot on the confirmation page.",
    fields: [["$ChimeSign", "$PurityPeptides"], ["Amount", "As shown at checkout"], ["Note", "Your order number"]],
  },
  {
    id: "paypal",
    label: "PayPal",
    sub: "Fast confirmation",
    title: "PayPal payment details",
    note: "Use the PayPal.me link below and select Friends & Family, then upload your receipt on the confirmation page.",
    fields: [["PayPal.me", "paypal.me/puritypeptides"], ["Amount", "As shown at checkout"], ["Note", "Your order number"]],
  },
  {
    id: "card",
    label: "Visa / Mastercard",
    sub: "Manual verification",
    title: "Card payment",
    note: "You'll be asked for card details on the next step. Card orders are manually verified before dispatch, which may take longer than other methods.",
    fields: [["Accepted", "Visa, Mastercard"], ["Amount", "As shown at checkout"], ["Note", "Your order number"]],
  },
  {
    id: "googleapple",
    label: "Google Pay / Apple Pay",
    sub: "Where supported",
    title: "Google Pay / Apple Pay",
    note: "Scan the QR code or use the payment link shown at checkout, then upload confirmation on the confirmation page.",
    fields: [["Link", "Provided at checkout"], ["Amount", "As shown at checkout"], ["Note", "Your order number"]],
  },
];

export default function PaymentMethodSelector() {
  const [active, setActive] = useState(methods[0].id);
  const current = methods.find((m) => m.id === active)!;

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 md:grid-cols-[0.9fr_1.1fr]">
      <div className="border-b border-gray-200 p-8 md:border-b-0 md:border-r">
        <h3 className="mb-5 font-heading text-base font-semibold text-ink">Payment method</h3>
        <div className="space-y-2.5">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                active === m.id ? "border-sky bg-sky-bg" : "border-gray-200 hover:border-sky"
              }`}
            >
              <span
                className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                  active === m.id ? "border-sky" : "border-gray-300"
                }`}
              >
                {active === m.id && <span className="h-2.5 w-2.5 rounded-full bg-sky" />}
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">{m.label}</span>
                <span className="block text-xs text-gray-500">{m.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-sky-bg p-8">
        <h4 className="mb-4 font-heading text-sm font-semibold text-ink">{current.title}</h4>
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5">
          {current.fields.map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-dashed border-gray-200 py-2 text-sm last:border-0">
              <span className="text-gray-500">{label}</span>
              <span className="font-mono font-medium text-ink">{value}</span>
            </div>
          ))}
        </div>
        <p className="rounded-lg border border-sky-light/40 bg-white/70 p-4 text-xs leading-relaxed text-gray-700">
          {current.note}
        </p>
      </div>
    </div>
  );
}
