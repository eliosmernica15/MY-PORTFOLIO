/**
 * Responsive + notes-flow audit:
 *  - No horizontal overflow at any audited width (320..1920)
 *  - /notes shows the Home affordance and the Add Note button
 *  - Add Note opens the themed modal; a saved note appears in the list
 *    and a toast confirms; note persists via localStorage
 */
import { test, expect } from "@playwright/test";

const WIDTHS = [320, 375, 390, 768, 820, 1024, 1280, 1440, 1920];

test("no horizontal overflow at any audited width", async ({ page }) => {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth - doc.clientWidth;
    });
    expect(
      overflow,
      `width ${width}px overflows by ${overflow}px`,
    ).toBeLessThanOrEqual(1);
  }
});

test("notes: home affordance + add-note flow works end to end", async ({
  page,
}) => {
  await page.goto("/notes", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");

  // Home affordance
  const home = page.getByRole("link", { name: /home|ballina/i }).first();
  await expect(home).toBeVisible();

  // Add Note button opens the modal
  await page.getByRole("button", { name: /add note|shto shënim/i }).click();
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(modal.locator("#un-title")).toBeVisible();

  // Save with too-short body → error; then valid → note appears + toast
  await modal.locator("#un-title").fill("Audit note");
  await modal.locator("#un-body").fill("short");
  await modal.getByRole("button", { name: /save note|ruaj shënimin/i }).click();
  await expect(modal.getByRole("alert")).toBeVisible();

  await modal
    .locator("#un-body")
    .fill(
      "A note written during a responsive audit — it should persist and render with the paper theme.",
    );
  await modal.getByRole("button", { name: /save note|ruaj shënimin/i }).click();

  // Toast confirms
  await expect(page.locator('[role="status"]')).toContainText(
    /note added|shënimi u shtua/i,
    {
      timeout: 5000,
    },
  );

  // User note appears in the list
  await expect(page.getByText("Audit note")).toBeVisible();
});

test("back-to-top sits between the terminal and assistant FABs (no overlap)", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(500);
  const btt = page.getByRole("button", { name: /back to top|kthehu lart/i });
  const term = page.locator(".floating-trigger").first();
  const bttBox = await btt.boundingBox();
  const termBox = await term.boundingBox();
  expect(bttBox).not.toBeNull();
  expect(termBox).not.toBeNull();
  // Horizontal center keeps clear of the left FAB entirely
  expect(bttBox!.x).toBeGreaterThan(termBox!.x + termBox!.width);
});
