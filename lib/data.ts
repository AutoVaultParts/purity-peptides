import { supabase } from "./supabase-browser";

export type DbProduct = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stockQuantity: number;
  form: string | null;
  purity: string | null;
  appearance: string | null;
  molecularFormula: string | null;
  molecularWeight: string | null;
  casNumber: string | null;
  storageBeforeReconstitution: string | null;
  storageAfterReconstitution: string | null;
  description: string | null;
  coaAvailable: boolean;
  coaStatus: "available" | "available_on_request" | "not_applicable";
  coaPdfUrl: string | null;
  sdsPdfUrl: string | null;
  qaPurityVerification: string | null;
  qaIdentityConfirmation: string | null;
  image: string | null; // convenience: first image, used by ProductCard/grids
  images: string[]; // full gallery, used by the product detail page
  faqs: { q: string; a: string }[];
  researchOverview: { mechanism: string; focus: string } | null;
};

export type DbCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  photos: string[];
};

const PRODUCT_SELECT = "*, categories(slug)";

function mapProduct(row: any): DbProduct {
  const images: string[] = row.image_urls ?? [];
  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    name: row.name,
    category: row.categories?.slug ?? "",
    price: Number(row.price),
    unit: row.unit,
    stockQuantity: row.stock_quantity,
    form: row.form,
    purity: row.purity,
    appearance: row.appearance,
    molecularFormula: row.molecular_formula,
    molecularWeight: row.molecular_weight,
    casNumber: row.cas_number,
    storageBeforeReconstitution: row.storage_before,
    storageAfterReconstitution: row.storage_after,
    description: row.description,
    coaAvailable: row.coa_status === "available",
    coaStatus: row.coa_status,
    coaPdfUrl: row.coa_pdf_url,
    sdsPdfUrl: row.sds_pdf_url,
    qaPurityVerification: row.qa_purity_verification,
    qaIdentityConfirmation: row.qa_identity_confirmation,
    image: images[0] ?? null,
    images,
    faqs: row.faqs ?? [],
    researchOverview:
      row.mechanism_of_action || row.research_focus
        ? { mechanism: row.mechanism_of_action ?? "", focus: row.research_focus ?? "" }
        : null,
  };
}

function mapCategory(row: any): DbCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon,
    photos: row.photos ?? [],
  };
}

export async function getCategories(): Promise<DbCategory[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) {
    console.error("getCategories failed:", error.message);
    return [];
  }
  return data.map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<DbCategory | null> {
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return mapCategory(data);
}

export async function getProducts(): Promise<DbProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getProducts failed:", error.message);
    return [];
  }
  return data.map(mapProduct);
}

export async function getFeaturedProducts(limit = 4): Promise<DbProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getFeaturedProducts failed:", error.message);
    return [];
  }
  return data.map(mapProduct);
}

export async function getProductsByCategorySlug(categorySlug: string): Promise<DbProduct[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("published", true)
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getProductsByCategorySlug failed:", error.message);
    return [];
  }
  return data.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<DbProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  return mapProduct(data);
}

export async function getOneProductPerCategory(): Promise<DbProduct[]> {
  const categories = await getCategories();

  const results = await Promise.all(
    categories.map(async (cat) => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("published", true)
        .eq("category_id", cat.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error || !data) return null;
      return mapProduct(data);
    })
  );

  return results.filter((p): p is DbProduct => p !== null);
}