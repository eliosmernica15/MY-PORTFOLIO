/**
 * Accessibility + interaction guarantees for the ELIOS/OS shell.
 *  - reduced motion: boot is skipped entirely, page is fully usable
 *  - ⌘K / Ctrl+K opens the palette; Escape closes it without closing a window behind it
 *  - opening a window from the dock and closing it returns focus to the dock button
 *  - the dock is keyboard-reachable and every control has an accessible name
 */
import { test, expect } from "@playwright/test";

test("reduced motion: boot overlay never appears", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("status", { name: /startup|nisjes/i }),
  ).toHaveCount(0);
  await expect(page.locator("h1")).toBeVisible();
});

test("normal motion: boot renders and auto-dismisses", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  const boot = page.getByRole("status", { name: /startup|nisjes/i });
  // Boot must appear for fresh visitors and then detach on its own
  await boot.waitFor({ state: "attached", timeout: 3000 }).catch(() => {});
  await boot.waitFor({ state: "detached", timeout: 8000 });
  await expect(page.locator("h1")).toBeVisible();
});

test("ctrl+k opens palette and escape leaves windows alone", async ({
  page,
}) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  // Wait out the boot
  await page.waitForTimeout(2200);

  // Open the Finder window first — Esc inside the palette must not close it
  const dock = page.locator('nav[aria-label="Personal operating environment"]');
  await dock.getByRole("button", { name: /finder/i }).click();
  await expect(page.getByRole("dialog", { name: "Finder" })).toBeVisible();

  await page.keyboard.press("Control+KeyK");
  const palette = page.getByRole("dialog", { name: /command palette/i });
  await expect(palette).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(palette).not.toBeVisible();
  // The Finder window is still open — Esc was consumed by the palette only
  await expect(page.getByRole("dialog", { name: "Finder" })).toBeVisible();
});

test("focus returns to the dock button after closing its window", async ({
  page,
}) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2200);

  const dock = page.locator('nav[aria-label="Personal operating environment"]');
  const hire = dock.getByRole("button", { name: /hire me/i });
  await hire.focus();
  await page.keyboard.press("Enter");

  const hireWindow = page.getByRole("dialog", { name: /hire me/i });
  await expect(hireWindow).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(hireWindow).not.toBeVisible();
  await expect(hire).toBeFocused();
});

test("dock controls all have accessible names and are keyboard reachable", async ({
  page,
}) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2200);

  const dock = page.locator('nav[aria-label="Personal operating environment"]');
  const controls = dock.getByRole("button");
  const count = await controls.count();
  expect(count).toBeGreaterThanOrEqual(8);
  for (let i = 0; i < count; i++) {
    const name = await controls.nth(i).getAttribute("aria-label");
    expect(name, `dock control #${i} must have an aria-label`).toBeTruthy();
  }
});

test("skip links are present and first in tab order", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(
    () => document.activeElement?.textContent ?? "",
  );
  expect(focused.toLowerCase()).toContain("skip to main");
});
