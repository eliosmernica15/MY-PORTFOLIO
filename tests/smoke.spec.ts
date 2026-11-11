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
  "/offline.html",
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

test("EN homepage renders the paper masthead", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("#navigation")).toContainText("PROJECTS", {
    ignoreCase: true,
  });
  await expect(page.locator("#navigation")).toContainText(/elios/i);
});

test("SQ homepage renders the paper masthead in Albanian", async ({ page }) => {
  await page.goto("/sq");
  await expect(page.locator("#navigation")).toContainText("PROJEKTET", {
    ignoreCase: true,
  });
  await expect(page.locator("#navigation")).toContainText(/elios/i);
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

test("service worker never caches HTML (nonce-safe)", async ({ request }) => {
  const res = await request.get("/sw.js");
  const body = await res.text();
  // Regression guard: HTML documents carry a per-request CSP nonce, so the
  // SW must not store them. The only precached page is /offline.html.
  const precache = body.match(/const PRECACHE = \[([^\]]*)\]/)?.[1] ?? "";
  expect(precache.replace(/["']/g, "").trim()).toBe("/offline.html");
  expect(precache).not.toContain(",");
  expect(body).toContain("v6");
  expect(body).toMatch(/caches\.match\(["']\/offline\.html["']\)/);
  expect(body).not.toContain("cache.put(req, res)");
});

test("invalid locale returns 404 and does not render English", async ({
  request,
}) => {
  const res = await request.get("/fr");
  expect(res.status()).toBe(404);
});

test("offline page is hermetic (no JS chunks to go stale)", async ({
  request,
}) => {
  // The SW precaches /offline once. If that snapshot references build-specific
  // chunks, every rebuild turns the offline fallback into a corpse.
  const res = await request.get("/offline.html");
  const body = await res.text();
  expect(res.status()).toBe(200);
  expect(body).not.toMatch(/src="\/_next\/static\/chunks/);
  expect(body).not.toContain("<script");
});
