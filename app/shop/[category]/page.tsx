import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getProductsByCategorySlug } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await getCategoryBySlug(params.category);
  if (!category) return notFound();

  const [items, categories] = await Promise.all([
    getProductsByCategorySlug(category.slug),
    getCategories(),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal className="mb-10 max-w-lg">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-sky">Catalog</div>
        <h1 className="mb-3 font-display text-4xl font-medium text-ink">{category.name}</h1>
        <p className="text-gray-600">{category.description}</p>
      </Reveal>

      <Reveal className="mb-10 flex flex-wrap gap-2">
        <Link href="/shop" className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-sky hover:text-sky">
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop/${cat.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              cat.slug === category.slug
                ? "bg-ink text-white"
                : "border border-gray-300 text-gray-600 hover:border-sky hover:text-sky"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </Reveal>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No products in this category yet, check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {items.map((product, i) => (
            <Reveal key={product.sku} delay={i * 60}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}