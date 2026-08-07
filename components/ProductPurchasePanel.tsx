"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/types";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ sku: product.sku, slug: product.slug, name: product.name, price: product.price, unit: product.unit }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center rounded-full border border-gray-300">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-gray-500">-</button>
          <span className="px-2 text-sm font-medium">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2.5 text-gray-500">+</button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky"
        >
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </>
  );
}
