import { getSiteReviews } from "@/lib/data";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

export default async function ShareExperienceSection() {
  const reviews = await getSiteReviews(6);

  return (
    <section className="bg-sky-bg px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-sky">Feedback</div>
        <h2 className="mb-4 font-heading text-3xl font-semibold text-ink">Share Your Experience</h2>
        <p className="mx-auto mb-10 max-w-2xl text-gray-600">
          How has your experience been with Purity Peptides? We&apos;d like to hear your thoughts on our catalog,
          documentation, ordering process, and overall site experience. Your feedback helps us serve the research community better.
        </p>

        {reviews.length > 0 && (
          <div className="mb-10">
            <ReviewList reviews={reviews} />
          </div>
        )}

        <ReviewForm type="site" />
      </div>
    </section>
  );
}