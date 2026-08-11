import Link from "next/link";
import { searchProducts } from "@/lib/data";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q?.trim() || "";
  const results = query ? await searchProducts(query, 50) : [];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-sky">Search</div>
        <h1 className="mb-2 font-display text-3xl font-medium text-ink">
          {query ? `Results for "${query}"` : "Search our catalog"}
        </h1>
        {query && (
          <p className="text-sm text-gray-500">
            {results.length} product{results.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {!query ? (
        <p className="text-sm text-gray-500">Use the search icon in the navigation bar to find a product.</p>
      ) : results.length === 0 ? (
        <div className="rounded-card border border-gray-200 p-8 text-center">
          <p className="mb-4 text-sm text-gray-500">
            No products matched &quot;{query}&quot;. Try a different search term, or browse the full catalog.
          </p>
          <Link href="/shop" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-sky">
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group block overflow-hidden rounded-card border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-sky-bg to-white">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="1.5">
                    <path d="M9 2h6M10 2v6l-5.5 9.5A2 2 0 006.2 21h11.6a2 2 0 001.7-3.5L14 8V2" />
                  </svg>
                )}
              </div>
              <div className="p-4">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-sky">{product.category}</div>
                <h3 className="mb-2 font-heading text-sm font-semibold text-ink">{product.name}</h3>
                <span className="font-mono text-sm">
                  ${product.price.toFixed(2)} <span className="text-xs text-gray-500">/ {product.unit}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
