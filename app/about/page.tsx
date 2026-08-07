import Link from "next/link";
import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";
import { getCategories } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description: "Purity Peptides is a research-grade peptide and education platform built on verification, transparency, and quality.",
  path: "/about",
});

const whyUs = [
  {
    title: "Verified Suppliers",
    desc: "We work only with manufacturers who provide a certificate of analysis for every production run before we agree to list a product.",
    icon: "/about-verified.png",
  },
  {
    title: "Independent Batch Testing",
    desc: "A sample from incoming stock is sent to a third-party lab to confirm purity and identity match the listed compound.",
    icon: "/about-testing.png",
  },
  {
    title: "Cold-Chain Shipping",
    desc: "Temperature-sensitive products are held at controlled conditions and shipped in insulated packaging to preserve integrity.",
    icon: "/trust-coldchain.png",
  },
  {
    title: "Global Shipping",
    desc: "We ship to the United States, Canada, Mexico, and select countries across South America, Europe, and Oceania.",
    icon: "/trust-shipping.png",
  },
  {
    title: "Secure Payment Confirmation",
    desc: "Every order is confirmed manually by our team. No card processor holds your payment data on this site.",
    icon: "/about-payment.png",
  },
  {
    title: "Responsive Support",
    desc: "Questions about a product, an order, or research use are answered by our team within 24 hours.",
    icon: "/about-support.png",
  },
];

export default async function AboutPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="bg-ink px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 font-display text-3xl font-medium text-white sm:text-4xl">
            About <span className="text-sky">Purity Peptides</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-400">
            A research-grade peptide and cosmetic formulation platform built on verification, transparency, and
            evidence-based education, not just another online store.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="mb-4 font-heading text-2xl font-semibold text-ink">Our Mission</h2>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Purity Peptides was built for researchers, wellness-focused adults, and anyone who wants clear,
              evidence-based information before they buy. We source research peptides and cosmetic peptide
              formulations from suppliers who provide batch-specific documentation, and we publish that
              documentation instead of asking you to take our word for it.
            </p>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              We believe buying a research peptide should not be a guessing game. Every listing includes intended
              use, storage guidance, purity, and chemical identity information, so you know exactly what you are
              looking at before you order.
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              From growth hormone secretagogues studied for recovery to copper peptides studied in skin research, we
              stock products across categories that are difficult to source with real documentation, and ship them
              with the same standard every time.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-card bg-ink p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <Counter target={12400} />
                  <p className="mt-1 text-xs text-gray-400">Batches verified</p>
                </div>
                <div className="text-center">
                  <Counter target={98} suffix="%" />
                  <p className="mt-1 text-xs text-gray-400">Customer satisfaction</p>
                </div>
                <div className="text-center">
                  <Counter target={15} />
                  <p className="mt-1 text-xs text-gray-400">Countries served</p>
                </div>
                <div className="text-center">
                  <Counter target={24} suffix="hr" />
                  <p className="mt-1 text-xs text-gray-400">Average dispatch</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mb-20">
          <Reveal className="mb-10 text-center">
            <h2 className="font-heading text-2xl font-semibold text-ink">Why Purity Peptides</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="rounded-card border border-gray-200 p-6 transition-colors hover:border-sky">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-bg">
                      <img src={item.icon} alt="" className="h-[18px] w-[18px] object-contain" />
                  </div>
                  <h3 className="mb-2 font-heading text-sm font-semibold text-ink">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <Reveal className="mb-10 text-center">
            <h2 className="font-heading text-2xl font-semibold text-ink">What We Carry</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {categories.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 60}>
                <Link
                  href={`/shop/${cat.slug}`}
                  className="block rounded-card border border-gray-200 p-5 text-center transition-colors hover:border-sky hover:shadow-md"
                >
                  <h3 className="mb-1 font-heading text-sm font-semibold text-ink">{cat.name}</h3>
                  <p className="text-xs text-gray-400">{cat.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="text-center">
          <h2 className="mb-3 font-heading text-2xl font-semibold text-ink">Ready to Browse the Catalog?</h2>
          <p className="mx-auto mb-8 max-w-lg text-sm text-gray-500">
            Every product page includes specifications, storage guidance, and batch documentation before you buy.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/shop" className="rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white hover:bg-sky">
              Browse Catalog
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-gray-300 px-8 py-3.5 text-sm font-semibold text-ink hover:border-sky hover:text-sky"
            >
              Contact Us
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}