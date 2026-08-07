import Link from "next/link";
import { DbProduct } from "@/lib/data";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: DbProduct }) {
  const outOfStock = product.stockQuantity <= 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-card border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-sky-bg to-white">
        {product.coaAvailable && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white">
            COA verified
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-gray-500 px-2.5 py-1 text-[10px] font-semibold text-white">
            Out of stock
          </span>
        )}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="1.5">
            <path d="M9 2h6M10 2v6l-5.5 9.5A2 2 0 006.2 21h11.6a2 2 0 001.7-3.5L14 8V2" />
          </svg>
        )}
      </div>
      <div className="p-4">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-sky">{product.category}</div>
        <h3 className="mb-2 font-heading text-sm font-semibold text-ink">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm">
            ${product.price.toFixed(2)} <span className="text-xs text-gray-500">/ {product.unit}</span>
          </span>
          <AddToCartButton product={product} disabled={outOfStock} />
        </div>
      </div>
    </Link>
  );
}