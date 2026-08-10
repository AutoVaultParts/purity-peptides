"use client";

import { useEffect, useState, useCallback } from "react";
import { supabaseAuth as supabase } from "@/lib/supabase-browser-ssr";

type ShippingRate = {
  id: string;
  region: string;
  weight_min: number;
  weight_max: number;
  rate: number;
  delivery_days_min: number;
  delivery_days_max: number;
  is_freight: boolean;
};

const emptyForm = {
  region: "",
  weightMin: "0",
  weightMax: "9999",
  rate: "",
  deliveryDaysMin: "3",
  deliveryDaysMax: "10",
  isFreight: false,
};

export default function AdminShippingPage() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("shipping_rates")
      .select("*")
      .order("region")
      .order("weight_min");
    if (error) showToast(`Failed to load shipping rates: ${error.message}`, "error");
    setRates(data || []);
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(rate: ShippingRate) {
    setForm({
      region: rate.region,
      weightMin: String(rate.weight_min),
      weightMax: String(rate.weight_max),
      rate: String(rate.rate),
      deliveryDaysMin: String(rate.delivery_days_min),
      deliveryDaysMax: String(rate.delivery_days_max),
      isFreight: rate.is_freight,
    });
    setEditingId(rate.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this shipping rate?")) return;
    const { error } = await supabase.from("shipping_rates").delete().eq("id", id);
    if (error) {
      showToast(`Failed to delete: ${error.message}`, "error");
    } else {
      showToast("Shipping rate deleted.", "success");
      fetchRates();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.region.trim() || !form.rate) {
      showToast("Region and rate are required.", "error");
      return;
    }
    setSaving(true);

    const payload = {
      region: form.region.trim(),
      weight_min: parseFloat(form.weightMin) || 0,
      weight_max: parseFloat(form.weightMax) || 9999,
      rate: parseFloat(form.rate),
      delivery_days_min: parseInt(form.deliveryDaysMin) || 1,
      delivery_days_max: parseInt(form.deliveryDaysMax) || 1,
      is_freight: form.isFreight,
    };

    if (editingId) {
      const { error } = await supabase.from("shipping_rates").update(payload).eq("id", editingId);
      if (error) showToast(`Failed to update: ${error.message}`, "error");
      else {
        showToast("Shipping rate updated.", "success");
        resetForm();
        fetchRates();
      }
    } else {
      const { error } = await supabase.from("shipping_rates").insert(payload);
      if (error) showToast(`Failed to add rate: ${error.message}`, "error");
      else {
        showToast("Shipping rate added.", "success");
        resetForm();
        fetchRates();
      }
    }
    setSaving(false);
  }

  const groupedByRegion = rates.reduce<Record<string, ShippingRate[]>>((acc, rate) => {
    acc[rate.region] = acc[rate.region] || [];
    acc[rate.region].push(rate);
    return acc;
  }, {});

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
        <h1 className="font-heading text-xl font-bold text-ink">Shipping Rates</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-sky"
        >
          + Add Rate
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-ink">
              {editingId ? "Edit Shipping Rate" : "Add Shipping Rate"}
            </h2>
            <button onClick={resetForm} className="text-xl text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Region *
                </label>
                <input
                  value={form.region}
                  onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. US, CA, EU, AU"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Rate (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.rate}
                  onChange={(e) => setForm((p) => ({ ...p, rate: e.target.value }))}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Weight min (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.weightMin}
                  onChange={(e) => setForm((p) => ({ ...p, weightMin: e.target.value }))}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Weight max (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.weightMax}
                  onChange={(e) => setForm((p) => ({ ...p, weightMax: e.target.value }))}
                  className="admin-input"
                  placeholder="9999 = no upper limit"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Delivery days (min)
                </label>
                <input
                  type="number"
                  value={form.deliveryDaysMin}
                  onChange={(e) => setForm((p) => ({ ...p, deliveryDaysMin: e.target.value }))}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Delivery days (max)
                </label>
                <input
                  type="number"
                  value={form.deliveryDaysMax}
                  onChange={(e) => setForm((p) => ({ ...p, deliveryDaysMax: e.target.value }))}
                  className="admin-input"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.isFreight}
                onChange={(e) => setForm((p) => ({ ...p, isFreight: e.target.checked }))}
                className="h-4 w-4 accent-sky"
              />
              <span className="text-sm font-medium text-gray-600">Freight (oversized/special handling)</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold ${
                  saving ? "bg-gray-200 text-gray-400" : "bg-ink text-white hover:bg-sky"
                }`}
              >
                {saving ? "Saving..." : editingId ? "Update Rate" : "Add Rate"}
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

      {loading ? (
        <p className="py-12 text-center text-sm text-gray-400">Loading...</p>
      ) : rates.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-400">No shipping rates set up yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByRegion).map(([region, regionRates]) => (
            <div key={region} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="bg-ink px-5 py-3">
                <h3 className="text-sm font-bold text-white">{region}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {regionRates.map((rate) => (
                  <div key={rate.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                    <div>
                      <span className="text-sm font-medium text-ink">
                        {rate.weight_min}kg &ndash; {rate.weight_max >= 9999 ? "50kg+" : `${rate.weight_max}kg`}
                      </span>
                      {rate.is_freight && (
                        <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                          Freight
                        </span>
                      )}
                      <p className="text-xs text-gray-400">
                        {rate.delivery_days_min}&ndash;{rate.delivery_days_max} business days
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-sky">${rate.rate}</span>
                      <button
                        onClick={() => handleEdit(rate)}
                        className="text-xs font-medium text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(rate.id)}
                        className="text-xs font-medium text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}