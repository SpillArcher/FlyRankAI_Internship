# Testing Guide - Stylist

This walks through producing **real** test output for the submission. Don't screenshot a hypothetical result - run these commands against your actual code and capture what actually comes back, pass or fail.

## 1. Install (Vitest + React Testing Library - works cleanly with Next.js)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

Add to `package.json` scripts:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

Create `vitest.config.ts` in the project root:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

## 2. Example test file (adapt to your real component)

The exact props, testids, and text below need to match your **actual** quiz component - treat this as a pattern, not a copy-paste-and-submit file. Save as `src/components/__tests__/QuizForm.test.tsx` (rename to match your real file):

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizForm from "../QuizForm"; // adjust path/name to match your real component

describe("QuizForm", () => {
  it("renders all quiz fields", () => {
    render(<QuizForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/interests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/colors/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mood/i)).toBeInTheDocument();
  });

  it("calls onSubmit with the entered values when the form is submitted", () => {
    const handleSubmit = vi.fn();
    render(<QuizForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/interests/i), {
      target: { value: "hiking, minimalism" },
    });
    fireEvent.click(screen.getByRole("button", { name: /style me/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ interests: "hiking, minimalism" })
    );
  });

  it("does not submit when required fields are empty", () => {
    const handleSubmit = vi.fn();
    render(<QuizForm onSubmit={handleSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /style me/i }));
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
```

If you'd rather test the anti-hallucination logic (arguably the most important piece of custom logic in the app - the lookup that drops any id the model returns that isn't in the real catalog), that's actually a stronger, more relevant test than a form render test. Something like:

```ts
import { describe, it, expect } from "vitest";
import { resolvePicks } from "../lib/resolvePicks"; // adjust to your real function name/path

const catalog = [
  { id: 1, title: "Flannel Shirt", price: 49.99, image: "x.jpg" },
  { id: 2, title: "Puffer Jacket", price: 110.0, image: "y.jpg" },
];

describe("resolvePicks", () => {
  it("returns full product data for valid ids", () => {
    const result = resolvePicks([{ id: 1, reason: "warm and versatile" }], catalog);
    expect(result).toEqual([
      { id: 1, title: "Flannel Shirt", price: 49.99, image: "x.jpg", reason: "warm and versatile" },
    ]);
  });

  it("silently drops ids that don't exist in the catalog", () => {
    const result = resolvePicks(
      [
        { id: 1, reason: "warm and versatile" },
        { id: 999, reason: "hallucinated item" },
      ],
      catalog
    );
    expect(result).toHaveLength(1);
    expect(result.find((p) => p.id === 999)).toBeUndefined();
  });
});
```

## 3. Run it and capture real output

```bash
npm run test:coverage
```

- Screenshot the terminal summary (it prints a coverage table: `% Stmts | % Branch | % Funcs | % Lines`).
- The HTML report lands in `coverage/index.html` - open it locally and screenshot the overview page too; it's more readable than the terminal table.
- If coverage is under 50%, that's real information - either add more test files, or note it honestly in the submission rather than only screenshotting the parts that look good.

## 4. Alternative: end-to-end instead of unit tests

If you'd rather demonstrate one critical flow end-to-end (quiz → submit → picks render):

```bash
npm install -D @playwright/test
npx playwright install
```

`tests/quiz-flow.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("user can complete the quiz and see picks", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByLabel(/interests/i).fill("hiking, minimalism");
  await page.getByLabel(/colors/i).fill("neutral tones");
  await page.getByRole("button", { name: /style me/i }).click();

  await expect(page.getByText(/stylist note/i)).toBeVisible({ timeout: 15000 });
  const picks = page.getByTestId("pick-card");
  await expect(picks).toHaveCountGreaterThan?.(0) ?? expect(picks.first()).toBeVisible();
});
```

```bash
npx playwright test --headed
```

This hits your **real** running app and real API route - it's a stronger signal than a mocked unit test for proving the critical flow actually works, but it does need the dev server running and a real API key set, since it's not mocked.
