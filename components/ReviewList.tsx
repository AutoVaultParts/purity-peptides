import type { PublicReview } from "@/lib/data";

export default function ReviewList({ reviews }: { reviews: PublicReview[] }) {
  if (reviews.length === 0) {
    return <p className="text-center text-sm text-gray-400">No reviews yet, be the first to share your experience.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-card border border-gray-200 bg-white p-5 text-left">
          <div className="mb-2 flex items-center gap-2">
            <StarDisplay rating={review.rating} />
            {review.isVerifiedPurchase && (
              <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                Verified
              </span>
            )}
          </div>
          {review.title && <p className="mb-1 text-sm font-bold text-ink">{review.title}</p>}
          <p className="mb-3 text-sm leading-relaxed text-gray-600">{review.body}</p>
          <p className="text-xs font-medium text-gray-400">
            {review.customerName} ·{" "}
            {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </p>
        </div>
      ))}
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#F5A623" : "none"}
          stroke="#F5A623"
          strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}