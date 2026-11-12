/**
 * Terminal + assistant workflow verification.
 */
import { test, expect } from "@playwright/test";

test("terminal: grouped help lists all four sections", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(400);
  // Open terminal by clicking its floating trigger
  await page.locator(".floating-trigger").first().click();
  await page.waitForTimeout(300);

  const input = page.getByRole("textbox", { name: /terminal input/i });
  await input.click();
  await input.pressSequentially("help");
  await input.press("Enter");

  const body = page.locator("#terminal");
  await expect(body).toContainText("WORK", { timeout: 5000 });
  await expect(body).toContainText("ABOUT");
  await expect(body).toContainText("SHELL");
  await expect(body).toContainText("FUN");
  await expect(body).toContainText("projects");
  await expect(body).toContainText("services");
});

test("terminal: unknown command suggests a correction", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(400);
  await page.locator(".floating-trigger").first().click();
  await page.waitForTimeout(300);

  const input = page.getByRole("textbox", { name: /terminal input/i });
  await input.click();
  await input.pressSequentially("projcts");
  await input.press("Enter");

  await expect(page.locator("#terminal")).toContainText(
    /did you mean projects|projects\?/i,
    {
      timeout: 5000,
    },
  );
});

test("terminal: ls and pwd work", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(400);
  await page.locator(".floating-trigger").first().click();
  await page.waitForTimeout(300);

  const input = page.getByRole("textbox", { name: /terminal input/i });
  await input.click();
  await input.pressSequentially("pwd");
  await input.press("Enter");
  await expect(page.locator("#terminal")).toContainText("~/elios-mernica", {
    timeout: 5000,
  });

  await input.pressSequentially("ls");
  await input.press("Enter");
  await expect(page.locator("#terminal")).toContainText("Projects (9)", {
    timeout: 5000,
  });
});

test("assistant: Albanian question in /sq gets an Albanian answer", async ({
  page,
}) => {
  await page.goto("/sq", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(400);

  // Open assistant via its trigger (bottom-right floating button)
  const trigger = page
    .locator(".floating-trigger[aria-keyshortcuts='Control+J Meta+J']")
    .first();
  if (await trigger.count()) {
    await trigger.click();
  } else {
    await page.keyboard.press("Control+j");
  }
  const input = page.getByPlaceholder("Pyetni çfarëdo…");
  await input.waitFor({ state: "visible", timeout: 5000 });
  await input.pressSequentially("A jeni i disponueshëm?");
  await input.press("Enter");

  const body = page.locator("#assistant");
  // Expect Albanian text in the assistant's answer
  await expect(body).toContainText(/i hapur|disponueshëm|kontratë/i, {
    timeout: 8000,
  });
});

test("assistant: unknown question shows suggestion chips instead of a dead end", async ({
  page,
}) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(400);

  const trigger = page
    .locator(".floating-trigger[aria-keyshortcuts='Control+J Meta+J']")
    .first();
  if (await trigger.count()) {
    await trigger.click();
  } else {
    await page.keyboard.press("Control+j");
  }
  const input = page.getByPlaceholder("Ask me anything…");
  await input.waitFor({ state: "visible", timeout: 5000 });
  await input.pressSequentially("zzqxxv wubble floog");
  await input.press("Enter");

  // The suggestion chips appear — no silent dead-end
  const body = page.locator("#assistant");
  await expect(body).toContainText("What do you do?", { timeout: 8000 });
});
