import { expect, test } from "@playwright/test";
import { accounts, signIn } from "./helpers";

test.describe("studio accounts (Supabase mode, local stack)", () => {
  test("asks for email and password, with one error message for every failure", async ({ page }) => {
    await signIn(page, accounts().owner, "wrong-password-000");
    await expect(page.locator("#login-error")).toHaveText("Email or password is not correct.");
    await signIn(page, "nobody@example.test", "wrong-password-000");
    await expect(page.locator("#login-error")).toHaveText("Email or password is not correct.");
  });

  test("keeps pending accounts out", async ({ page }) => {
    await signIn(page, accounts().pending);
    await expect(page.locator("#login-error")).toContainText("waiting for the owner");
    await page.goto("/studio");
    await expect(page).toHaveURL(/\/studio\/login$/);
  });

  test("owner sees everything, and a website enquiry is stored in Supabase", async ({ page }) => {
    const marker = `Supabase e2e enquiry ${Date.now()}`;
    await page.goto("/contact");
    const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Send message" }) });
    await form.getByLabel("Your name").fill("E2E Supabase");
    await form.getByRole("textbox", { name: "Email" }).fill("e2e@example.test");
    await form.getByLabel("How can we help?").fill(marker);
    await form.getByRole("checkbox", { name: /I agree/ }).check();
    await page.waitForTimeout(3500); // the form ignores submissions faster than a person could type
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("Your message has been received");

    await signIn(page, accounts().owner);
    await expect(page).toHaveURL(/\/studio$/);
    await expect(page.getByTestId("studio-user")).toContainText("owner");
    await expect(page.getByTestId("dashboard-storage")).toHaveText("Supabase database");
    await page.getByRole("link", { name: "Leads" }).click();
    await expect(page.getByText(marker)).toBeVisible();
  });

  test("editor can edit pages but not see enquiries", async ({ page }) => {
    await signIn(page, accounts().editor);
    await expect(page).toHaveURL(/\/studio$/);
    await expect(page.getByRole("navigation", { name: "Studio" }).getByRole("link", { name: "Leads" })).toHaveCount(0);
    await page.goto("/studio/leads");
    await expect(page).toHaveURL(/\/studio\?denied=1$/);
    await expect(page.getByRole("status").filter({ hasText: "does not have access" })).toBeVisible();

    const slug = `sb-e2e-${Date.now()}`;
    await page.goto("/studio/pages");
    await page.getByLabel("Page title").fill("Supabase E2E page");
    await page.getByLabel(/^Address/).fill(slug);
    await page.getByRole("button", { name: "Create draft" }).click();
    await expect(page).toHaveURL(`/studio/pages/${slug}/en`);
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Published" })).toBeVisible();
    await expect(page.getByTestId("revisions").getByRole("listitem")).toHaveCount(1);
  });

  test("viewer can look at pages but cannot open the editor or create pages", async ({ page }) => {
    await signIn(page, accounts().viewer);
    await expect(page).toHaveURL(/\/studio$/);
    await page.goto("/studio/pages");
    await expect(page.getByRole("heading", { name: "Pages" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create draft" })).toHaveCount(0);
    await page.goto("/studio/pages/home/en");
    await expect(page).toHaveURL(/\/studio\?denied=1$/);
  });

  test("sign out ends the Supabase session", async ({ page }) => {
    await signIn(page, accounts().owner);
    await expect(page).toHaveURL(/\/studio$/);
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/studio\/login$/);
    await page.goto("/studio");
    await expect(page).toHaveURL(/\/studio\/login$/);
  });
});
