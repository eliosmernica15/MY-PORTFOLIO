import { test, expect } from "@playwright/test";

test.setTimeout(120_000);

async function passBoot(page: import("@playwright/test").Page) {
  // Boot auto-dismisses at ~1.15s (+280ms fade). Wait for it to detach;
  // fresh contexts replay the boot, returning visitors skip it entirely.
  const boot = page.getByRole("status", { name: /startup|nisjes/i });
  await boot.waitFor({ state: "detached", timeout: 4000 }).catch(() => {});
}

test("ELIOS/OS: dock opens windowed apps", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await passBoot(page);

  const dock = page.locator(
    'nav[aria-label="Personal operating environment"], nav[aria-label="Mjedis personal operativ"]',
  );

  // Finder via dock
  await dock.getByRole("button", { name: /finder/i }).click();
  const finder = page.getByRole("dialog", { name: "Finder" });
  await expect(finder).toBeVisible();
  await expect(finder.getByRole("listbox")).toBeVisible();
  await finder.getByRole("option", { name: /ESMP/i }).click();
  await expect(finder).toContainText("ESMP");
  // Esc closes the window
  await page.keyboard.press("Escape");
  await expect(finder).not.toBeVisible();

  // Hire Me via dock — qualifier flow
  await dock.getByRole("button", { name: /hire me/i }).click();
  const hire = page.getByRole("dialog", { name: /hire me/i });
  await expect(hire).toBeVisible();
  await expect(hire.getByText("Tell me what you're building.")).toBeVisible();
  await hire.getByRole("button", { name: /SaaS product/i }).click();
  await expect(
    hire.getByRole("button", { name: /SaaS product/i }),
  ).toHaveAttribute("aria-pressed", "true");
  // Skip the details — qualifier collapses
  await hire.getByRole("button", { name: /skip the details/i }).click();
  await expect(hire.getByText("Tell me what you're building.")).toBeVisible();
  await expect(hire.getByRole("button", { name: /SaaS product/i })).toHaveCount(
    0,
  );
  // Fill message + identity and submit
  await hire
    .locator("#hire-message")
    .fill(
      "I run a small studio and need an online storefront with payments and invoicing.",
    );
  await hire.locator("#hire-name").fill("Test Person");
  await hire.locator("#hire-email").fill("test@example.com");
  // Server enforces a min 2s behavioral window between first focus and submit
  await page.waitForTimeout(2300);
  await hire.getByRole("button", { name: /send inquiry/i }).click();
  // Local env has no SMTP/EmailJS → honest delivery error with mailto fallback
  await expect(
    hire.getByRole("alert").or(hire.getByText(/message sent/i)),
  ).toBeVisible({
    timeout: 15000,
  });

  // Mail via dock
  await page.keyboard.press("Escape");
  await dock.getByRole("button", { name: /^open mail/i }).click();
  const mail = page.getByRole("dialog", { name: /mail/i });
  await expect(mail).toBeVisible();
  await expect(mail.locator("#mail-to")).toContainText(
    "eliosmernica@gmail.com",
  );

  // About via dock
  await dock.getByRole("button", { name: /about this system/i }).click();
  const about = page.getByRole("dialog", { name: /about this system/i });
  await expect(about).toBeVisible();
  await expect(about).toContainText("Elios Mernica");
});

test("command palette opens with keyboard and runs", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await passBoot(page);

  await page.keyboard.press("Control+KeyK");
  const palette = page.getByRole("dialog", { name: /command palette/i });
  await expect(palette).toBeVisible();
  await page.keyboard.type("apl");
  await expect(palette).toContainText("A++(APL)");
  // Escape closes
  await page.keyboard.press("Escape");
  await expect(palette).not.toBeVisible();

  // Menu bar palette button opens it too
  await page
    .getByRole("button", { name: /command palette/i })
    .first()
    .click();
  await expect(
    page.getByRole("dialog", { name: /command palette/i }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
});

test("Albanian locale: dock + hire window in SQ", async ({ page }) => {
  await page.goto("/sq", { waitUntil: "domcontentloaded" });
  await passBoot(page);

  await expect(page.locator("#navigation")).toContainText("Desktopi");
  const dock = page.locator('nav[aria-label="Mjedis personal operativ"]');
  await dock.getByRole("button", { name: /punëso/i }).click();
  const hire = page.getByRole("dialog", { name: /punëso/i });
  await expect(hire).toBeVisible();
  await expect(hire.getByText("Më trego çfarë do të ndërtosh.")).toBeVisible();
  await expect(
    hire.getByRole("button", { name: /sa më shpejt/i }),
  ).toBeVisible();
});
