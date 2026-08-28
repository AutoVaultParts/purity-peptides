import FaqAccordion from "@/components/FaqAccordion";
import SectionChainDecoration from "@/components/SectionChainDecoration";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description: "Answers to common questions about ordering, payment, shipping, and storage at Purity Peptides.",
  path: "/faq",
});

const sections = [
  {
    title: "General",
    items: [
      {
        q: "What does \"research use only\" mean?",
        a: "It means the product is sold strictly for laboratory and educational research, not for human or veterinary consumption. These products are not drugs, supplements, or foods under applicable law. Full detail is in our Medical & Research-Use Disclaimer.",
      },
      {
        q: "Do you sell products intended for human use?",
        a: "Our Skincare category is formulated and sold as cosmetic products for topical use. Everything else on the site is research use only.",
      },
      {
        q: "Is a Certificate of Analysis included?",
        a: "Where a product page shows a CoA badge, that batch ships with lot-specific purity and identity documentation from independent testing.",
      },
      {
        q: "Do I need an account to order?",
        a: "Account creation is coming soon. For now, orders are placed as a guest through checkout using the email address you provide.",
      },
    ],
  },
  {
    title: "Ordering & Payment",
    items: [
      {
        q: "Is there a minimum order?",
        a: "Yes, a $100 minimum order value applies before checkout can be completed. Your cart shows how much more you need to add if you are below that threshold.",
      },
      {
        q: "How does bulk pricing work?",
        a: "Orders of $1,000 or more automatically receive a 10% discount, and orders of $2,500 or more receive 15%, calculated on your total cart value rather than the quantity of any single item.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Credit and debit card, Apple Pay, Google Pay, PayPal, Bitcoin, and, for US customers, Venmo, CashApp, Zelle, and Chime. Every method is confirmed manually by our team rather than charged automatically.",
      },
      {
        q: "Why isn't my payment charged immediately?",
        a: "We do not run an automated payment processor. After checkout, you receive instructions specific to your chosen method, and your order ships once payment is confirmed, typically within 24 hours.",
      },
      {
        q: "Why must PayPal be sent as Friends and Family?",
        a: "This protects both you and us. Goods and Services payments on PayPal can be reversed after an order has already shipped, so Friends and Family keeps the transaction straightforward for both sides. Nothing ships until payment is confirmed in full.",
      },
    ],
  },
  {
    title: "Shipping",
    items: [
      {
        q: "Which countries do you ship to?",
        a: "The United States, Canada, Mexico, and select countries across South America, Europe, and Oceania. The exact list is shown at checkout based on your address.",
      },
      {
        q: "How long does shipping take?",
        a: "3 to 7 business days for the US and Canada, 7 to 14 for Mexico and South America, 6 to 12 for Europe, and 8 to 16 for Australia and New Zealand. Full detail is on our Shipping Policy page.",
      },
      {
        q: "Do you ship with cold-chain packaging?",
        a: "Yes, for research peptides that require it. Products ship in insulated packaging to help preserve integrity in transit.",
      },
      {
        q: "Am I responsible for customs fees?",
        a: "Yes. Import duties and taxes charged by your country are the buyer's responsibility and are not included in the checkout total.",
      },
    ],
  },
  {
    title: "Storage & Handling",
    items: [
      {
        q: "How should I store a peptide before use?",
        a: "Each product page lists specific storage guidance. Most lyophilized peptides should be kept at -20°C, protected from light, until they are ready to be used in a laboratory setting.",
      },
      {
        q: "What if my order arrives warm?",
        a: "Contact us within 7 days of delivery with your order number and photos of the packaging. We will investigate and replace the item if the cold chain was compromised in transit.",
      },
      {
        q: "Can I return an item if I simply change my mind?",
        a: "No. Because we cannot verify storage conditions once a research peptide has left our packaging, we are only able to accept returns for defective, damaged, or incorrect items. Full detail is on our Return Policy page.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div>
      <div className="relative overflow-hidden bg-ink px-6 py-14">
        <SectionChainDecoration />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="mb-2 font-display text-3xl font-medium text-white sm:text-4xl">
            Frequently Asked <span className="text-sky">Questions</span>
          </h1>
          <p className="text-sm text-gray-400">Answers to the questions we hear most often, grouped by topic.</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-4 font-heading text-lg font-semibold text-ink">{section.title}</h2>
            <FaqAccordion items={section.items} />
          </div>
        ))}

        <div className="rounded-card border border-sky-light/40 bg-sky-bg p-6 text-center">
          <p className="mb-1 font-heading text-sm font-semibold text-ink">Still have a question?</p>
          <p className="mb-4 text-sm text-gray-600">Our team responds to every message within 24 hours.</p>
          <a href="/contact" className="inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-sky">
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}
