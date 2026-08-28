/**
 * Shared helper used by hand-built components to find the elements that
 * should participate in a focus trap. Deliberately simple: a real design
 * system also has to account for elements hidden via CSS (`display: none`,
 * zero-size), `<details>` internals, and shadow DOM. See NOTES.md for what
 * this trades away compared to the shadcn/Radix implementation.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null, // crude "is it visible" check
  )
}
