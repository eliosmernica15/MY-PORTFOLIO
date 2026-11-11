/**
 * Smoke tests: verify the production build renders correctly end-to-end.
 *
 * What these catch: broken CSP, missing icons, SSR crashes, missing locale
 * toggles, stale service-worker nonce, contact API regressions. All of these
 * have crashed the live site at least once.
 *
 * Run with: npm run test:smoke
 */
import { test, expect } from "@playwright/test";

const PAGES = [
  "/",
  "/en",
  "/sq",
  "/notes",
  "/notes/why-i-built-apl",
  "/project/esmp",
  "/offline",
];

for (const path of PAGES) {
  test(`GET ${path} returns 200`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(200);
  });
}

test("home page has CSP header", async ({ request }) => {
  const res = await request.get("/");
  const csp = res.headers()["content-security-policy"];
  expect(csp).toBeTruthy();
  expect(csp).toContain("default-src 'self'");
});

test("home page has HSTS header", async ({ request }) => {
  const res = await request.get("/");
  const hsts = res.headers()["strict-transport-security"];
  expect(hsts).toBeTruthy();
});

test("/icon-192.png returns 200 image/png", async ({ request }) => {
  const res = await request.get("/icon-192.png");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});

test("/icon-512.png returns 200 image/png", async ({ request }) => {
  const res = await request.get("/icon-512.png");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});

test("manifest returns 200 with both icons", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.status()).toBe(200);
  const manifest = await res.json();
  const srcs = manifest.icons.map((i: { src: string }) => i.src);
  expect(srcs).toContain("/icon-192.png");
  expect(srcs).toContain("/icon-512.png");
});

test("contact API path does not exist as a public endpoint", async ({
  request,
}) => {
  // The contact form submits as a Next.js server action, not a public API
  // route. This test verifies /api/contact does not leak a public endpoint.
  const res = await request.post("/api/contact", {
    data: {
      name: "x",
      email: "bad",
      message: "short",
      company: "",
      formTime: 200,
    },
  });
  expect(res.status()).toBe(404);
});

test("EN homepage renders English nav", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("#navigation")).toContainText("HOME", {
    ignoreCase: true,
  });
});

test("SQ homepage renders Albanian nav", async ({ page }) => {
  await page.goto("/sq");
  await expect(page.locator("#navigation")).toContainText("Ballina", {
    ignoreCase: true,
  });
});

test("no console errors on homepage", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  expect(errors).toEqual([]);
});

test("service worker script is served with correct cache behavior", async ({
  request,
}) => {
  const res = await request.get("/sw.js");
  expect(res.status()).toBe(200);
  const cacheControl = res.headers()["cache-control"];
  // SW must be public, max-age=0, must-revalidate so browsers pick up updates
  expect(cacheControl).toContain("max-age=0");
});
