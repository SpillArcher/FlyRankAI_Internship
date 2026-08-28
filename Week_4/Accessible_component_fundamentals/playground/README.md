# Accessible components playground

Three interactive components built from scratch against their W3C ARIA
Authoring Practices Guide (APG) pattern, plus shadcn/ui's real versions of
two of them for comparison. See `NOTES.md` for the comparison writeup.

## Structure

- `src/playground/` - the hand-built components. No component libraries.
  - `Modal.tsx` - [Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
  - `Tabs.tsx` - [Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
  - `Disclosure.tsx` - [Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- `src/components/ui/` - shadcn/ui's `dialog.tsx` and `tabs.tsx`, fetched
  from the real shadcn-ui GitHub repo (see NOTES.md for why - `ui.shadcn.com`
  wasn't reachable in the environment this was built in).
- `NOTES.md` - concrete gaps between the two, grounded in reading the real
  installed Radix primitive source in `node_modules`.

## Running it

```sh
npm install
npm run dev
```

Then try every widget keyboard-only: Tab, Shift+Tab, Escape, and arrow
keys/Home/End on the tabs.
