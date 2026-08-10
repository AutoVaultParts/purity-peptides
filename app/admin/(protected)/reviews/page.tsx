"use client";

import { useEffect, useState, useCallback } from "react";
import { supabaseAuth as supabase } from "@/lib/supabase-browser-ssr";

type AdminReview = {
  id: string;
  product_id: string | null;
  customer_name: string;
  customer_email: string | null;
  rating: number;
  title: string | null;
  body: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  reviewer_country: string | null;
  is_featured: boolean;
  is_verified_purchase: boolean;
  is_admin_created: boolean;
  type: "site" | "product";
  products?: { name: string } | null;
};

type Product = { id: string; name: string };
type Filter = "pending" | "approved" | "rejected" | "all";

const emptyForm = {
  type: "site" as "site" | "product",
  productId: "",
  customerName: "",
  customerEmail: "",
  rating: 5,
  title: "",
  body: "",
  isFeatured: false,
  isVerifiedPurchase: false,
  createdAt: new Date().toISOString().slice(0, 16),
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserEmail(data.user?.email ?? null);
    });
    supabase
      .from("products")
      .select("id, name")
      .order("name")
      .then(({ data }) => setProducts(data || []));
  }, []);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("reviews")
      .select("*, products(name)")
      .order("created_at", { ascending: false });
    if (filter !== "all") {
      query = query.eq("status", filter);
    }
    const { data, error } = await query;
    if (error) showToast(`Failed to load reviews: ${error.message}`, "error");
    setReviews(data || []);
    setLoading(false);
  }, [filter, showToast]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    const { error } = await supabase
      .from("reviews")
      .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: currentUserEmail })
      .eq("id", id);
    if (error) {
      showToast(`Failed to update: ${error.message}`, "error");
    } else {
      showToast(status === "approved" ? "Review approved." : "Review rejected.", "success");
      fetchReviews();
    }
  }

  async function toggleFeatured(review: AdminReview) {
    const { error } = await supabase.from("reviews").update({ is_featured: !review.is_featured }).eq("id", review.id);
    if (error) showToast(`Failed to update: ${error.message}`, "error");
    else fetchReviews();
  }

  async function toggleVerified(review: AdminReview) {
    const { error } = await supabase
      .from("reviews")
      .update({ is_verified_purchase: !review.is_verified_purchase })
      .eq("id", review.id);
    if (error) showToast(`Failed to update: ${error.message}`, "error");
    else fetchReviews();
  }

  async function deleteReview(id: string) {
    if (!window.confirm("Delete this review permanently?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) showToast(`Failed to delete: ${error.message}`, "error");
    else {
      showToast("Review deleted.", "success");
      fetchReviews();
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(review: AdminReview) {
  setForm({
    type: review.type,
    productId: review.product_id || "",
    customerName: review.customer_name,
    customerEmail: review.customer_email || "",
    rating: review.rating,
    title: review.title || "",
    body: review.body,
    isFeatured: review.is_featured,
    isVerifiedPurchase: review.is_verified_purchase,
    createdAt: new Date(review.created_at).toISOString().slice(0, 16),
  });
  setEditingId(review.id);
  setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName.trim() || !form.body.trim()) {
      showToast("Name and review body are required.", "error");
      return;
    }
    setSaving(true);

    const payload = {
      type: form.type,
      product_id: form.type === "product" ? form.productId || null : null,
      customer_name: form.customerName.trim(),
      customer_email: form.customerEmail.trim() || null,
      rating: form.rating,
      title: form.title.trim() || null,
      body: form.body.trim(),
      is_featured: form.isFeatured,
      is_verified_purchase: form.isVerifiedPurchase,
      created_at: new Date(form.createdAt).toISOString(),
    };

    if (editingId) {
      const { error } = await supabase.from("reviews").update(payload).eq("id", editingId);
      if (error) showToast(`Failed to update: ${error.message}`, "error");
      else {
        showToast("Review updated.", "success");
        resetForm();
        fetchReviews();
      }
    } else {
      const { error } = await supabase.from("reviews").insert({
        ...payload,
        status: "approved",
        is_admin_created: true,
        reviewed_at: new Date().toISOString(),
        reviewed_by: currentUserEmail,
      });
      if (error) showToast(`Failed to create review: ${error.message}`, "error");
      else {
        showToast("Review created and published.", "success");
        resetForm();
        fetchReviews();
      }
    }
    setSaving(false);
  }

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="p-6 font-body">
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[999] rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-ink">Reviews</h1>
          {pendingCount > 0 && filter !== "pending" && (
            <p className="mt-0.5 text-xs font-medium text-yellow-600">
              {pendingCount} review{pendingCount !== 1 ? "s" : ""} pending approval
            </p>
          )}
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-sky"
        >
          + Create Review
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-ink">
              {editingId ? "Edit Review" : "Create Review"}
            </h2>
            <button onClick={resetForm} className="text-xl text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Review type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as "site" | "product" }))}
                  className="admin-input bg-white"
                >
                  <option value="site">Site-wide</option>
                  <option value="product">Product-specific</option>
                </select>
              </div>
              {form.type === "product" && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                    Product
                  </label>
                  <select
                    value={form.productId}
                    onChange={(e) => setForm((p) => ({ ...p, productId: e.target.value }))}
                    className="admin-input bg-white"
                  >
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Customer name *
                </label>
                <input
                  value={form.customerName}
                  onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Customer email
                </label>
                <input
                  value={form.customerEmail}
                  onChange={(e) => setForm((p) => ({ ...p, customerEmail: e.target.value }))}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Rating
                </label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm((p) => ({ ...p, rating: parseInt(e.target.value) }))}
                  className="admin-input bg-white"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} star{r > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="admin-input"
                />
              </div>

              <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                     Review date and time
                  </label>
                 <input
                    type="datetime-local"
                    value={form.createdAt}
                    onChange={(e) => setForm((p) => ({ ...p, createdAt: e.target.value }))}
                    className="admin-input"
                  />
                </div>
            </div>

            <p className="-mt-2 text-xs text-gray-400">
                Set a past date to make the review appear older.
            </p>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Review body *
              </label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                rows={4}
                className="admin-input resize-none"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                  className="h-4 w-4 accent-sky"
                />
                <span className="text-sm font-medium text-gray-600">Featured</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isVerifiedPurchase}
                  onChange={(e) => setForm((p) => ({ ...p, isVerifiedPurchase: e.target.checked }))}
                  className="h-4 w-4 accent-sky"
                />
                <span className="text-sm font-medium text-gray-600">Verified purchase badge</span>
              </label>
            </div>

            {!editingId && (
              <p className="text-xs text-gray-400">
                Reviews created here are published immediately, skipping the pending queue.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold ${
                  saving ? "bg-gray-200 text-gray-400" : "bg-ink text-white hover:bg-sky"
                }`}
              >
                {saving ? "Saving..." : editingId ? "Update Review" : "Create & Publish"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-200 px-6 py-3 text-sm text-gray-600 hover:border-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
              filter === f ? "bg-ink text-white" : "border border-gray-200 bg-white text-gray-600 hover:border-sky hover:text-sky"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-gray-400">Loading...</p>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-400">No {filter === "all" ? "" : filter} reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`rounded-xl border bg-white p-5 ${
                review.status === "pending"
                  ? "border-yellow-300"
                  : review.status === "approved"
                  ? "border-gray-200"
                  : "border-red-200 opacity-75"
              }`}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink">
                  <span className="text-xs font-bold text-white">
                    {review.customer_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-bold text-ink">{review.customer_name}</span>
                <StarDisplay rating={review.rating} />
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${
                    review.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : review.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {review.status}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    review.type === "site" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {review.type === "site" ? "Site review" : "Product review"}
                </span>
                {review.products?.name && (
                  <span className="text-xs text-gray-400">on {review.products.name}</span>
                )}
                {review.is_admin_created && (
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                    Admin created
                  </span>
                )}
                {review.is_featured && (
                  <span className="rounded bg-sky/10 px-2 py-0.5 text-xs font-medium text-sky">Featured</span>
                )}
                {review.is_verified_purchase && (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Verified
                  </span>
                )}
              </div>

              {review.title && <p className="mb-1 text-sm font-bold text-ink">{review.title}</p>}
              <p className="mb-2 text-sm leading-relaxed text-gray-600">{review.body}</p>
              <p className="text-xs text-gray-400">
                {new Date(review.created_at).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {review.customer_email && ` · ${review.customer_email}`}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                {review.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(review.id, "approved")}
                      className="rounded bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(review.id, "rejected")}
                      className="rounded bg-red-400 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-500"
                    >
                      Reject
                    </button>
                  </>
                )}
                {review.status === "rejected" && (
                  <button
                    onClick={() => updateStatus(review.id, "approved")}
                    className="rounded bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600"
                  >
                    Approve
                  </button>
                )}
                {review.status === "approved" && (
                  <button
                    onClick={() => updateStatus(review.id, "rejected")}
                    className="rounded bg-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-300"
                  >
                    Unapprove
                  </button>
                )}
                <button
                  onClick={() => toggleFeatured(review)}
                  className={`rounded px-3 py-1.5 text-xs font-bold ${
                    review.is_featured ? "bg-sky text-white hover:bg-sky-light" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {review.is_featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => toggleVerified(review)}
                  className={`rounded px-3 py-1.5 text-xs font-bold ${
                    review.is_verified_purchase
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {review.is_verified_purchase ? "Remove verified" : "Mark verified"}
                </button>
                <button
                  onClick={() => handleEdit(review)}
                  className="rounded bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="rounded bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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