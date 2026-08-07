import Link from "next/link";
import { getProducts, getCategories } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal className="mb-10 max-w-lg">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-sky">Catalog</div>
        <h1 className="mb-3 font-display text-4xl font-medium text-ink">Shop all peptides</h1>
        <p className="text-gray-600">Every listing includes intended use, storage guidance, and batch documentation.</p>
      </Reveal>

      <Reveal className="mb-10 flex flex-wrap gap-2">
        <span className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">All</span>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop/${cat.slug}`}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-sky hover:text-sky"
          >
            {cat.name}
          </Link>
        ))}
      </Reveal>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.sku} delay={i * 60}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}