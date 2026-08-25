/**
 * Cart and wishlist items persist to localStorage, so a browser that saved
 * an item before the catalog moved to local images could still have a
 * stale entry pointing at an old external image URL. Every real product
 * image is a local file served from /public and always starts with "/" —
 * anything else falls back to the branded placeholder instead of
 * crashing the page.
 */
export function localImage(src: string): string {
  return src.startsWith("/") ? src : "/no-photo.svg";
}
