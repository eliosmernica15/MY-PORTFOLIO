/**
 * Interaction checks for the redesigned portfolio.
 * (Replaces the old windowed-app suite — the OS layer is gone.)
 */
import { test, expect } from "@playwright/test";

test("work section lists all projects with real links", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  const work = page.locator("#work");
  await expect(work).toBeVisible();
  // Two featured cards + the index list = 8 links to project routes
  const links = work.getByRole("link");
  const hrefs = await links.evaluateAll((els) =>
    els.map((el) => (el as HTMLAnchorElement).getAttribute("href")),
  );
  const projectLinks = hrefs.filter((h) => h?.startsWith("/project/"));
  expect(projectLinks.length).toBe(8);
  expect(new Set(projectLinks).size).toBe(8);
});

test("contact: 2s behavioral guard surfaces a localized message", async ({
  page,
}) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(600);
  await page
    .locator("#c-message")
    .fill("A sufficiently long message with real content.");
  await page.locator("#c-name").fill("Test Person");
  await page.locator("#c-email").fill("test@example.com");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.locator("#contact [role='alert']")).toBeVisible({
    timeout: 15000,
  });
});

test("contact: qualifier disclosure reveals and hides chips", async ({
  page,
}) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(600);
  const disclosure = page.getByRole("button", { name: /add project details/i });
  await expect(disclosure).toHaveAttribute("aria-expanded", "false");
  await disclosure.click();
  await expect(disclosure).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("button", { name: /saas product/i }),
  ).toBeVisible();
  await disclosure.click();
  await expect(page.getByRole("button", { name: /saas product/i })).toHaveCount(
    0,
  );
});

test("contact: selecting qualifier chips works", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: /add project details/i }).click();
  const saas = page.getByRole("button", { name: /saas product/i });
  await saas.click();
  await expect(saas).toHaveAttribute("aria-pressed", "true");
});

test("no main-content horizontal overflow at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  const overflow = await page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(1);
});

test("SQ: h1 and services render in Albanian", async ({ page }) => {
  await page.goto("/sq", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("Ndërtoj sistemet");
  await expect(page.locator("#services")).toContainText("Çfarë ndërtoj", {
    ignoreCase: true,
  });
});
