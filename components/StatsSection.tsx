import Counter from "./Counter";
import Reveal from "./Reveal";

const stats = [
  { target: 12400, label: "Batches verified to date" },
  { target: 98, suffix: "%", label: "Customer satisfaction" },
  { target: 15, label: "Countries served" },
  { target: 24, suffix: "hr", label: "Average dispatch time" },
];

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-14 max-w-xl">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-sky-light">By the numbers</div>
          <h2 className="font-heading text-3xl font-semibold text-white">
            Verification isn&apos;t a slogan here, it&apos;s a process we track.
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <Counter target={s.target} suffix={s.suffix} />
              <div className="mt-2 text-sm text-gray-400">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
