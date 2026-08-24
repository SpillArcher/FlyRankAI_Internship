"use client";

import { createContext, useContext, useState, useSyncExternalStore, useMemo } from "react";
import * as cartStore from "@/lib/cart-store";
import type { CartItem } from "@/lib/cart-store";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );

  // Drawer open/closed is ephemeral UI state, not persisted — a plain
  // useState here is fine, it's the persisted cart data that needed the
  // external-store treatment above.
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    addItem: (item) => {
      cartStore.addItem(item);
      setIsDrawerOpen(true);
    },
    removeItem: cartStore.removeItem,
    setQuantity: cartStore.setQuantity,
    clearCart: cartStore.clearCart,
    isDrawerOpen,
    openDrawer: () => setIsDrawerOpen(true),
    closeDrawer: () => setIsDrawerOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
