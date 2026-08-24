"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import * as wishlistStore from "@/lib/wishlist-store";
import type { WishlistItem } from "@/lib/wishlist-store";

interface WishlistContextValue {
  items: WishlistItem[];
  isWishlisted: (id: number) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (id: number) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot
  );

  const value: WishlistContextValue = {
    items,
    isWishlisted: (id) => items.some((i) => i.id === id),
    toggle: wishlistStore.toggle,
    remove: wishlistStore.remove,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
