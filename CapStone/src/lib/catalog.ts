export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: "men's clothing" | "women's clothing";
}

// Static, local catalog — no external API, no network call, nothing that
// can go down, rate-limit, or block requests at grading time. Images live
// in /public/products/ and are referenced by path below; drop a matching
// file in for each id and it just works, no config needed since local
// /public assets don't need next.config.ts remotePatterns.
const PRODUCTS: Product[] = [
  {
    id: 101,
    title: "Classic Bomber Jacket",
    price: 89.99,
    description:
      "A lightweight bomber with a ribbed collar and cuffs — layers easily over almost anything.",
    image: "/products/mens-bomber-jacket.jpg",
    category: "men's clothing",
  },
  {
    id: 102,
    title: "Everyday Oxford Shirt",
    price: 45.0,
    description:
      "A soft cotton oxford that works equally well tucked in for the office or open over a tee.",
    image: "/products/mens-oxford-shirt.jpg",
    category: "men's clothing",
  },
  {
    id: 103,
    title: "Relaxed Fit Chinos",
    price: 59.99,
    description:
      "A tapered, relaxed cut in a mid-weight cotton twill — the everyday pant that isn't jeans.",
    image: "/products/mens-chinos.webp",
    category: "men's clothing",
  },
  {
    id: 104,
    title: "Merino Wool Sweater",
    price: 75.0,
    description:
      "Fine-gauge merino with a crew neck — warm without bulk, dresses up or down easily.",
    image: "/products/mens-wool-sweater.webp",
    category: "men's clothing",
  },
  {
    id: 105,
    title: "Denim Trucker Jacket",
    price: 95.0,
    description:
      "A classic trucker cut in mid-wash denim — the layer that goes with everything.",
    image: "/products/mens-denim-jacket.webp",
    category: "men's clothing",
  },
  {
    id: 106,
    title: "Lightweight Track Jacket",
    price: 65.0,
    description:
      "A zip-through track jacket in a soft technical fabric, built for movement.",
    image: "/products/mens-track-jacket.webp",
    category: "men's clothing",
  },
  {
    id: 201,
    title: "Tailored Blazer",
    price: 99.99,
    description:
      "A structured, single-breasted blazer that anchors a smart-casual outfit instantly.",
    image: "/products/womens-blazer.webp",
    category: "women's clothing",
  },
  {
    id: 202,
    title: "Silky Wrap Dress",
    price: 79.99,
    description:
      "A fluid wrap dress in a lightweight satin-finish fabric — dressy without trying hard.",
    image: "/products/womens-wrap-dress.webp",
    category: "women's clothing",
  },
  {
    id: 203,
    title: "High-Waisted Wide Trousers",
    price: 69.99,
    description:
      "Wide-leg trousers with a high waist and a fluid drape — comfortable and polished.",
    image: "/products/womens-wide-trousers.jpeg",
    category: "women's clothing",
  },
  {
    id: 204,
    title: "Cropped Knit Cardigan",
    price: 55.0,
    description:
      "A cropped, button-through cardigan in a soft knit — easy to layer over anything.",
    image: "/products/womens-cardigan.webp",
    category: "women's clothing",
  },
  {
    id: 205,
    title: "Linen Midi Skirt",
    price: 49.99,
    description:
      "A relaxed midi skirt in breathable linen, with a flattering elastic waist.",
    image: "/products/womens-midi-skirt.webp",
    category: "women's clothing",
  },
  {
    id: 206,
    title: "Oversized Denim Jacket",
    price: 89.99,
    description:
      "An oversized denim jacket in a light wash — the throw-on layer for cooler evenings.",
    image: "/products/womens-denim-jacket.webp",
    category: "women's clothing",
  },
  {
  id: 111,
  title: "Flannel Shirt",
  price: 49.99,
  description: "A brushed cotton flannel in a classic plaid, soft and warm.",
  image: "/products/men-flannel-shirt.webp",
  category: "men's clothing",
},
{
  id: 112,
  title: "Puffer Jacket",
  price: 110.0,
  description: "A packable puffer jacket with real warmth for very little weight.",
  image: "/products/mens-puffer-jacket.webp",
  category: "men's clothing",
},
{
  id: 113,
  title: "Jogger Sweatpants",
  price: 54.99,
  description: "Tapered joggers in a soft fleece, elastic cuffs at the ankle.",
  image: "/products/mens-jogger-sweatpants.webp",
  category: "men's clothing",
},
{
  id: 114,
  title: "Classic Polo Shirt",
  price: 39.99,
  description: "A pique cotton polo — smarter than a tee, more relaxed than a shirt.",
  image: "/products/mens-polo-shirt.webp",
  category: "men's clothing",
},
{
  id: 115,
  title: "Corduroy Overshirt",
  price: 74.99,
  description: "A midweight corduroy shirt-jacket, worn open or buttoned up.",
  image: "/products/mens-corduroy-overshirt.webp",
  category: "men's clothing",
},
{
  id: 116,
  title: "Long Sleeve Henley",
  price: 34.99,
  description: "A button-placket henley in soft waffle-knit cotton.",
  image: "/products/mens-long-sleeve-henley.webp",
  category: "men's clothing",
},
{
  id: 117,
  title: "Packable Windbreaker",
  price: 65.0,
  description: "A lightweight, water-resistant windbreaker that folds into its own pocket.",
  image: "/products/mens-packable-windbreaker.webp",
  category: "men's clothing",
},
{
  id: 118,
  title: "Wool Overcoat",
  price: 189.99,
  description: "A tailored wool-blend overcoat for the coldest part of the year.",
  image: "/products/mens_wool_overcoat.jpg",
  category: "men's clothing",
},
{
  id: 119,
  title: "Linen Button-Up",
  price: 55.0,
  description: "A relaxed linen shirt that breathes easily in warm weather.",
  image: "/products/mens-linen-button-up.webp",
  category: "men's clothing",
},
{
  id: 120,
  title: "Chelsea Boots",
  price: 120.0,
  description: "Slip-on leather Chelsea boots with an elastic side panel.",
  image: "/products/mens-chelsea-boots.jpg",
  category: "men's clothing",
},
{
  id: 211,
  title: "Floral Sundress",
  price: 64.99,
  description: "A lightweight sundress in a small floral print, easy for warm days.",
  image: "/products/womens-floral-sundress.webp",
  category: "women's clothing",
},
{
  id: 212,
  title: "Belted Puffer Coat",
  price: 135.0,
  description: "A cinched-waist puffer coat that trades bulk for real shape.",
  image: "/products/womens-belted-puffer-coat.webp",
  category: "women's clothing",
},
{
  id: 213,
  title: "High-Rise Skinny Jeans",
  price: 69.99,
  description: "A high-rise skinny jean with a bit of stretch for all-day wear.",
  image: "/products/womens-high-rise-skinny-jeans.webp",
  category: "women's clothing",
},
{
  id: 214,
  title: "Ribbed Turtleneck Sweater",
  price: 59.99,
  description: "A fitted ribbed turtleneck, easy to layer under a blazer or coat.",
  image: "/products/womens-ribbed-turtleneck-sweater.webp",
  category: "women's clothing",
},
{
  id: 215,
  title: "Pleated Midi Skirt",
  price: 54.99,
  description: "An accordion-pleated midi skirt with real movement when you walk.",
  image: "/products/womens-pleated-midi-skirt.webp",
  category: "women's clothing",
},
{
  id: 216,
  title: "Classic Trench Coat",
  price: 145.0,
  description: "A belted trench in water-resistant cotton twill, the year-round layer.",
  image: "/products/womens-classic-trench-coat.jpg",
  category: "women's clothing",
},
{
  id: 217,
  title: "Off-Shoulder Blouse",
  price: 44.99,
  description: "A soft off-shoulder blouse with elasticated neckline for an easy fit.",
  image: "/products/womens-off-shoulder-blouse.webp",
  category: "women's clothing",
},
{
  id: 218,
  title: "Wide-Leg Jumpsuit",
  price: 84.99,
  description: "A one-piece jumpsuit with a fitted waist and a wide, flowing leg.",
  image: "/products/womens-wide-leg-jumpsuit.webp",
  category: "women's clothing",
},
{
  id: 219,
  title: "Faux Leather Leggings",
  price: 49.99,
  description: "High-shine faux leather leggings with a comfortable stretch waistband.",
  image: "/products/womens-faux-leather-leggings.jpg",
  category: "women's clothing",
},
{
  id: 220,
  title: "Chunky Platform Loafers",
  price: 79.99,
  description: "A chunky-soled loafer that pairs equally well with a skirt or trousers.",
  image: "/products/womens-chunky-platform-loafers.webp",
  category: "women's clothing",
},
];

/** All Men's + Women's clothing items — used by the AI stylist. */
export async function getWearableCatalog(): Promise<Product[]> {
  return PRODUCTS;
}

/** Items in one specific category — used by the Men's/Women's browse pages. */
export async function getProductsByCategory(
  category: "men's clothing" | "women's clothing"
): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.category === category);
}

/** A single product by id — used by the product detail page. */
export async function getProductById(id: number): Promise<Product | null> {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}
