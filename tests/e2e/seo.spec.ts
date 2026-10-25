import { expect, test } from "@playwright/test";

const keyPages = ["/", "/about", "/services", "/services/seo", "/services/aeo-ai-search", "/contact"];

test.describe("SEO foundations", () => {
  test.skip(({ isMobile }) => isMobile, "metadata is identical on mobile");

  for (const path of keyPages) {
    for (const prefix of ["", "/ar"]) {
      const url = prefix + (path === "/" && prefix ? "" : path);
      test(`metadata on ${url || "/"}`, async ({ page }) => {
        await page.goto(url || "/");
        const title = await page.title();
        expect(title.length).toBeGreaterThan(10);
        const description = await page.locator('meta[name="description"]').getAttribute("content");
        expect(description?.length ?? 0).toBeGreaterThan(50);
        await expect(page.locator("h1")).toHaveCount(1);

        // Compare paths only: the absolute origin comes from NEXT_PUBLIC_SITE_URL at build time.
        const pathOf = async (selector: string) => new URL((await page.locator(selector).getAttribute("href"))!).pathname;
        const enPath = path;
        const arPath = path === "/" ? "/ar" : `/ar${path}`;
        expect(await pathOf('link[rel="canonical"]')).toBe(prefix ? arPath : enPath);
        expect(await pathOf('link[rel="alternate"][hreflang="en"]')).toBe(enPath);
        expect(await pathOf('link[rel="alternate"][hreflang="ar"]')).toBe(arPath);
        expect(await pathOf('link[rel="alternate"][hreflang="x-default"]')).toBe(enPath);
        await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
      });
    }
  }

  test("draft legal pages are noindex and excluded from the sitemap", async ({ page, request }) => {
    await page.goto("/privacy");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("/privacy");
  });

  test("sitemap lists both languages with alternates", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain("/services/seo</loc>");
    expect(xml).toContain("/ar/services/seo</loc>");
    expect(xml).toContain('hreflang="ar"');
    expect((xml.match(/<url>/g) ?? []).length).toBe(2 * (5 + 24)); // 5 main pages (incl. proposal assistant) + 24 services
  });

  test("robots.txt allows the site, blocks private areas and links the sitemap", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toContain("Allow: /");
    expect(txt).toContain("Disallow: /studio");
    expect(txt).toMatch(/Sitemap: .*\/sitemap\.xml/);
  });

  test("structured data is valid JSON and does not invent ratings or addresses", async ({ page }) => {
    for (const path of ["/", "/services/seo"]) {
      await page.goto(path);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(blocks.length).toBeGreaterThan(0);
      for (const b of blocks) {
        const json = JSON.stringify(JSON.parse(b));
        expect(json).not.toMatch(/aggregateRating|"review"|streetAddress/);
      }
    }
  });

  test("no broken internal links on key pages", async ({ page, request }) => {
    const seen = new Set<string>();
    for (const path of [...keyPages, "/ar", "/ar/services"]) {
      await page.goto(path);
      const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!));
      hrefs.forEach((h) => seen.add(h.split("#")[0]!));
    }
    for (const href of seen) {
      const res = await request.get(href);
      expect(res.status(), href).toBe(200);
    }
  });
});
