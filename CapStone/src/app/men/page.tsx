import { getProductsByCategory } from "@/lib/catalog";
import ProductGrid from "@/components/product-grid";
import SortControl from "@/components/sort-control";

export const metadata = { title: "Men" };

interface Props {
  searchParams: Promise<{ sort?: string }>;
}

export default async function MenPage({ searchParams }: Props) {
  const { sort } = await searchParams;
  const products = await getProductsByCategory("men's clothing");

  const sorted =
    sort === "price-asc"
      ? [...products].sort((a, b) => a.price - b.price)
      : sort === "price-desc"
        ? [...products].sort((a, b) => b.price - a.price)
        : products;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm uppercase tracking-widest text-signal">
            Men
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink">
            Men&apos;s clothing
          </h1>
        </div>
        <SortControl />
      </div>
      <div className="mt-10">
        <ProductGrid products={sorted} />
      </div>
    </section>
  );
}
