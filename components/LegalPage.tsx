import Link from "next/link";

export function LegalPage({
  title,
  accent,
  updated,
  children,
  crossLinks,
}: {
  title: string;
  accent: string;
  updated: string;
  children: React.ReactNode;
  crossLinks?: { label: string; href: string }[];
}) {
  return (
    <div className="min-h-screen bg-sky-bg">
      <div className="bg-ink px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 font-display text-3xl font-medium text-white sm:text-4xl">
            {title} <span className="text-sky">{accent}</span>
          </h1>
          <p className="text-sm text-gray-400">Last updated {updated}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="space-y-8 rounded-card border border-gray-200 bg-white p-6 sm:p-8">{children}</div>

        {crossLinks && crossLinks.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-5">
            {crossLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-sky hover:underline">
                {link.label} &rarr;
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function LegalSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-3 font-heading text-lg font-semibold text-ink">
        {number}. {title}
      </h2>
      {children}
    </div>
  );
}

export function LegalText({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm leading-relaxed text-gray-600">{children}</p>;
}

const DOT_COLORS: Record<string, string> = {
  sky: "bg-sky",
  success: "bg-success",
  warn: "bg-warn",
  error: "bg-error",
};

export function LegalList({
  items,
  dot = "sky",
}: {
  items: string[];
  dot?: "sky" | "success" | "warn" | "error";
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${DOT_COLORS[dot]}`} />
          <span className="text-sm text-gray-600">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalSteps({
  steps,
}: {
  steps: { step: string; title: string; desc: string }[];
}) {
  return (
    <div className="space-y-3">
      {steps.map((item) => (
        <div key={item.step} className="flex items-start gap-4 rounded-lg bg-sky-bg p-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky text-xs font-bold text-white">
            {item.step}
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-ink">{item.title}</p>
            <p className="text-xs leading-relaxed text-gray-500">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LegalContactBox({ children }: { children: React.ReactNode }) {
  return <div className="mt-3 rounded-lg bg-gray-50 p-4">{children}</div>;
}