export const MIN_ORDER_VALUE = 100;

// Bulk pricing is based on total cart value, not per-item quantity. A $39
// item bought five times is not a bulk order, a $1000+ order is.
const BULK_TIERS = [
  { threshold: 2500, rate: 0.15 },
  { threshold: 1000, rate: 0.1 },
];

export function bulkDiscountRate(rawSubtotal: number): number {
  const tier = BULK_TIERS.find((t) => rawSubtotal >= t.threshold);
  return tier ? tier.rate : 0;
}

export type CartTotals = {
  rawSubtotal: number;
  discountRate: number;
  discountAmount: number;
  total: number;
};

export function computeCartTotals(items: { price: number; quantity: number }[]): CartTotals {
  const rawSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountRate = bulkDiscountRate(rawSubtotal);
  const discountAmount = rawSubtotal * discountRate;
  const total = rawSubtotal - discountAmount;
  return { rawSubtotal, discountRate, discountAmount, total };
}

export function formatUsd(value: number): string {
  return `$${value.toFixed(2)}`;
}