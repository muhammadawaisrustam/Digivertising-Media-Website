import { expect, test } from "@playwright/test";

// The server rejects forms submitted faster than a person could fill them in.
const humanPause = (page: import("@playwright/test").Page) => page.waitForTimeout(3200);

test.describe("contact form", () => {
  test("shows errors for missing fields, then sends", async ({ page }) => {
    await page.goto("/contact");
    const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Send message" }) });
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(form.getByText("Please fix the highlighted fields.")).toBeVisible();
    await expect(form.getByText("Please enter your name.")).toBeVisible();
    await expect(form.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(form.getByText("Please confirm you agree")).toBeVisible();

    await form.getByLabel("Your name").fill("E2E Contact Tester");
    await form.getByRole("textbox", { name: "Email" }).fill("e2e-contact@example.com");
    await form.getByLabel("How can we help?").fill("This is an automated end-to-end test message.");
    await form.getByRole("checkbox", { name: /I agree/ }).check();
    await humanPause(page);
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("Your message has been received");
  });

  test("rejects a filled-in honeypot as spam", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Your name").fill("Bot");
    await page.getByRole("textbox", { name: "Email" }).fill("bot@example.com");
    await page.getByLabel("How can we help?").fill("Spam spam spam spam spam.");
    await page.getByRole("checkbox", { name: /I agree/ }).check();
    await page.locator('input[name="company_website"]').fill("https://spam.example", { force: true });
    await humanPause(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Your submission could not be accepted")).toBeVisible();
  });
});

test.describe("proposal assistant", () => {
  test("walks through all steps and shows an honest automated summary", async ({ page }) => {
    await page.goto("/request-a-proposal");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Plan your project in five short steps");

    // Step 1: required fields are checked before moving on.
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await page.getByLabel("Your name").fill("E2E Proposal Tester");
    await page.getByRole("textbox", { name: "Email" }).fill("e2e-proposal@example.com");
    await page.getByLabel(/^Country/).fill("Germany");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2: services
    await expect(page.locator("#main").getByRole("heading", { name: "Services", level: 2 })).toBeFocused();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Choose at least one service.")).toBeVisible();
    await page.getByRole("checkbox", { name: "Search Engine Optimisation (SEO)" }).check();
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 3: goals
    await page.getByLabel(/What do you want to achieve/).fill("More qualified enquiries from Germany for our B2B software product.");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 4: scope and budget
    await page.getByLabel("Preferred timeline").selectOption("1-3-months");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 5: review, consent required
    await expect(page.getByRole("heading", { name: "Check your details" })).toBeVisible();
    await expect(page.getByText("e2e-proposal@example.com")).toBeVisible();
    await expect(page.getByText("Within 1 to 3 months")).toBeVisible();
    await humanPause(page);
    await page.getByRole("button", { name: "Submit request" }).click();
    await expect(page.getByText("Please confirm you agree")).toBeVisible();
    await page.getByRole("checkbox", { name: /I agree/ }).check();
    await page.getByRole("button", { name: "Submit request" }).click();

    const result = page.getByRole("status");
    await expect(result.getByRole("heading", { name: /your request has been received/ })).toBeVisible();
    await expect(result.getByText("Reference")).toBeVisible();
    await expect(result.getByText("Automated qualification")).toBeVisible();
    await expect(result.getByText("Indicative planning")).toBeVisible();
    await expect(result.getByText("Human-reviewed proposal")).toBeVisible();
    await expect(result.getByText(/It is not a quote or a commitment/)).toBeVisible();
    // Missing website is flagged rather than guessed.
    await expect(result.getByText("Current website or relevant links")).toBeVisible();
  });

  test("Arabic version is right-to-left and translated", async ({ page }) => {
    await page.goto("/ar/request-a-proposal");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("خطط لمشروعك في خمس خطوات قصيرة");
    await expect(page.getByRole("button", { name: "متابعة" })).toBeVisible();
  });
});
