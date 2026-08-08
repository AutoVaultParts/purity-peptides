"use client";

import { useCart } from "@/lib/cart-context";
import { DbProduct } from "@/lib/data";

export default function AddToCartButton({
  product,
  disabled = false,
}: {
  product: DbProduct;
  disabled?: boolean;
}) {
  const { addItem } = useCart();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        addItem({ sku: product.sku, slug: product.slug, name: product.name, price: product.price, unit: product.unit, image: product.image });
      }}
      disabled={disabled}
      aria-label={disabled ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
      className={`icon-btn group flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
        disabled
          ? "cursor-not-allowed border-gray-100 text-gray-300"
          : "border-gray-200 text-ink hover:bg-ink hover:text-white"
      }`}
    >
      <img
        src="/icon-cart.png"
        alt=""
        className={`h-3.5 w-3.5 object-contain transition ${!disabled ? "group-hover:invert group-hover:brightness-0 group-hover:filter" : "opacity-40"}`}
      />
    </button>
  );
}