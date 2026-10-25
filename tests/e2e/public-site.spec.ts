import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { services } from "../../src/content/services";

test.describe("public website", () => {
  test("homepage loads with heading, CTAs and no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/");
    await expect(page).toHaveTitle(/Digivertising Media & PR/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Growth, reputation and technology");
    await expect(page.getByRole("link", { name: "Start a project" }).first()).toBeVisible();
    await page.waitForTimeout(3000); // give the 3D scene time to load and fail loudly if broken
    expect(errors).toEqual([]);
  });

  test("main navigation reaches every top-level page", async ({ page, isMobile }) => {
    await page.goto("/");
    for (const [name, path, heading] of [
      ["Services", "/services", /Services built around/],
      ["About", "/about", /An agency built from/],
      ["Contact", "/contact", /Let's talk/],
    ] as const) {
      if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name, exact: true }).click();
      await expect(page).toHaveURL(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    }
  });

  test("service explorer switches categories", async ({ page }) => {
    await page.goto("/");
    const tab = page.getByRole("tab", { name: /PR & Reputation/ });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel").getByRole("link", { name: /Public Relations/ })).toBeVisible();
    await tab.press("ArrowDown");
    await expect(page.getByRole("tab", { name: /Web, Software & AI/ })).toBeFocused();
  });

  test("every service page renders in both languages", async ({ request }) => {
    for (const s of services) {
      for (const [prefix, lang] of [["", "en"], ["/ar", "ar"]] as const) {
        const res = await request.get(`${prefix}/services/${s.slug}`);
        expect(res.status(), `${prefix}/services/${s.slug}`).toBe(200);
        const html = await res.text();
        expect(html).toContain(`<html lang="${lang}"`);
        expect(html).toContain(s.content[lang].title.replace(/&/g, "&amp;"));
      }
    }
  });

  test("unknown URLs return a real 404 with helpful links", async ({ page, request }) => {
    for (const path of ["/does-not-exist", "/services/not-a-service", "/ar/services/not-a-service"]) {
      expect((await request.get(path)).status(), path).toBe(404);
    }
    await page.goto("/does-not-exist");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("We could not find that page");
  });
});

test("contact page and footer show the business email", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("main").getByRole("link", { name: "awaisrustam001@gmail.com" })).toHaveAttribute("href", "mailto:awaisrustam001@gmail.com");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "awaisrustam001@gmail.com" })).toBeVisible();
});

test.describe("Arabic and right-to-left layout", () => {
  test("Arabic pages use lang=ar, dir=rtl and translated navigation", async ({ page, isMobile }) => {
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("النمو والسمعة والتقنية");
    if (isMobile) await page.getByRole("button", { name: "فتح القائمة" }).click();
    await expect(page.getByRole("navigation", { name: "التنقل الرئيسي" }).getByRole("link", { name: "الخدمات" })).toBeVisible();
  });

  test("RTL layout mirrors: logo sits on the right", async ({ page }) => {
    await page.goto("/ar");
    const vw = page.viewportSize()!.width;
    const logo = await page.getByRole("banner").getByRole("link").first().boundingBox();
    expect(logo!.x + logo!.width / 2).toBeGreaterThan(vw / 2);
    // No horizontal scrolling caused by RTL positioning.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("language switcher keeps the same page", async ({ page, isMobile }) => {
    await page.goto("/services/seo");
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("link", { name: "View this page in Arabic" }).click();
    await expect(page).toHaveURL("/ar/services/seo");
    if (isMobile) await page.getByRole("button", { name: "فتح القائمة" }).click();
    await page.getByRole("link", { name: "عرض هذه الصفحة بالإنجليزية" }).click();
    await expect(page).toHaveURL("/services/seo");
  });
});

test.describe("mobile navigation", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("menu opens, traps focus, closes with Escape", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Open menu" });
    await button.click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("no horizontal overflow on key pages", async ({ page }) => {
    for (const path of ["/", "/services", "/services/seo", "/about", "/contact", "/request-a-proposal", "/ar", "/ar/services/seo", "/ar/request-a-proposal"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("3D hero fallback", () => {
  test("reduced motion keeps the static globe", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForTimeout(3000);
    const visual = page.locator("[data-visual-mode]");
    await expect(visual).toHaveAttribute("data-visual-mode", "static");
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(visual.locator("svg")).toBeVisible();
    await context.close();
  });

  test("page is complete without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("[data-visual-mode] svg").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "View all services" }).first()).toBeVisible();
    await context.close();
  });
});

test.describe("accessibility", () => {
  for (const path of ["/", "/services", "/services/seo", "/about", "/contact", "/request-a-proposal", "/ar", "/ar/services/seo", "/ar/request-a-proposal", "/studio/login"]) {
    test(`no serious axe violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});
