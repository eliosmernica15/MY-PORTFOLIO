/**
 * Accessibility + interaction guarantees for the redesigned site.
 *  - reduced motion: page renders fully, no boot overlay exists anymore
 *  - Ctrl/Cmd+K opens the palette; Escape closes it (no OS layer to leak into)
 *  - skip links are first in tab order; wordmark + EN/SQ are reachable
 */
import { test, expect } from "@playwright/test";

test("reduced motion: page renders fully", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("#navigation")).toBeVisible();
});

test("no boot overlay or dock exists", async ({ page }) => {
  await page.goto("/en");
  await expect(
    page.getByRole("status", { name: /startup|nisjes/i }),
  ).toHaveCount(0);
  await expect(page.locator(".dock-app")).toHaveCount(0);
});

test("ctrl+k opens palette and escape closes it", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+KeyK");
  const palette = page.getByRole("dialog", { name: /command palette/i });
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("apl");
  await expect(palette).toContainText("A++(APL)");
  await page.keyboard.press("Escape");
  await expect(palette).not.toBeVisible();
});

test("palette navigates to a project", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+KeyK");
  const palette = page.getByRole("dialog", { name: /command palette/i });
  await palette.getByRole("combobox").fill("apl");
  await page.keyboard.press("Enter");
  await page.waitForURL("**/project/apl", { timeout: 15000 });
  await expect(page).toHaveURL(/\/project\/apl$/);
});

test("skip links are first in tab order", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(
    () => document.activeElement?.textContent ?? "",
  );
  expect(focused.toLowerCase()).toContain("skip to main");
});

test("nav exposes the four destinations and the wordmark", async ({ page }) => {
  await page.goto("/en");
  const nav = page.locator("#navigation");
  await expect(nav).toContainText(/elios/i);
  await expect(nav.getByRole("link", { name: /projects/i })).toBeVisible();
  await expect(nav.getByRole("link", { name: /notes/i })).toBeVisible();
  await expect(nav.getByRole("link", { name: /about/i })).toBeVisible();
  await expect(nav.getByRole("link", { name: /contact/i })).toBeVisible();
});

test("SQ page renders Albanian chrome", async ({ page }) => {
  await page.goto("/sq");
  await expect(page.locator("#navigation")).toContainText("Projektet", {
    ignoreCase: true,
  });
  await expect(page.locator("h1")).toContainText(/ndërtoj sistemet/i);
});

test("contact form enforces the 2s behavioral window with a visible message", async ({
  page,
}) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  // Let React finish hydrating — robotic-speed clicks must not land before
  // the client handlers attach (native submit would reload the page).
  await page.waitForLoadState("load");
  await page.waitForTimeout(600);
  await page
    .locator("#c-message")
    .fill("This is a legitimate project inquiry from a real human.");
  await page.locator("#c-name").fill("Real Person");
  await page.locator("#c-email").fill("real@example.com");
  await page.getByRole("button", { name: /send message/i }).click();
  // Submitted <2s after first focus → localized behavioral message, not silence
  await expect(page.locator("#contact [role='alert']")).toBeVisible({
    timeout: 15000,
  });
});
