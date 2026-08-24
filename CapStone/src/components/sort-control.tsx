"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function SortControl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <label className="flex items-center gap-2 font-mono text-sm">
      <span className="text-ink/60">Sort</span>
      <select
        value={currentSort}
        onChange={handleChange}
        className="rounded-md border border-border bg-paper px-2 py-1"
      >
        <option value="">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </label>
  );
}
