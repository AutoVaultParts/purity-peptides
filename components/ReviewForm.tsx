"use client";

import { useState } from "react";
import { submitReview } from "@/lib/data";
import ReviewToast from "./ReviewToast";

export default function ReviewForm({
  type,
  productId,
}: {
  type: "site" | "product";
  productId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) {
      setError("Please add your name and a short review before submitting.");
      return;
    }
    setSubmitting(true);
    setError("");

    const { error: submitError } = await submitReview({
      type,
      productId: productId ?? null,
      customerName: name.trim(),
      customerEmail: email.trim() || undefined,
      rating,
      title: title.trim() || undefined,
      body: body.trim(),
    });

    setSubmitting(false);

    if (submitError) {
      setError("Something went wrong submitting your review. Please try again.");
      return;
    }

    setName("");
    setEmail("");
    setRating(5);
    setTitle("");
    setBody("");
    setOpen(false);
    setShowToast(true);
  }

  return (
    <>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white hover:bg-sky"
        >
          Write a Review
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-xl space-y-4 rounded-card border border-gray-200 bg-white p-6 text-left">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Jordan R." />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">Email (optional)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="jordan@example.com" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  className="p-0.5"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={star <= rating ? "#F5A623" : "none"} stroke="#F5A623" strokeWidth="1.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">Title (optional)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Sum up your experience" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">Your review *</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="input resize-none" placeholder="Tell us about your experience..." />
          </div>

          {error && (
            <div className="rounded-lg border border-error/30 bg-error/10 p-3">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 rounded-full py-3 text-sm font-semibold transition-colors ${
                submitting ? "cursor-not-allowed bg-gray-200 text-gray-400" : "bg-ink text-white hover:bg-sky"
              }`}
            >
              {submitting ? "Submitting..." : "Submit review"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError("");
              }}
              className="rounded-full border border-gray-200 px-6 py-3 text-sm text-gray-600 hover:border-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ReviewToast show={showToast} onDone={() => setShowToast(false)} />
    </>
  );
}