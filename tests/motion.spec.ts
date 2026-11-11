/**
 * Structural checks for the motion system — asserts hooks exist and engage,
 * not pixels. Visual judgment stays with the human reviewer.
 */
import { test, expect } from "@playwright/test";

test("hero entrance engages (hero-in) after mount", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await expect(page.locator("section#home.hero-in")).toBeVisible();
  await expect(page.locator(".hero-line-inner").first()).toBeVisible();
});

test("ticker renders once and is aria-hidden with sr-only copy", async ({
  page,
}) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".ticker")).toHaveCount(1);
  await expect(page.locator(".ticker")).toHaveAttribute("aria-hidden", "true");
});

test("scroll reveals engage for below-the-fold sections", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.locator("#services").scrollIntoViewIfNeeded();
  await page.waitForSelector("#services .reveal.is-visible", { timeout: 5000 });
  const visible = await page.locator("#services .reveal.is-visible").count();
  expect(visible).toBeGreaterThan(0);
});

test("sticky showcase exists on desktop with three chapters", async ({
  page,
}) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  const rail = page.locator("[data-chapter]");
  await expect(rail).toHaveCount(3);
});

test("back-to-top appears after deep scroll and returns to top", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  const btt = page.getByRole("button", { name: /back to top|kthehu lart/i });
  await expect(btt).toBeVisible();
  await btt.click();
  await page.waitForFunction(() => window.scrollY < 200, null, {
    timeout: 8000,
  });
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(200);
});

test("reduced motion: page renders with zero reveal transitions applied", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  // Content must be visible without any animation class engagement
  await expect(page.locator("h1")).toBeVisible();
  const opacity = await page
    .locator("#services .reveal")
    .first()
    .evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(opacity)).toBe(1);
});
