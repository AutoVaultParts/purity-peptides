"use client";

import { useEffect, useState, useCallback } from "react";
import { supabaseAuth as supabase } from "@/lib/supabase-browser-ssr";

type Category = { id: string; name: string; slug: string };

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  unit: string;
  stock_quantity: number;
  category_id: string | null;
  description: string | null;
  published: boolean;
  featured: boolean;
  mechanism_of_action: string | null;
  research_focus: string | null;
  form: string | null;
  purity: string | null;
  molecular_formula: string | null;
  molecular_weight: string | null;
  cas_number: string | null;
  coa_status: string;
  storage_before: string | null;
  storage_after: string | null;
  image_urls: string[];
  categories?: { name: string } | null;
};

const emptyForm = {
  name: "",
  slug: "",
  sku: "",
  price: "",
  unit: "vial",
  stock_quantity: "0",
  category_id: "",
  description: "",
  published: true,
  featured: false,
  mechanism_of_action: "",
  research_focus: "",
  form: "",
  purity: "",
  molecular_formula: "",
  molecular_weight: "",
  cas_number: "",
  coa_status: "not_applicable" as "available" | "available_on_request" | "not_applicable",
  storage_before: "",
  storage_after: "",
};

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [images, setImages] = useState<{ file: File | null; url: string | null; preview: string }[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [{ data: productsData, error: pErr }, { data: categoriesData }] = await Promise.all([
      supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name, slug").order("name"),
    ]);
    if (pErr) showToast(`Failed to load products: ${pErr.message}`, "error");
    setProducts(productsData || []);
    setCategories(categoriesData || []);
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function resetForm() {
    setForm(emptyForm);
    setImages([]);
    setEditingId(null);
    setShowForm(false);
    setUploadProgress("");
  }

  function handleEdit(p: AdminProduct) {
    setForm({
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: String(p.price),
      unit: p.unit,
      stock_quantity: String(p.stock_quantity),
      category_id: p.category_id || "",
      description: p.description || "",
      published: p.published,
      featured: p.featured,
      mechanism_of_action: p.mechanism_of_action || "",
      research_focus: p.research_focus || "",
      form: p.form || "",
      purity: p.purity || "",
      molecular_formula: p.molecular_formula || "",
      molecular_weight: p.molecular_weight || "",
      cas_number: p.cas_number || "",
      coa_status: (p.coa_status as any) || "not_applicable",
      storage_before: p.storage_before || "",
      storage_after: p.storage_after || "",
    });
    setImages((p.image_urls || []).map((url) => ({ url, file: null, preview: url })));
    setEditingId(p.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      showToast(`Failed to delete: ${error.message}`, "error");
    } else {
      showToast("Product deleted.", "success");
      fetchData();
    }
  }

  async function handleTogglePublished(p: AdminProduct) {
    const { error } = await supabase
      .from("products")
      .update({ published: !p.published })
      .eq("id", p.id);
    if (error) {
      showToast(`Failed to update: ${error.message}`, "error");
    } else {
      fetchData();
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const remaining = 4 - images.length;
    if (remaining <= 0) return;
    const toAdd = files.slice(0, remaining).map((file) => ({
      file,
      url: null,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const updated = [...prev];
      if (updated[index].file) URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  }

  async function uploadImages(slug: string): Promise<string[]> {
    const finalUrls: string[] = [];
    const newFiles = images.filter((img) => img.file);
    let count = 0;
    for (const img of images) {
      if (!img.file) {
        if (img.url) finalUrls.push(img.url);
        continue;
      }
      count++;
      setUploadProgress(`Uploading image ${count} of ${newFiles.length}...`);
      const ext = img.file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${slug}-${Date.now()}-${count}.${ext}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, img.file, { upsert: false, contentType: img.file.type });
      if (error) {
        showToast(`Image upload failed: ${error.message}`, "error");
        continue;
      }
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(data.path);
      finalUrls.push(urlData.publicUrl);
    }
    setUploadProgress("");
    return finalUrls;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.slug || generateSlug(form.name);
      const imageUrls = await uploadImages(slug);

      const payload = {
        name: form.name,
        slug,
        sku: form.sku,
        price: parseFloat(form.price),
        unit: form.unit,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        category_id: form.category_id || null,
        description: form.description || null,
        published: form.published,
        featured: form.featured,
        mechanism_of_action: form.mechanism_of_action || null,
        research_focus: form.research_focus || null,
        form: form.form || null,
        purity: form.purity || null,
        molecular_formula: form.molecular_formula || null,
        molecular_weight: form.molecular_weight || null,
        cas_number: form.cas_number || null,
        coa_status: form.coa_status,
        storage_before: form.storage_before || null,
        storage_after: form.storage_after || null,
        image_urls: imageUrls,
      };

      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) {
          showToast(`Failed to update: ${error.message}`, "error");
        } else {
          showToast("Product updated.", "success");
          resetForm();
          fetchData();
        }
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) {
          showToast(`Failed to add product: ${error.message}`, "error");
        } else {
          showToast(`"${form.name}" added.`, "success");
          resetForm();
          fetchData();
        }
      }
    } catch (err: any) {
      showToast(`Unexpected error: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  }

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
        <h1 className="font-heading text-xl font-bold text-ink">{products.length} Products</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-sky"
        >
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-ink">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <button onClick={resetForm} className="text-xl text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Name" required>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value, slug: generateSlug(e.target.value) }))
                  }
                  required
                  className="admin-input"
                />
              </FormField>
              <FormField label="SKU" required>
                <input
                  value={form.sku}
                  onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                  required
                  className="admin-input"
                />
              </FormField>
              <FormField label="Price (USD)" required>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  required
                  className="admin-input"
                />
              </FormField>
              <FormField label="Unit">
                <input
                  value={form.unit}
                  onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
                  className="admin-input"
                  placeholder="vial"
                />
              </FormField>
              <FormField label="Category">
                <select
                  value={form.category_id}
                  onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
                  className="admin-input bg-white"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Stock quantity">
                <input
                  type="number"
                  value={form.stock_quantity}
                  onChange={(e) => setForm((p) => ({ ...p, stock_quantity: e.target.value }))}
                  className="admin-input"
                />
              </FormField>
              <FormField label="Form">
                <input
                  value={form.form}
                  onChange={(e) => setForm((p) => ({ ...p, form: e.target.value }))}
                  className="admin-input"
                  placeholder="Lyophilized powder"
                />
              </FormField>
              <FormField label="Purity">
                <input
                  value={form.purity}
                  onChange={(e) => setForm((p) => ({ ...p, purity: e.target.value }))}
                  className="admin-input"
                  placeholder="≥99%"
                />
              </FormField>
              <FormField label="Molecular formula">
                <input
                  value={form.molecular_formula}
                  onChange={(e) => setForm((p) => ({ ...p, molecular_formula: e.target.value }))}
                  className="admin-input"
                />
              </FormField>
              <FormField label="Molecular weight">
                <input
                  value={form.molecular_weight}
                  onChange={(e) => setForm((p) => ({ ...p, molecular_weight: e.target.value }))}
                  className="admin-input"
                />
              </FormField>
              <FormField label="CAS number">
                <input
                  value={form.cas_number}
                  onChange={(e) => setForm((p) => ({ ...p, cas_number: e.target.value }))}
                  className="admin-input"
                  placeholder="Leave blank if none"
                />
              </FormField>
              <FormField label="COA status">
                <select
                  value={form.coa_status}
                  onChange={(e) => setForm((p) => ({ ...p, coa_status: e.target.value as any }))}
                  className="admin-input bg-white"
                >
                  <option value="available">Available</option>
                  <option value="available_on_request">Available on request</option>
                  <option value="not_applicable">Not applicable</option>
                </select>
              </FormField>
            </div>

            <FormField label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="admin-input resize-none"
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Studied mechanism">
                <textarea
                  value={form.mechanism_of_action}
                  onChange={(e) => setForm((p) => ({ ...p, mechanism_of_action: e.target.value }))}
                  rows={2}
                  className="admin-input resize-none"
                />
              </FormField>
              <FormField label="Research focus">
                <textarea
                  value={form.research_focus}
                  onChange={(e) => setForm((p) => ({ ...p, research_focus: e.target.value }))}
                  rows={2}
                  className="admin-input resize-none"
                />
              </FormField>
              <FormField label="Storage before reconstitution">
                <textarea
                  value={form.storage_before}
                  onChange={(e) => setForm((p) => ({ ...p, storage_before: e.target.value }))}
                  rows={2}
                  className="admin-input resize-none"
                />
              </FormField>
              <FormField label="Storage after reconstitution">
                <textarea
                  value={form.storage_after}
                  onChange={(e) => setForm((p) => ({ ...p, storage_after: e.target.value }))}
                  rows={2}
                  className="admin-input resize-none"
                />
              </FormField>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
                  className="h-4 w-4 accent-sky"
                />
                <span className="text-sm font-medium text-gray-600">Published (visible on site)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                  className="h-4 w-4 accent-sky"
                />
                <span className="text-sm font-medium text-gray-600">Featured</span>
              </label>
            </div>

            {/* Image upload */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Product Images <span className="font-normal normal-case text-gray-400">(up to 4)</span>
              </label>
              {images.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="group relative">
                      <div
                        className={`h-24 w-24 overflow-hidden rounded-lg border-2 ${
                          i === 0 ? "border-sky" : "border-gray-200"
                        } bg-gray-50`}
                      >
                        <img src={img.preview} alt="" className="h-full w-full object-cover" />
                      </div>
                      {i === 0 && (
                        <span className="absolute -top-1.5 left-1 rounded bg-sky px-1.5 py-0.5 text-[10px] font-bold text-white">
                          MAIN
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length < 4 && (
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 hover:border-sky hover:bg-sky-bg">
                  <span className="text-sm text-gray-500">
                    {images.length === 0 ? "Click to upload images (max 4)" : `Add ${4 - images.length} more`}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              )}
              {uploadProgress && <p className="mt-2 text-sm text-sky">{uploadProgress}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold ${
                  saving ? "bg-gray-200 text-gray-400" : "bg-ink text-white hover:bg-sky"
                }`}
              >
                {saving ? uploadProgress || "Saving..." : editingId ? "Update Product" : "Add Product"}
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

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                    No products yet.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-ink">
                          {p.image_urls?.[0] && (
                            <img src={p.image_urls[0]} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-ink">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{p.categories?.name || "—"}</td>
                    <td className="px-4 py-3 text-sm font-bold text-sky">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${p.stock_quantity <= 2 ? "text-red-500" : "text-green-600"}`}>
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublished(p)}
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          p.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.published ? "Published" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-xs font-medium text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs font-medium text-red-400 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
        {label} {required && "*"}
      </span>
      {children}
    </label>
  );
}