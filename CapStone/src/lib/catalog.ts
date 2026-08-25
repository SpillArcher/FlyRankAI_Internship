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

// A generic serverless fetch (no User-Agent, datacenter IP) occasionally
// gets caught by fakestoreapi.com's bot/rate-limit protection — this has
// shown up as intermittent failures specifically from Vercel, not from
// local dev. A browser-like header plus a short timeout + one retry
// smooths over that without waiting indefinitely on a hung request.
async function fetchWithRetry(url: string, attempt = 1): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    });
    return res;
  } catch (err) {
    if (attempt < 2) {
      return fetchWithRetry(url, attempt + 1);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetches every product from fakestoreapi.com. The write endpoints on this
 * API don't actually persist data, so the 20-product dataset stays fixed
 * and clean — one small request covers the whole catalog, no pagination
 * or junk-data filtering needed.
 */
async function getAllProducts(): Promise<Product[]> {
  const res = await fetchWithRetry(`${FAKESTORE_BASE}/products`);
  if (!res.ok) {
    const body = await res.text().catch(() => "(no body)");
    console.error(`[catalog] fetch failed (${res.status}):`, body);
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
  const res = await fetchWithRetry(`${FAKESTORE_BASE}/products/${id}`);
  if (!res.ok) return null;
  const product = await res.json();
  return product && product.id ? product : null;
}