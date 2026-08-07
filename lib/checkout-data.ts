export type Country = { code: string; name: string };

export const COUNTRIES: Country[] = [
  // North America
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },

  // South America
  { code: "AR", name: "Argentina" },
  { code: "BR", name: "Brazil" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "UY", name: "Uruguay" },

  // Europe
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "DE", name: "Germany" },
  { code: "DK", name: "Denmark" },
  { code: "ES", name: "Spain" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "IE", name: "Ireland" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "PT", name: "Portugal" },
  { code: "SE", name: "Sweden" },

  // Oceania
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
];

export const US_STATES: string[] = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

export type PaymentPanel = {
  bg: string;
  border: string;
  heading: string;
  body: string;
};

export type PaymentMethod = {
  id: string;
  label: string;
  logo: string | null;
  global: boolean;
  regions?: string[];
  heading: string;
  instructions: string;
  panel: PaymentPanel;
};

// Region gating reflects real-world availability: CashApp, Venmo, Zelle, and
// Chime are US-only financial products, not just a business choice. Card,
// Google Pay, Apple Pay, and PayPal are treated as globally available here.
// Panel classes are literal Tailwind strings (not built dynamically) so the
// JIT compiler can detect them; each method gets its own color to match
// its brand, the same pattern used on the AutoVaultParts checkout.
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "card",
    label: "Credit or Debit Card",
    logo: null,
    global: true,
    heading: "How card payment works at Purity Peptides",
    instructions:
      "Place your order and our support team will contact you within 24 hours with secure payment instructions. Your order will be processed once payment is confirmed.",
    panel: { bg: "bg-blue-50", border: "border-blue-200", heading: "text-blue-800", body: "text-blue-700" },
  },
  {
    id: "apple_pay",
    label: "Apple Pay",
    logo: "/pay-applepay.png",
    global: true,
    heading: "How Apple Pay works at Purity Peptides",
    instructions:
      "Place your order and our team will contact you within 24 hours with an Apple Pay payment link. Your order is processed once payment is confirmed.",
    panel: { bg: "bg-gray-50", border: "border-gray-200", heading: "text-gray-800", body: "text-gray-700" },
  },
  {
    id: "google_pay",
    label: "Google Pay",
    logo: "/pay-googlepay.png",
    global: true,
    heading: "How Google Pay works at Purity Peptides",
    instructions:
      "Place your order and our team will contact you within 24 hours with a Google Pay payment link. Your order is processed once payment is confirmed.",
    panel: { bg: "bg-gray-50", border: "border-gray-200", heading: "text-gray-800", body: "text-gray-700" },
  },
  {
    id: "paypal",
    label: "PayPal",
    logo: "/pay-paypal.png",
    global: true,
    heading: "How PayPal works at Purity Peptides",
    instructions:
      "Place your order and our team will send a PayPal payment request within 24 hours. Important, payment must be sent via Friends and Family only. This protects both you and our business. Nothing ships until payment is confirmed and verified in full.",
    panel: { bg: "bg-blue-50", border: "border-blue-200", heading: "text-blue-800", body: "text-blue-700" },
  },
  {
    id: "venmo",
    label: "Venmo",
    logo: "/pay-venmo.png",
    global: false,
    regions: ["US"],
    heading: "How Venmo works at Purity Peptides",
    instructions:
      "Place your order and our team will contact you within 24 hours with our Venmo handle. Your order is processed once payment is confirmed.",
    panel: { bg: "bg-indigo-50", border: "border-indigo-200", heading: "text-indigo-800", body: "text-indigo-700" },
  },
  {
    id: "cashapp",
    label: "Cash App",
    logo: "/pay-cashapp.png",
    global: false,
    regions: ["US"],
    heading: "How Cash App works at Purity Peptides",
    instructions:
      "Place your order and our team will contact you within 24 hours with our Cashtag. Your order is processed once payment is confirmed.",
    panel: { bg: "bg-green-50", border: "border-green-200", heading: "text-green-800", body: "text-green-700" },
  },
  {
    id: "zelle",
    label: "Zelle",
    logo: "/pay-zelle.png",
    global: false,
    regions: ["US"],
    heading: "How Zelle works at Purity Peptides",
    instructions:
      "Place your order and our team will contact you within 24 hours with our Zelle details. Your order is processed once payment is confirmed by our team.",
    panel: { bg: "bg-purple-50", border: "border-purple-200", heading: "text-purple-800", body: "text-purple-700" },
  },
  {
    id: "chime",
    label: "Chime",
    logo: "/pay-chime.png",
    global: false,
    regions: ["US"],
    heading: "How Chime works at Purity Peptides",
    instructions:
      "Place your order and our team will contact you within 24 hours with our Chime payment details. Your order is processed once payment is confirmed.",
    panel: { bg: "bg-emerald-50", border: "border-emerald-200", heading: "text-emerald-800", body: "text-emerald-700" },
  },
];