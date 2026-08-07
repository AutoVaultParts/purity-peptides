import Link from "next/link";

const columns = [
  {
    heading: "Shop",
    links: [
      ["Muscle & Recovery", "/shop/muscle-recovery"],
      ["Fat Loss", "/shop/fat-loss"],
      ["Anti-Aging", "/shop/anti-aging"],
      ["Research Peptides", "/shop/research"],
      ["Skincare", "/shop/skincare"],
    ],
  },
  {
    heading: "Learn",
    links: [
      ["What Are Peptides?", "/learn/what-are-peptides"],
      ["Peptide Therapy", "/learn/peptide-therapy"],
      ["Storage Guidelines", "/learn/storage"],
      ["FAQ", "/faq"],
    ],
  },
  
  {
    heading: "Company",
    links: [
      ["About", "/about"],
      ["Contact", "/contact"],
      ["Shipping Policy", "/shipping-policy"],
      ["Return Policy", "/return-policy"],
      ["Privacy Policy", "/privacy-policy"],
      ["Terms of Service", "/terms"],
      ["Medical Disclaimer", "/medical-disclaimer"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-gray-300">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 md:grid-cols-4">
          <div>
            <img src="/logo.png" alt="Purity Peptides" className="mb-4 h-10 w-auto object-contain" />
            <p className="mb-5 max-w-xs text-sm text-gray-400">
              Research-use peptides and cosmetic formulations, backed by documentation and evidence-based education.
            </p>
            <form className="flex max-w-xs gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500"
              />
              <button className="rounded-md bg-sky px-4 py-2 text-sm font-semibold text-white">Join</button>
            </form>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">{col.heading}</h4>
              <ul className="space-y-3 text-sm">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <span className="text-xs text-gray-500">© {new Date().getFullYear()} Purity Peptides. All rights reserved.</span>
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
            <span className="mr-1 text-xs text-gray-500">We accept:</span>
            {[
              ["Visa", "/pay-visa.png"],
              ["Mastercard", "/pay-mastercard.png"],
              ["Apple Pay", "/pay-applepay.png"],
              ["Google Pay", "/pay-googlepay.png"],
              ["CashApp", "/pay-cashapp.png"],
              ["Zelle", "/pay-zelle.png"],
              ["PayPal", "/pay-paypal.png"],
              ["Venmo", "/pay-venmo.png"],
              ["Chime", "/pay-chime.png"],
            ].map(([label, src]) => (
              <div key={label} className="flex h-8 w-14 items-center justify-center rounded-md bg-white p-1">
                <img src={src} alt={label} className="h-6 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500">Research use only. Not for human consumption unless otherwise labeled.</p>
        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-gray-500">
          Purity Peptides sells research-use products and cosmetic peptide formulations. Research products are not
          intended for human consumption and are sold for laboratory and educational research only. Statements on
          this site have not been evaluated by any regulatory authority. Consult a licensed healthcare professional
          before making decisions about your health.
        </p>
      </div>
    </footer>
  );
}
