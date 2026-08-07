"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-gray-200 rounded-card border border-gray-200 bg-white">
      {items.map((item, i) => (
        <div key={item.q} className="px-5">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-4 text-left"
          >
            <span className="pr-4 font-heading text-sm font-semibold text-ink">{item.q}</span>
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 text-xs text-gray-500">
              {open === i ? "\u2212" : "+"}
            </span>
          </button>
          {open === i && <p className="pb-4 text-sm leading-relaxed text-gray-600">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}