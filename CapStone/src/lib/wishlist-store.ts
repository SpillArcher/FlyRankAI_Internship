export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

const STORAGE_KEY = "stylist-wishlist";

type Listener = () => void;
const listeners = new Set<Listener>();
let items: WishlistItem[] = [];

function loadFromStorage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    items = stored ? JSON.parse(stored) : [];
  } catch {
    items = [];
  }
}

if (typeof window !== "undefined") {
  loadFromStorage();
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — wishlist still works for this session.
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): WishlistItem[] {
  return items;
}

const EMPTY_WISHLIST: WishlistItem[] = [];

export function getServerSnapshot(): WishlistItem[] {
  return EMPTY_WISHLIST;
}

export function isWishlisted(id: number): boolean {
  return items.some((i) => i.id === id);
}

export function toggle(item: WishlistItem) {
  items = isWishlisted(item.id)
    ? items.filter((i) => i.id !== item.id)
    : [...items, item];
  persist();
  emit();
}

export function remove(id: number) {
  items = items.filter((i) => i.id !== id);
  persist();
  emit();
}
