"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      setLoading(false);
    }, 600);
  }

  return (
    <div>
      <div className="bg-ink px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 font-display text-3xl font-medium text-white sm:text-4xl">
            Contact <span className="text-sky">Us</span>
          </h1>
          <p className="text-sm text-gray-400">Questions about a product, an order, or research use? We respond within 24 hours.</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="rounded-card border border-gray-200 p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Get in touch</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Email</p>
                  <a
                    href="mailto:puritypeptidessupport@gmail.com"
                    className="mt-0.5 block text-sm font-medium text-ink hover:text-sky hover:underline"
                  >
                    puritypeptidessupport@gmail.com
                  </a>
                </div>
                <InfoRow label="Response time" value="Within 24 hours" />
                <InfoRow label="Shipping" value="12+ countries served" />
              </div>
            </div>

            <div className="rounded-card border border-gray-200 p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Common reasons to contact us
              </h3>
              <ul className="space-y-2">
                {[
                  "Product not listed on the website",
                  "Certificate of Analysis requests",
                  "Bulk order inquiries",
                  "Order status questions",
                  "Payment confirmation help",
                  "Research-use questions",
                ].map((reason) => (
                  <li key={reason} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky" />
                    <span className="text-sm text-gray-600">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-card border border-gray-200">
              <div className="bg-ink px-6 py-4">
                <h2 className="text-sm font-semibold text-white">Send us a message</h2>
                <p className="mt-1 text-xs text-gray-400">We respond to every message within 24 hours</p>
              </div>
              <div className="p-6">
                {success ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                      <img src="/icon-success.png" alt="" className="h-7 w-7 object-contain" />
                    </div>
                    <h3 className="mb-2 font-heading text-lg font-semibold text-ink">Message sent</h3>
                    <p className="mb-6 text-sm text-gray-500">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-sky"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Full name" required>
                        <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="input" placeholder="Jordan Rivera" />
                      </Field>
                      <Field label="Email address" required>
                        <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="input" placeholder="jordan@example.com" />
                      </Field>
                    </div>
                    <Field label="Phone number (optional)">
                      <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className="input" placeholder="+1 555 000 0000" />
                    </Field>
                    <Field label="Message" required>
                      <textarea
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        rows={5}
                        className="input resize-none"
                        placeholder="Tell us what you need, including any relevant order number..."
                      />
                    </Field>

                    {error && (
                      <div className="rounded-lg border border-error/30 bg-error/10 p-3">
                        <p className="text-sm text-error">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full rounded-full py-3.5 text-sm font-semibold transition-colors ${
                        loading ? "cursor-not-allowed bg-gray-200 text-gray-400" : "bg-ink text-white hover:bg-sky"
                      }`}
                    >
                      {loading ? "Sending..." : "Send message"}
                    </button>
                    <p className="text-center text-xs text-gray-400">
                      Your information is kept private and never shared with third parties. See our{" "}
                      <Link href="/privacy-policy" className="text-sky hover:underline">Privacy Policy</Link>.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
        {label} {required && "*"}
      </span>
      {children}
    </label>
  );
}