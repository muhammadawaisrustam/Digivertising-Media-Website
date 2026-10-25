import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";

export const PASSWORD = "local-e2e-password-123";
export const ACCOUNTS_FILE = ".data-e2e-supabase/accounts.json";
export type Accounts = { owner: string; editor: string; viewer: string; pending: string };

export const accounts = (): Accounts => JSON.parse(readFileSync(ACCOUNTS_FILE, "utf8"));

export async function signIn(page: Page, email: string, password = PASSWORD) {
  await page.goto("/studio/login");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}
