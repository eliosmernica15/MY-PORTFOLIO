/**
 * Dark/light theme verification — Nav button + terminal command + bootstrap.
 */
import { test, expect } from "@playwright/test";

test("nav toggle switches light ↔ dark and persists", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(500);

  const initial = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme"),
  );
  const toggle = page.getByRole("button", {
    name: /switch to (dark|light) theme/i,
  });
  await expect(toggle).toBeVisible();
  await toggle.click();

  const flipped = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme"),
  );
  expect(flipped).not.toBe(initial);

  // Reload — bootstrap should keep the flipped theme
  await page.reload({ waitUntil: "domcontentloaded" });
  const persisted = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme"),
  );
  expect(persisted).toBe(flipped);

  // Flip back so other tests see the default
  await page.reload({ waitUntil: "domcontentloaded" });
});

test("terminal `theme` command switches the site theme", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(500);

  const before = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme"),
  );

  await page.locator(".floating-trigger").first().click();
  await page.waitForTimeout(300);
  const input = page.getByRole("textbox", { name: /terminal input/i });
  await input.click();
  await input.pressSequentially(
    before === "light" ? "theme dark" : "theme light",
  );
  await input.press("Enter");
  await page.waitForTimeout(300);

  const after = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme"),
  );
  expect(after).not.toBe(before);

  // Also verify `theme toggle` works
  await input.pressSequentially("theme toggle");
  await input.press("Enter");
  await page.waitForTimeout(300);
  const toggled = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme"),
  );
  expect(toggled).toBe(before);
});
