import Reveal from "./Reveal";

const steps = [
  { title: "Supplier screening", body: "We work only with manufacturers who provide a certificate of analysis for every production run before we agree to list a product." },
  { title: "Independent batch testing", body: "A sample from incoming stock is sent to a third-party lab to confirm purity and identity match the listed compound." },
  { title: "Cold-chain storage", body: "Verified stock is held at controlled temperature until it ships, with insulated packaging for transit." },
  { title: "Documented dispatch", body: "Your order ships with a copy of the relevant COA and a tracking number within 24 hours of confirmation." },
];

export default function ProcessSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mb-12 max-w-lg">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-sky">Verification</div>
        <h2 className="mb-3 font-heading text-3xl font-semibold text-ink">How each batch gets checked</h2>
        <p className="text-gray-600">Four steps stand between a supplier and your order confirmation.</p>
      </Reveal>
      <div>
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 80}>
            <div className="grid grid-cols-[60px_1fr] gap-6 border-t border-gray-200 py-7 last:border-b">
              <div className="pt-1 font-mono text-sm text-sky">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-ink">{step.title}</h3>
                <p className="max-w-xl text-gray-600">{step.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
