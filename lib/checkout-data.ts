export type Country = { code: string; name: string };

export const COUNTRIES: Country[] = [
  // North America
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },

  // Caribbean & Central America
  { code: "DO", name: "Dominican Republic" },
  { code: "CR", name: "Costa Rica" },
  { code: "PA", name: "Panama" },
  { code: "JM", name: "Jamaica" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "BS", name: "Bahamas" },
  { code: "GT", name: "Guatemala" },

  // South America
  { code: "AR", name: "Argentina" },
  { code: "BR", name: "Brazil" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "EC", name: "Ecuador" },
  { code: "PE", name: "Peru" },
  { code: "PY", name: "Paraguay" },
  { code: "UY", name: "Uruguay" },
  { code: "BO", name: "Bolivia" },

  // Europe
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DE", name: "Germany" },
  { code: "DK", name: "Denmark" },
  { code: "ES", name: "Spain" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IE", name: "Ireland" },
  { code: "IS", name: "Iceland" },
  { code: "IT", name: "Italy" },
  { code: "LU", name: "Luxembourg" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "SE", name: "Sweden" },

  // Middle East
  { code: "AE", name: "United Arab Emirates" },
  { code: "IL", name: "Israel" },
  { code: "SA", name: "Saudi Arabia" },

  // Asia
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },

  // Oceania
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
];

// Maps a checkout country code to one of the shipping_rates regions.
// Anything not explicitly listed falls back to "INTL", the flat
// rest-of-world rate — this mirrors how most research-peptide vendors
// price shipping in practice (a handful of named regions plus one
// catch-all international rate, rather than a rate per country).
const EU_COUNTRY_CODES = new Set([
  "AT", "BE", "CH", "CZ", "DE", "DK", "ES", "FI", "FR", "GB", "GR",
  "HU", "IE", "IS", "IT", "LU", "NL", "NO", "PL", "PT", "RO", "SE",
]);

export function getShippingRegion(countryCode: string): "US" | "CA" | "EU" | "AU" | "INTL" {
  if (countryCode === "US") return "US";
  if (countryCode === "CA") return "CA";
  if (countryCode === "AU" || countryCode === "NZ") return "AU";
  if (EU_COUNTRY_CODES.has(countryCode)) return "EU";
  return "INTL";
}

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