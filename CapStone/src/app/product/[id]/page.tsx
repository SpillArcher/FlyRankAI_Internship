import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductById, getProductsByCategory } from "@/lib/catalog";
import AddToCartButton from "@/components/add-to-cart-button";
import WishlistButton from "@/components/wishlist-button";
import ProductGrid from "@/components/product-grid";

interface Props {
  params: Promise<{ id: string }>;
}

const WEARABLE_CATEGORIES = ["men's clothing", "women's clothing"] as const;
type WearableCategory = (typeof WEARABLE_CATEGORIES)[number];

function isWearableCategory(value: string): value is WearableCategory {
  return (WEARABLE_CATEGORIES as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  return { title: product?.title ?? "Product" };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId)) {
    notFound();
  }

  const product = await getProductById(numericId);

  if (!product) {
    notFound();
  }

  const related = isWearableCategory(product.category)
    ? (await getProductsByCategory(product.category))
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
    : [];

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-white">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-contain p-8"
            priority
          />
          <WishlistButton product={product} className="absolute right-4 top-4" />
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-mono text-sm uppercase tracking-widest text-signal">
            {product.category}
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink">
            {product.title}
          </h1>
          <p className="font-mono text-2xl text-price">${product.price}</p>
          <p className="text-sm leading-relaxed text-ink/70">
            {product.description}
          </p>
          <AddToCartButton product={product} className="mt-2 self-start" />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20 border-t border-border pt-10">
          <p className="font-mono text-sm uppercase tracking-widest text-signal">
            You might also like
          </p>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </div>
      )}
    </section>
  );
}
