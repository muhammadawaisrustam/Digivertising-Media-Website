import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PASSWORD = "e2e-studio-password";

async function signIn(page: Page) {
  await page.goto("/studio/login");
  await page.getByLabel("Studio password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/studio$/);
}

test.describe("studio", () => {
  test.skip(({ isMobile }) => isMobile, "The studio is tested on desktop.");

  test("is blocked without signing in, and never indexed", async ({ page }) => {
    for (const path of ["/studio", "/studio/pages", "/studio/leads", "/studio/pages/home/en", "/studio/preview/home/en"]) {
      const res = await page.goto(path);
      await expect(page).toHaveURL(/\/studio\/login$/);
      expect(res?.status()).toBe(200);
    }
    const res = await page.request.get("/studio/login");
    expect(res.headers()["x-robots-tag"]).toContain("noindex");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const arabic = await page.request.get("/ar/studio", { maxRedirects: 0 });
    expect(arabic.status()).toBe(308);
  });

  test("rejects a wrong password", async ({ page }) => {
    await page.goto("/studio/login");
    await page.getByLabel("Studio password").fill("not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.locator("#login-error")).toHaveText("That password is not correct.");
  });

  test("dashboard shows the test AI provider clearly labelled", async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByTestId("dashboard-ai")).toContainText("[TEST] Mock provider");
  });

  test("create, edit, reorder, validate, save, preview and publish a landing page", async ({ page }, info) => {
    const slug = `e2e-${info.project.name}-${Date.now()}`;
    await signIn(page);
    await page.goto("/studio/pages");
    await page.getByLabel("Page title").fill("E2E landing page");
    await page.getByLabel(/^Address/).fill(slug);
    await page.getByRole("button", { name: "Create draft" }).click();
    await expect(page).toHaveURL(`/studio/pages/${slug}/en`);

    // Not visible to the public before publishing.
    const before = await page.request.get(`/landing/${slug}`);
    expect(before.status()).not.toBe(500);
    expect(await before.text()).not.toContain("Fresh E2E heading");

    // Edit the hero heading.
    const blocks = page.getByTestId("editor-block");
    await expect(blocks).toHaveCount(2);
    const heading = page.getByLabel(/^Heading/).first();
    await heading.fill("");
    await expect(page.getByText("This field is required.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save draft", exact: true })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Publish", exact: true })).toBeDisabled();
    await heading.fill("Fresh E2E heading");
    await expect(page.getByTestId("editor-status")).toContainText("Unsaved changes");

    // Add an FAQ block and move it up with the button.
    await page.getByLabel("Block type to add").selectOption("faq");
    await page.getByRole("button", { name: "+ Add block" }).click();
    await expect(blocks).toHaveCount(3);
    await expect(blocks.nth(2)).toHaveAttribute("data-block-type", "faq");
    await page.getByRole("button", { name: "Move Frequently asked questions up" }).click();
    await expect(blocks.nth(1)).toHaveAttribute("data-block-type", "faq");

    // Reorder with the keyboard via the drag handle.
    const handle = blocks.nth(1).getByRole("button", { name: /Drag to reorder/ });
    await handle.focus();
    // dnd-kit measures positions between key presses, so give it a moment.
    await page.keyboard.press("Space");
    await page.waitForTimeout(300);
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(300);
    await page.keyboard.press("Space");
    await expect(blocks.nth(2)).toHaveAttribute("data-block-type", "faq");

    // Save the draft and check the preview frame.
    await page.getByRole("button", { name: "Save draft", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Draft saved" })).toBeVisible();
    await expect(page.getByTestId("editor-status")).toContainText("Draft saved (not live)");
    const frame = page.frameLocator("iframe[title^='Preview of']");
    await expect(frame.getByRole("heading", { level: 1 })).toHaveText("Fresh E2E heading");
    await expect(frame.getByText("Preview of the saved draft")).toBeVisible();

    // Still not public.
    expect(await (await page.request.get(`/landing/${slug}`)).text()).not.toContain("Fresh E2E heading");

    // Publish.
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Published" })).toBeVisible();
    await expect(page.getByTestId("revisions").getByRole("listitem")).toHaveCount(1);

    const live = await page.request.get(`/landing/${slug}`);
    expect(live.status()).toBe(200);
    const html = await live.text();
    expect(html).toContain("Fresh E2E heading");
    expect(html.indexOf("Frequently asked questions")).toBeGreaterThan(html.indexOf("Ready to talk?"));
  });

  test("AI suggestions are shown as a diff and only change the editor when applied", async ({ page }) => {
    await signIn(page);
    await page.goto("/studio/pages/about/en");
    await expect(page.getByTestId("ai-status")).toHaveText("[TEST] Mock provider");
    const title = page.getByLabel(/^Heading/).first();
    const original = await title.inputValue();

    await page.getByLabel(/Describe the change you want/).fill("Make the heading more direct.");
    await page.getByRole("button", { name: "Suggest changes" }).click();
    const suggestion = page.getByTestId("ai-suggestion");
    await expect(suggestion).toContainText("[TEST] Sample output from the test provider. Not real AI.");
    await expect(suggestion.getByTestId("ai-diff")).toContainText(`+ [TEST] ${original}`);
    // Nothing changed yet.
    await expect(title).toHaveValue(original);
    await expect(page.getByTestId("editor-status")).not.toContainText("Unsaved changes");

    await suggestion.getByRole("button", { name: "Apply to editor" }).click();
    await expect(title).toHaveValue(`[TEST] ${original}`);
    await expect(page.getByTestId("editor-status")).toContainText("Unsaved changes");
    // The live page is untouched.
    expect(await (await page.request.get("/about")).text()).not.toContain("[TEST]");
  });

  test("editor has no serious accessibility problems", async ({ page }) => {
    await signIn(page);
    await page.goto("/studio/pages/home/en");
    await expect(page.getByTestId("block-list")).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).exclude("iframe").analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });

  test("leads from the website appear in the studio", async ({ page }) => {
    // Submit an enquiry first so this test does not depend on test order.
    await page.goto("/contact");
    await page.getByLabel("Your name").fill("Lead Visibility Tester");
    await page.getByRole("textbox", { name: "Email" }).fill("lead-visibility@example.com");
    await page.getByLabel("How can we help?").fill("Checking that leads show up in the studio.");
    await page.getByRole("checkbox", { name: /I agree/ }).check();
    await page.waitForTimeout(3200);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("received");

    await signIn(page);
    await page.goto("/studio/leads");
    await expect(page.getByTestId("lead-list")).toContainText("Lead Visibility Tester");
  });
});

test.describe("studio without AI configured", () => {
  test.skip(({ isMobile }) => isMobile, "The studio is tested on desktop.");

  test("says honestly that AI is not configured", async ({ page, baseURL }) => {
    const port = Number(new URL(baseURL!).port) + 1;
    const base = `http://localhost:${port}`;
    await page.goto(`${base}/studio/login`);
    await page.getByLabel("Studio password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(`${base}/studio`);
    await expect(page.getByTestId("dashboard-ai")).toContainText("Not configured");
    await page.goto(`${base}/studio/pages/home/en`);
    await expect(page.getByTestId("ai-status")).toHaveText("Not configured");
    await expect(page.getByTestId("ai-panel")).toContainText("No AI provider is connected yet");
    await expect(page.getByRole("button", { name: "Suggest changes" })).toHaveCount(0);
  });
});
