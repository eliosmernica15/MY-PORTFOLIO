import { test, expect } from "@playwright/test";

test("rail chapter click scrolls to figure", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  const railLink = page
    .locator('aside a[href="/project/eltrix-cloud"]')
    .first();
  if (await railLink.isHidden()) {
    test.skip(true, "sticky rail hidden below the md breakpoint");
    return;
  }
  const before = await page.evaluate(() => window.scrollY);
  await railLink.click();
  await page.waitForFunction((y: number) => window.scrollY > y + 100, before, {
    timeout: 10000,
  });
  const after = await page.evaluate(() => window.scrollY);
  expect(after).toBeGreaterThan(before);
});

test("case study back-to-showcase lands on showcase", async ({ page }) => {
  await page.goto("/project/apl", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.getByRole("link", { name: /back to showcase/i }).click();
  await page.waitForFunction(
    (id: string) => {
      const el = document.getElementById(id);
      return !!el && Math.abs(el.getBoundingClientRect().top - 96) < 40;
    },
    "showcase",
    { timeout: 10000 },
  );
  const check = await page.evaluate(() => ({
    hash: window.location.hash,
    scrollY: window.scrollY,
    top: Math.round(
      document.getElementById("showcase")?.getBoundingClientRect().top ?? -1,
    ),
  }));
  console.log(JSON.stringify(check));
  expect(check.hash).toBe("#showcase");
  expect(check.scrollY).toBeGreaterThan(0);
});

test("nav Projects scrolls to work", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page
    .getByRole("link", { name: /^projects$/i })
    .first()
    .click();
  await page.waitForFunction(
    (id: string) => {
      const el = document.getElementById(id);
      return !!el && Math.abs(el.getBoundingClientRect().top - 96) < 40;
    },
    "work",
    { timeout: 10000 },
  );
  const top = await page.evaluate(() =>
    Math.round(
      document.getElementById("work")?.getBoundingClientRect().top ?? -1,
    ),
  );
  expect(Math.abs(top - 96)).toBeLessThan(60);
});
