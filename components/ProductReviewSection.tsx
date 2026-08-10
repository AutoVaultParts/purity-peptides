import { getProductReviews } from "@/lib/data";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

export default async function ProductReviewSection({ productId }: { productId: string }) {
  const reviews = await getProductReviews(productId);

  return (
    <section className="mt-16 rounded-card border border-gray-200 bg-sky-bg px-6 py-12 text-center">
      <h2 className="mb-3 font-heading text-xl font-semibold text-ink">Share Your Experience With This Listing</h2>
      <p className="mx-auto mb-8 max-w-lg text-sm text-gray-600">
        Found this product page helpful? Let us know what you thought of the information, documentation, and
        details provided here.
      </p>

      {reviews.length > 0 && (
        <div className="mb-8">
          <ReviewList reviews={reviews} />
        </div>
      )}

      <ReviewForm type="product" productId={productId} />
    </section>
  );
}