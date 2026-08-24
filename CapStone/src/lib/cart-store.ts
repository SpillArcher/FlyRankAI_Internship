export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const STORAGE_KEY = "stylist-cart";

type Listener = () => void;
const listeners = new Set<Listener>();
let items: CartItem[] = [];

function loadFromStorage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    items = stored ? JSON.parse(stored) : [];
  } catch {
    items = [];
  }
}

// Runs once when this module is first evaluated in the browser (never on
// the server, since `window` doesn't exist there) — so by the time any
// component's first client-side render calls getSnapshot(), the real
// cart is already loaded, no effect needed.
if (typeof window !== "undefined") {
  loadFromStorage();
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — cart still works for this session.
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Client snapshot — real cart data, safe to call after hydration. */
export function getSnapshot(): CartItem[] {
  return items;
}

// A single shared reference, reused on every call. React compares
// consecutive getServerSnapshot() results with Object.is — returning a
// fresh `[]` literal each time would look like "changed every call" and
// loop forever, even though the value is logically the same.
const EMPTY_CART: CartItem[] = [];

/** Server + initial-hydration snapshot — always empty, since the real
 * cart lives in localStorage and doesn't exist yet on the server. React
 * uses this for the first render to guarantee it matches the server HTML,
 * then re-renders with getSnapshot() right after hydration completes. */
export function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function addItem(item: Omit<CartItem, "quantity">) {
  const existing = items.find((i) => i.id === item.id);
  items = existing
    ? items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    : [...items, { ...item, quantity: 1 }];
  persist();
  emit();
}

export function removeItem(id: number) {
  items = items.filter((i) => i.id !== id);
  persist();
  emit();
}

export function setQuantity(id: number, quantity: number) {
  items =
    quantity <= 0
      ? items.filter((i) => i.id !== id)
      : items.map((i) => (i.id === id ? { ...i, quantity } : i));
  persist();
  emit();
}

export function clearCart() {
  items = [];
  persist();
  emit();
}
