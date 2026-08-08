"use client";

import { useEffect, useState, useCallback } from "react";
import { supabaseAuth as supabase } from "@/lib/supabase-browser-ssr";

type AdminCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  photos: string[];
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  icon: "",
};

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [photos, setPhotos] = useState<{ file: File | null; url: string | null; preview: string }[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) showToast(`Failed to load categories: ${error.message}`, "error");
    setCategories(data || []);
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function resetForm() {
    setForm(emptyForm);
    setPhotos([]);
    setEditingId(null);
    setShowForm(false);
    setUploadProgress("");
  }

  function handleEdit(c: AdminCategory) {
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      icon: c.icon || "",
    });
    setPhotos((c.photos || []).map((url) => ({ url, file: null, preview: url })));
    setEditingId(c.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this category? Products in it will become uncategorized.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      showToast(`Failed to delete: ${error.message}`, "error");
    } else {
      showToast("Category deleted.", "success");
      fetchCategories();
    }
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const remaining = 4 - photos.length;
    if (remaining <= 0) return;
    const toAdd = files.slice(0, remaining).map((file) => ({
      file,
      url: null,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const updated = [...prev];
      if (updated[index].file) URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  }

  async function uploadPhotos(slug: string): Promise<string[]> {
    const finalUrls: string[] = [];
    const newFiles = photos.filter((p) => p.file);
    let count = 0;
    for (const photo of photos) {
      if (!photo.file) {
        if (photo.url) finalUrls.push(photo.url);
        continue;
      }
      count++;
      setUploadProgress(`Uploading photo ${count} of ${newFiles.length}...`);
      const ext = photo.file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `category-${slug}-${Date.now()}-${count}.${ext}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, photo.file, { upsert: false, contentType: photo.file.type });
      if (error) {
        showToast(`Photo upload failed: ${error.message}`, "error");
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
      const photoUrls = await uploadPhotos(slug);

      const payload = {
        name: form.name,
        slug,
        description: form.description || null,
        icon: form.icon || null,
        photos: photoUrls,
      };

      if (editingId) {
        const { error } = await supabase.from("categories").update(payload).eq("id", editingId);
        if (error) {
          showToast(`Failed to update: ${error.message}`, "error");
        } else {
          showToast("Category updated.", "success");
          resetForm();
          fetchCategories();
        }
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error) {
          showToast(`Failed to add category: ${error.message}`, "error");
        } else {
          showToast(`"${form.name}" added.`, "success");
          resetForm();
          fetchCategories();
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
        <h1 className="font-heading text-xl font-bold text-ink">{categories.length} Categories</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-sky"
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-ink">
              {editingId ? "Edit Category" : "Add New Category"}
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
              <FormField label="Slug">
                <input
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  className="admin-input"
                  placeholder="auto-generated from name"
                />
              </FormField>
              <FormField label="Icon URL">
                <input
                  value={form.icon}
                  onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                  className="admin-input"
                  placeholder="/category-icon.png"
                />
              </FormField>
            </div>

            <FormField label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className="admin-input resize-none"
              />
            </FormField>

            {/* Photo upload */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Category Photos <span className="font-normal normal-case text-gray-400">(up to 4, used for the crossfade animation)</span>
              </label>
              {photos.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-3">
                  {photos.map((photo, i) => (
                    <div key={i} className="group relative">
                      <div className="h-24 w-24 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                        <img src={photo.preview} alt="" className="h-full w-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {photos.length < 4 && (
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 hover:border-sky hover:bg-sky-bg">
                  <span className="text-sm text-gray-500">
                    {photos.length === 0 ? "Click to upload photos (max 4)" : `Add ${4 - photos.length} more`}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handlePhotoSelect}
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
                {saving ? uploadProgress || "Saving..." : editingId ? "Update Category" : "Add Category"}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-sm text-gray-400">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="col-span-full text-center text-sm text-gray-400">No categories yet.</p>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-3">
                {c.icon && <img src={c.icon} alt="" className="h-8 w-8 object-contain" />}
                <div>
                  <p className="text-sm font-bold text-ink">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.slug}</p>
                </div>
              </div>
              {c.description && <p className="mb-3 text-xs text-gray-500">{c.description}</p>}
              <p className="mb-3 text-xs text-gray-400">{c.photos?.length || 0} photo(s)</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="text-xs font-medium text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-xs font-medium text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
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