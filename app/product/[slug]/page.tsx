import { notFound } from "next/navigation";
import Link from "next/link";
import { getProducts, getProductBySlug } from "@/lib/data";
import ProductFaqs from "@/components/ProductFaqs";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import ProductGallery from "@/components/ProductGallery";
import Reveal from "@/components/Reveal";
import ProductReviewSection from "@/components/ProductReviewSection";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <nav className="mb-8 text-xs text-gray-500">
        <Link href="/shop" className="hover:text-sky">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      {/* Header: media + purchase panel */}
      <div className="grid grid-cols-1 gap-14 md:grid-cols-2">
        <Reveal>
          <ProductGallery
            images={product.images}
            alt={product.name}
            coaAvailable={product.coaAvailable}
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-sky">{product.category.replace("-", " ")}</div>
          <h1 className="mb-3 font-display text-3xl font-medium text-ink md:text-4xl">{product.name}</h1>
          <p className="mb-1 font-mono text-xs text-gray-400">SKU {product.sku}</p>
          <div className="mb-5 flex items-center gap-3">
            <span className="font-mono text-2xl font-medium text-ink">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-500">/ {product.unit}</span>
            {product.stockQuantity > 0 ? (
              <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                In stock
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                Out of stock
              </span>
            )}
          </div>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-gray-600">{product.description}</p>

          <ProductPurchasePanel product={product} />

          <div className="rounded-xl border border-gray-200 bg-sky-bg p-4 text-xs text-gray-600">
            Bulk pricing applies automatically from 5 units. Minimum order value applies at checkout.
          </div>
        </Reveal>
      </div>

      {/* Research overview */}
      {product.researchOverview && (
        <Reveal className="mt-16">
          <h2 className="mb-5 font-heading text-xl font-semibold text-ink">Research overview</h2>
          <div className="space-y-4 rounded-card border border-gray-200 p-6">
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Studied mechanism</div>
              <p className="text-sm leading-relaxed text-gray-700">{product.researchOverview.mechanism}</p>
            </div>
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Research focus areas</div>
              <p className="text-sm leading-relaxed text-gray-700">{product.researchOverview.focus}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Summarized from published research literature for informational purposes. Not a recommendation for use,
            and not an indication that this product is approved or intended for human or veterinary use.
          </p>
        </Reveal>
      )}

      {/* Specifications */}
      <Reveal className="mt-16">
        <h2 className="mb-5 font-heading text-xl font-semibold text-ink">Specifications</h2>
        <div className="grid grid-cols-1 gap-x-10 gap-y-3 rounded-card border border-gray-200 p-6 sm:grid-cols-2">
          <SpecRow label="SKU" value={product.sku} />
          <SpecRow label="Form" value={product.form ?? ""} />
          <SpecRow label="Purity" value={product.purity ?? ""} />
          <SpecRow label="Appearance" value={product.appearance ?? "White to off-white lyophilized powder"} />
        </div>
      </Reveal>

      {/* Chemical information */}
      {product.molecularFormula && (
        <Reveal className="mt-10">
          <h2 className="mb-5 font-heading text-xl font-semibold text-ink">Chemical information</h2>
          <div className="grid grid-cols-1 gap-x-10 gap-y-3 rounded-card border border-gray-200 p-6 sm:grid-cols-2">
            <SpecRow label="Molecular formula" value={product.molecularFormula} />
            <SpecRow label="Molecular weight" value={product.molecularWeight || ""} />
            <SpecRow label="CAS number" value={product.casNumber || "None assigned"} />
            <SpecRow
              label="Safety Data Sheet"
              value={product.sdsPdfUrl ? "Available" : "Available on request"}
            />
          </div>
        </Reveal>
      )}

      {/* Storage */}
      <Reveal className="mt-10">
        <h2 className="mb-5 font-heading text-xl font-semibold text-ink">Storage</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-gray-200 p-5">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Before reconstitution</div>
            <p className="text-sm text-gray-700">{product.storageBeforeReconstitution}</p>
          </div>
          <div className="rounded-card border border-gray-200 p-5">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">After reconstitution</div>
            <p className="text-sm text-gray-700">{product.storageAfterReconstitution}</p>
          </div>
        </div>
      </Reveal>

      {/* Quality assurance */}
      <Reveal className="mt-10">
        <h2 className="mb-5 font-heading text-xl font-semibold text-ink">Quality assurance</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["Certificate of Analysis", product.coaAvailable ? "Included per batch" : "Not applicable"],
            ["Purity verification", product.qaPurityVerification ?? "Independent HPLC testing"],
            ["Identity confirmation", product.qaIdentityConfirmation ?? "LC-MS, batch matched"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-card border border-gray-200 p-5">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</div>
              <p className="text-sm text-gray-700">{value}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Product FAQ */}
      <Reveal className="mt-10">
        <h2 className="mb-5 font-heading text-xl font-semibold text-ink">Product FAQ</h2>
        <ProductFaqs faqs={product.faqs} />
      </Reveal>

      {/* Disclaimer */}
      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-gray-500">
        This product is sold for laboratory and educational research use only. It is not intended for human or
        veterinary use, and is not a drug, food, or cosmetic under applicable law unless explicitly labeled as such.
        Statements on this page have not been evaluated by any regulatory authority.
      </p>
      <ProductReviewSection productId={product.id} />
    </section>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-gray-200 py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}