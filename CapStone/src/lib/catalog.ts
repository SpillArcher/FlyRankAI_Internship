const FAKESTORE_BASE = "https://fakestoreapi.com";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const WEARABLE_CATEGORIES = new Set(["men's clothing", "women's clothing"]);

/**
 * Fetches every product from fakestoreapi.com. The write endpoints on this
 * API don't actually persist data, so the 20-product dataset stays fixed
 * and clean — one small request covers the whole catalog, no pagination
 * or junk-data filtering needed.
 */
async function getAllProducts(): Promise<Product[]> {
  const res = await fetch(`${FAKESTORE_BASE}/products`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load products (${res.status})`);
  }
  return res.json();
}

/** All Men's + Women's clothing items — used by the AI stylist. */
export async function getWearableCatalog(): Promise<Product[]> {
  const products = await getAllProducts();
  const wearable = products.filter((p) =>
    WEARABLE_CATEGORIES.has(p.category?.toLowerCase())
  );
  console.log(
    `[catalog] fetched ${products.length} products -> ${wearable.length} in men's/women's clothing`
  );
  return wearable;
}

/** Items in one specific category — used by the Men's/Women's browse pages. */
export async function getProductsByCategory(
  category: "men's clothing" | "women's clothing"
): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.category?.toLowerCase() === category);
}

/** A single product by id — used by the product detail page. */
export async function getProductById(id: number): Promise<Product | null> {
  const res = await fetch(`${FAKESTORE_BASE}/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const product = await res.json();
  // fakestoreapi returns `null` (200 OK) for an id it doesn't recognize,
  // rather than a 404 — worth guarding against explicitly.
  return product && product.id ? product : null;
}
