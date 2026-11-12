/**
 * Dark-theme spot checks beyond attribute flips:
 *  - CSS variables actually change (paper ink → ink on espresso)
 *  - No console errors in either mode
 *  - Floating terminal FAB still visible in dark mode
 */
import { test, expect } from "@playwright/test";

test("dark mode applies deep-ink tokens end-to-end", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(400);

  const read = () =>
    page.evaluate(() => ({
      bg: getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-primary")
        .trim(),
      fg: getComputedStyle(document.documentElement)
        .getPropertyValue("--text-primary")
        .trim(),
      accent: getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim(),
    }));

  const light = await read();
  expect(light.bg.toLowerCase()).toBe("#faf7f2");

  await page.evaluate(() => {
    const toggle = Array.from(document.querySelectorAll("button")).find((b) =>
      /switch to dark theme/i.test((b as HTMLButtonElement).ariaLabel ?? ""),
    ) as HTMLButtonElement | undefined;
    toggle?.click();
  });
  await page.waitForTimeout(400);

  const dark = await read();
  expect(dark.bg.toLowerCase()).toBe("#171210");
  expect(dark.fg.toLowerCase()).toBe("#ede7de");
  expect(dark.accent.toLowerCase()).toBe("#e0754b");

  // Switch back to light for anything else running next
  await page.evaluate(() => {
    const toggle = Array.from(document.querySelectorAll("button")).find((b) =>
      /switch to light theme/i.test((b as HTMLButtonElement).ariaLabel ?? ""),
    ) as HTMLButtonElement | undefined;
    toggle?.click();
  });
});

test("no console errors after switching theme", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const toggle = Array.from(document.querySelectorAll("button")).find((b) =>
      /switch to dark theme/i.test((b as HTMLButtonElement).ariaLabel ?? ""),
    ) as HTMLButtonElement | undefined;
    toggle?.click();
  });
  await page.waitForTimeout(700);
  expect(errors.filter((e) => !/Permissions-Policy/.test(e))).toEqual([]);

  // Return to light
  await page.evaluate(() => {
    const toggle = Array.from(document.querySelectorAll("button")).find((b) =>
      /switch to light theme/i.test((b as HTMLButtonElement).ariaLabel ?? ""),
    ) as HTMLButtonElement | undefined;
    toggle?.click();
  });
});

test("floating terminal trigger visible in dark mode", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.evaluate(() => {
    const toggle = Array.from(document.querySelectorAll("button")).find((b) =>
      /switch to dark theme/i.test((b as HTMLButtonElement).ariaLabel ?? ""),
    ) as HTMLButtonElement | undefined;
    toggle?.click();
  });
  await page.waitForTimeout(400);
  await expect(page.locator(".floating-trigger").first()).toBeVisible();

  // return to light
  await page.evaluate(() => {
    const toggle = Array.from(document.querySelectorAll("button")).find((b) =>
      /switch to light theme/i.test((b as HTMLButtonElement).ariaLabel ?? ""),
    ) as HTMLButtonElement | undefined;
    toggle?.click();
  });
});
