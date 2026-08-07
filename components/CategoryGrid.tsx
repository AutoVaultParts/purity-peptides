import Link from "next/link";
import { getCategories } from "@/lib/data";
import Reveal from "./Reveal";
import CategoryPhoto from "./CategoryPhoto";

export default async function CategoryGrid() {
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mb-12 max-w-lg">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-sky">Catalog</div>
        <h2 className="mb-3 font-heading text-3xl font-semibold text-ink">Browse by research area</h2>
        <p className="text-gray-600">Every category groups peptides by what they are studied for, not just their chemistry.</p>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat, i) => (
          <Reveal key={cat.slug} delay={i * 60}>
            <Link
              href={`/shop/${cat.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-card"
            >
              <CategoryPhoto
                photos={cat.photos}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              {cat.icon && (
                <div className="absolute left-0 right-0 top-3 flex justify-start px-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
                    <img src={cat.icon} alt="" className="h-3.5 w-3.5 object-contain" />
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="mb-0.5 font-heading text-sm font-semibold leading-tight text-white">{cat.name}</h3>
                <p className="text-[11px] leading-snug text-white/75">{cat.description}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}