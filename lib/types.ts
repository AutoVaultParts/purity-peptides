export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Product = {
  sku: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  form: string;
  purity: string;
  molecularFormula?: string;
  molecularWeight?: string;
  casNumber?: string;
  storageBeforeReconstitution: string;
  storageAfterReconstitution: string;
  description: string;
  coaAvailable: boolean;
  faqs: { q: string; a: string }[];
  researchOverview?: {
    mechanism: string;
    focus: string;
  };
};