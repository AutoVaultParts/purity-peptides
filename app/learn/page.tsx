import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionChainDecoration from "@/components/SectionChainDecoration";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Learn About Peptides",
  description: "Evidence-based education on what peptides are, how they are categorized, storage guidance, and safety information.",
  path: "/learn",
});

const topics = [
  {
    title: "What Are Peptides?",
    body: "Peptides are short chains of amino acids, the same building blocks that make up proteins, but smaller. In research contexts, peptides are studied for how they signal specific biological processes, from tissue repair to metabolic regulation. Not all peptides behave the same way, and their classification depends on structure, length, and the biological pathway they interact with.",
  },
  {
    title: "Research Peptides vs. Approved Medications",
    body: "Some peptide-based compounds, like insulin and certain GLP-1 medications, are approved drugs prescribed by licensed physicians. Research peptides are a different category entirely: they are sold for laboratory and educational research only, have not been approved for human use, and are not evaluated for safety or efficacy outside a controlled research setting. Confusing the two categories is one of the most common and most important mistakes to avoid.",
  },
  {
    title: "Growth Hormone Secretagogues",
    body: "This category includes compounds like CJC-1295 and Ipamorelin, studied for their role in stimulating the body's natural growth hormone release pathway. Research in this area focuses on recovery, body composition, and aging-related processes.",
  },
  {
    title: "Healing and Recovery Peptides",
    body: "Compounds such as BPC-157 and TB-500 are studied for their potential role in tissue repair and recovery processes. Research in this space is still developing, and findings from laboratory studies do not necessarily translate to human outcomes.",
  },
  {
    title: "Cosmetic Peptides",
    body: "Copper peptides like GHK-Cu and signal peptides like Matrixyl are used differently, they are formulated into topical cosmetic products and sold for skin-care use, not injected or ingested. This is why our Skincare category is treated separately from our research peptide catalog throughout this site.",
  },
  {
    title: "Storage Fundamentals",
    body: "Most lyophilized (freeze-dried) research peptides should be stored at -20°C and protected from light before use, then refrigerated at 2-8°C once reconstituted, typically for no longer than 14 days. Each product page on this site lists the specific storage guidance for that item, since requirements can vary by compound.",
  },
  {
    title: "Why Documentation Matters",
    body: "A Certificate of Analysis (CoA) confirms that a specific batch was tested by an independent lab for purity and identity. Because the research peptide market has seen real cases of mislabeled or contaminated products, we only list items where the supplier provides batch-specific documentation, and we say so clearly on the product page.",
  },
];

export default function LearnPage() {
  return (
    <div>
      <div className="relative overflow-hidden bg-ink px-6 py-16">
        <SectionChainDecoration />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="mb-4 font-display text-3xl font-medium text-white sm:text-4xl">
            Learn About <span className="text-sky">Peptides</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-400">
            Evidence-based information to help you understand what you are looking at before you buy, written in
            plain language and grounded in how these compounds are actually categorized and studied.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-14 space-y-10">
        {topics.map((topic, i) => (
          <Reveal key={topic.title} delay={i * 50}>
            <div className="border-b border-gray-200 pb-10 last:border-0">
              <h2 className="mb-3 font-heading text-xl font-semibold text-ink">{topic.title}</h2>
              <p className="text-sm leading-relaxed text-gray-600">{topic.body}</p>
            </div>
          </Reveal>
        ))}

        <Reveal className="rounded-card border border-sky-light/40 bg-sky-bg p-6 text-center">
          <p className="mb-1 font-heading text-sm font-semibold text-ink">Have a specific question?</p>
          <p className="mb-4 text-sm text-gray-600">Check our FAQ, or reach out directly and we&apos;ll respond within 24 hours.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/faq" className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-sky hover:text-sky">
              Visit FAQ
            </Link>
            <Link href="/contact" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-sky">
              Contact us
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
