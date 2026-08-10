import { supabase } from "./supabase-browser";
import { getShippingRegion } from "./checkout-data";

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
  image: string | null;
  images: string[];
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

export type ReviewSubmission = {
  type: "site" | "product";
  productId?: string | null;
  customerName: string;
  customerEmail?: string;
  rating: number;
  title?: string;
  body: string;
};

export async function submitReview(input: ReviewSubmission): Promise<{ error: string | null }> {
  const { error } = await supabase.from("reviews").insert({
    type: input.type,
    product_id: input.productId ?? null,
    customer_name: input.customerName,
    customer_email: input.customerEmail || null,
    rating: input.rating,
    title: input.title || null,
    body: input.body,
    status: "pending",
  });
  if (error) return { error: error.message };
  return { error: null };
}

export type PublicReview = {
  id: string;
  customerName: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
  isFeatured: boolean;
};

function mapPublicReview(row: any): PublicReview {
  return {
    id: row.id,
    customerName: row.customer_name,
    rating: row.rating,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    isVerifiedPurchase: row.is_verified_purchase,
    isFeatured: row.is_featured,
  };
}

export async function getSiteReviews(limit = 6): Promise<PublicReview[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .eq("type", "site")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getSiteReviews failed:", error.message);
    return [];
  }
  return data.map(mapPublicReview);
}

export async function getProductReviews(productId: string): Promise<PublicReview[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .eq("type", "product")
    .eq("product_id", productId)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getProductReviews failed:", error.message);
    return [];
  }
  return data.map(mapPublicReview);
}

export async function submitContactRequest(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from("contact_requests").insert({
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    message: input.message,
    status: "unread",
  });
  if (error) return { error: error.message };
  return { error: null };
}

export type OrderAddress = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type OrderItemInput = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string | null;
};

export async function createOrder(input: {
  orderNumber: string;
  address: OrderAddress;
  paymentMethod: string;
  items: OrderItemInput[];
  rawSubtotal: number;
  discountRate: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
}): Promise<{ error: string | null }> {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: input.orderNumber,
      email: input.address.email,
      address: input.address,
      payment_method: input.paymentMethod,
      status: "pending_payment",
      subtotal: input.rawSubtotal,
      discount_rate: input.discountRate,
      discount_amount: input.discountAmount,
      shipping_amount: input.shippingAmount,
      total: input.total,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message || "Failed to create order" };
  }

  const itemRows = input.items.map((item) => ({
    order_id: order.id,
    sku: item.sku,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    unit: item.unit,
    image: item.image ?? null,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(itemRows);

  if (itemsError) {
    return { error: itemsError.message };
  }

  return { error: null };
}

export type DbOrder = {
  id: string;
  orderNumber: string;
  email: string;
  address: OrderAddress;
  paymentMethod: string;
  status: string;
  subtotal: number;
  discountRate: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
  createdAt: string;
  items: { sku: string; name: string; price: number; quantity: number; unit: string; image: string | null }[];
};

export async function getOrderByNumber(orderNumber: string): Promise<DbOrder | null> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error || !order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("sku, name, price, quantity, unit, image")
    .eq("order_id", order.id);

  return {
    id: order.id,
    orderNumber: order.order_number,
    email: order.email,
    address: order.address,
    paymentMethod: order.payment_method,
    status: order.status,
    subtotal: Number(order.subtotal),
    discountRate: Number(order.discount_rate),
    discountAmount: Number(order.discount_amount),
    shippingAmount: Number(order.shipping_amount),
    total: Number(order.total),
    createdAt: order.created_at,
    items: (items || []).map((i) => ({
      sku: i.sku,
      name: i.name,
      price: Number(i.price),
      quantity: i.quantity,
      unit: i.unit,
      image: i.image,
    })),
  };
}

const FREE_SHIPPING_THRESHOLDS: Record<string, number> = {
  US: 500,
  CA: 800,
  EU: 1000,
  AU: 1300,
  INTL: 1300,
};

export async function getShippingCost(countryCode: string, subtotal: number): Promise<number> {
  const region = getShippingRegion(countryCode);

  const threshold = FREE_SHIPPING_THRESHOLDS[region] ?? 1300;
  if (subtotal >= threshold) return 0;

  const { data, error } = await supabase
    .from("shipping_rates")
    .select("rate")
    .eq("region", region)
    .lte("weight_min", 0)
    .order("weight_min", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) return 0;
  return Number(data.rate);
}
