"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { DbProduct } from "@/lib/data";

export default function ProductPurchasePanel({ product }: { product: DbProduct }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stockQuantity <= 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem({ sku: product.sku, slug: product.slug, name: product.name, price: product.price, unit: product.unit }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center rounded-full border border-gray-300">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={outOfStock}
            className="px-4 py-2.5 text-gray-500 disabled:opacity-40"
          >
            -
          </button>
          <span className="px-2 text-sm font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            disabled={outOfStock}
            className="px-4 py-2.5 text-gray-500 disabled:opacity-40"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className={`flex-1 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
            outOfStock
              ? "cursor-not-allowed bg-gray-200 text-gray-400"
              : "bg-ink text-white hover:bg-sky"
          }`}
        >
          {outOfStock ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </>
  );
}