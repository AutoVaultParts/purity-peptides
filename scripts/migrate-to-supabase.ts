import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { categories } from "../lib/categories";
import { products } from "../lib/products";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function migrateCategories(): Promise<Map<string, string>> {
  console.log(`\nMigrating ${categories.length} categories...`);

  const rows = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    icon: c.icon,
    photos: c.photos ?? [],
  }));

  const { data, error } = await supabase
    .from("categories")
    .upsert(rows, { onConflict: "slug" })
    .select("id, slug");

  if (error) {
    console.error("Category migration failed:", error.message);
    process.exit(1);
  }

  console.log(`  done, ${data.length} categories in the database`);

  const slugToId = new Map<string, string>();
  for (const row of data) slugToId.set(row.slug, row.id);
  return slugToId;
}

function cleanCasNumber(raw: string | undefined): string | null {
  if (!raw) return null;
  if (/\s|\//.test(raw)) return null;
  if (raw.toLowerCase().includes("none")) return null;
  return raw;
}

async function migrateProducts(categoryIdBySlug: Map<string, string>) {
  console.log(`\nMigrating ${products.length} products...`);

  const rows = products.map((p) => ({
    name: p.name,
    slug: p.slug,
    image_urls: [] as string[],
    sku: p.sku,
    price: p.price,
    unit: p.unit,
    stock_quantity: 25,
    category_id: categoryIdBySlug.get(p.category) ?? null,
    description: p.description,
    published: true,
    featured: false,
    mechanism_of_action: p.researchOverview?.mechanism ?? null,
    research_focus: p.researchOverview?.focus ?? null,
    form: p.form,
    purity: p.purity,
    appearance: "White to off-white lyophilized powder",
    molecular_formula: p.molecularFormula ?? null,
    molecular_weight: p.molecularWeight ?? null,
    cas_number: cleanCasNumber(p.casNumber),
    coa_status: p.coaAvailable ? "available" : "not_applicable",
    qa_purity_verification: "Independent HPLC testing",
    qa_identity_confirmation: "LC-MS, batch matched",
    storage_before: p.storageBeforeReconstitution,
    storage_after: p.storageAfterReconstitution,
    faqs: p.faqs ?? [],
  }));

  const missingCategory = rows.filter((r) => r.category_id === null);
  if (missingCategory.length > 0) {
    console.warn(
      `  warning: ${missingCategory.length} product(s) had no matching category and will be uncategorized:`,
      missingCategory.map((r) => r.sku).join(", ")
    );
  }

  const { data, error } = await supabase
    .from("products")
    .upsert(rows, { onConflict: "sku" })
    .select("sku");

  if (error) {
    console.error("Product migration failed:", error.message);
    process.exit(1);
  }

  console.log(`  done, ${data.length} products in the database`);
}

async function main() {
  const categoryIdBySlug = await migrateCategories();
  await migrateProducts(categoryIdBySlug);
  console.log("\nMigration complete. Check Supabase → Table Editor to confirm.\n");
}

main();
