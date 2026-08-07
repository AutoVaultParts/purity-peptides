import { getOneProductPerCategory } from "@/lib/data";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default async function ProductGrid() {
  const products = await getOneProductPerCategory();

  return (
    <section className="bg-sky-bg py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-12 max-w-lg">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-sky">Featured</div>
          <h2 className="mb-3 font-heading text-3xl font-semibold text-ink">Popular this month</h2>
          <p className="text-gray-600">Bulk pricing applies automatically at checkout from 5 units.</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
          {products.map((product, i) => (
            <Reveal key={product.sku} delay={i * 80}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}