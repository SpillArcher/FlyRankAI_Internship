# Performance & Accessibility Audit Guide - Stylist

Run these against the **live deployed URL**, not localhost - production builds are optimized differently (minification, caching headers, CDN), so a localhost score isn't representative.

## 1. Lighthouse

**Option A - Chrome DevTools (easiest, no install):**
1. Open your live URL in Chrome, in an Incognito window (avoids extensions skewing the score).
2. Open DevTools → Lighthouse tab.
3. Check Performance, Accessibility, Best Practices, SEO.
4. Set device to **Mobile** (the rubric specifically calls this out) - run it, then run again with **Desktop**.
5. Click "Analyze page load."
6. Screenshot the results page for both runs - this is your evidence, not a typed-out number.

**Option B - CLI (scriptable, good if you want it in CI later):**
```bash
npm install -g lighthouse
lighthouse https://your-live-url.vercel.app --view --output=html --output-path=./lighthouse-report.html
lighthouse https://your-live-url.vercel.app --preset=desktop --view
```

If your score is under 90, don't just note the number - open the Lighthouse report's "Opportunities" and "Diagnostics" sections, they tell you exactly what's costing points (common ones for a Next.js app: unoptimized images, render-blocking resources, missing `next/font` usage, large JS bundles from unused dependencies).
![alt text](<Screenshot 2026-08-26 224204.png>)

## 2. Accessibility Audit (WAVE or axe)

**WAVE:**
1. Go to [wave.webaim.org](https://wave.webaim.org)
2. Paste your live URL.
3. Screenshot the summary panel (errors / alerts / features / contrast errors).

**axe DevTools (Chrome extension):**
1. Install the axe DevTools extension.
2. Open your live URL, open DevTools → axe DevTools tab.
3. Click "Scan all of my page."
4. Screenshot the results - ideally "0 issues," but if there are issues, screenshot those too and fix what you can before re-scanning.
![alt text](<Screenshot 2026-08-26 224508.png>)
**Common things to check specifically, given this app's UI (a quiz form + result cards):**
- Every form input has an associated `<label>` (not just a placeholder - placeholders don't meet WCAG labeling requirements).
- Buttons have accessible names (`aria-label` if icon-only).
- Color contrast on quiz buttons and result text meets 4.5:1 for normal text, 3:1 for large text.
- Images (product photos) have meaningful `alt` text, not empty `alt=""` unless they're purely decorative.
- The results section is announced to screen readers when it appears (e.g., `aria-live="polite"` on the container that shows the stylist note, since it renders after an async fetch with no page navigation).
- Keyboard-only navigation: tab through the whole quiz and submit without touching the mouse - this alone catches a lot of what automated scanners miss.
![alt text](<Screenshot 2026-08-26 012513.png>)
