export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "what-are-peptides-beginners-guide",
    title: "What Are Peptides? A Beginner's Guide",
    excerpt: "Amino acids, peptides, and proteins are related but not the same thing. Here is how to tell them apart.",
    category: "Fundamentals",
    readTime: "5 min read",
    body: [
      "Amino acids are the basic building blocks of biology. When a small number of them link together in a chain, the result is called a peptide. When that chain grows much longer and folds into a complex three-dimensional shape, it is generally classified as a protein instead.",
      "This distinction matters because a peptide's short length changes how it behaves. Shorter chains can move through the body differently than large proteins, and many peptides act as signaling molecules, essentially messages that tell cells to start or stop a specific process, rather than structural material.",
      "In a research context, this signaling role is what makes peptides interesting to study. Different peptides are associated with different signaling pathways, which is why they are grouped into categories like growth hormone secretagogues, healing peptides, or cosmetic peptides, rather than treated as one uniform class of compound.",
      "It's worth repeating what we say throughout this site: research peptides are sold for laboratory and educational research only. Nothing in this article is a recommendation for personal use.",
    ],
  },
  {
    slug: "research-peptides-vs-steroids",
    title: "Research Peptides vs. Steroids: What's the Difference?",
    excerpt: "These two categories get lumped together constantly, but they work through entirely different mechanisms.",
    category: "Education",
    readTime: "6 min read",
    body: [
      "Anabolic steroids are synthetic derivatives of testosterone. They work by binding directly to androgen receptors throughout the body, which is why their effects and their well-documented risks are so broad and systemic.",
      "Peptides studied in research settings generally work upstream of that process. Growth hormone secretagogues, for example, are studied for their role in stimulating the body's own growth hormone release, rather than introducing an external hormone analog directly.",
      "The legal status of the two categories also differs significantly by jurisdiction and by specific compound. Anabolic steroids are controlled substances in many countries. Research peptides occupy a different, often less clearly defined regulatory space, which is exactly why the research-use-only framing matters, and why product labeling and documentation are so important.",
      "Neither category should be considered interchangeable with the other, and neither should be treated as something to self-administer. This article is educational, not a recommendation.",
    ],
  },
  {
    slug: "how-to-store-research-peptides",
    title: "How to Store Research Peptides Correctly",
    excerpt: "Most degradation happens from mistakes in storage, not from the product itself. Here is what the research says.",
    category: "Storage",
    readTime: "4 min read",
    body: [
      "Lyophilized (freeze-dried) peptides are generally more stable than reconstituted ones. Before reconstitution, most should be kept at -20°C and protected from light, conditions that are printed on every product page for exactly this reason.",
      "Once a peptide is reconstituted with bacteriostatic or sterile water, the clock changes. Most reconstituted peptides should be refrigerated at 2-8°C and used within roughly 14 days, since bacterial growth and molecular degradation both accelerate at room temperature.",
      "Light exposure is an underrated cause of degradation. Amber vials and storage away from direct light are standard practice for a reason: UV exposure can break down peptide bonds over time even at correct temperatures.",
      "If a product ever arrives visibly warm, cloudy, or discolored compared to its listing photo, do not assume it's fine. Contact us within 7 days with photos so we can investigate whether the cold chain was compromised in transit.",
    ],
  },
  {
    slug: "how-to-read-a-certificate-of-analysis",
    title: "How to Read a Certificate of Analysis",
    excerpt: "A CoA is only useful if you know what you're looking at. Here is a plain-language walkthrough.",
    category: "Quality",
    readTime: "5 min read",
    body: [
      "A Certificate of Analysis (CoA) is a lab document tied to a specific production batch, not to a product line in general. That distinction matters: a CoA for one batch does not guarantee the same result for a different batch of the same compound.",
      "Most CoAs report purity as a percentage, typically measured by HPLC (high-performance liquid chromatography). Look for a specific number, not a vague claim; legitimate CoAs report exact figures like 98.6%, not just 'high purity.'",
      "Identity confirmation is usually done separately, often through mass spectrometry, to confirm the substance is actually the compound it claims to be, not just that whatever is in the vial is pure.",
      "A real CoA will reference a batch or lot number that should match the packaging of the product you received. If it doesn't match, or if a seller can't produce one at all, treat that as a serious red flag rather than a minor detail.",
    ],
  },
];