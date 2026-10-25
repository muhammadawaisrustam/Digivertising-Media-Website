import { defineConfig, devices } from "@playwright/test";

/**
 * Studio accounts in Supabase mode, against a LOCAL Supabase-compatible stack
 * (docs/supabase.md, "Testing against a local copy"). Needs LOCAL_SUPABASE_URL,
 * LOCAL_SUPABASE_ANON_KEY and LOCAL_SUPABASE_SERVICE_KEY. Never the live project.
 *   npm run build && npx playwright test -c playwright.supabase.config.ts
 */
const PORT = Number(process.env.E2E_SUPABASE_PORT ?? 3102);
const url = process.env.LOCAL_SUPABASE_URL ?? "";
if (!/^http:\/\/(127\.0\.0\.1|localhost)[:/]/.test(url)) throw new Error("Set LOCAL_SUPABASE_URL to a local stack (see docs/supabase.md).");

export default defineConfig({
  testDir: "tests/e2e-supabase",
  globalSetup: "./tests/e2e-supabase/global-setup.ts",
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      SUPABASE_URL: url,
      SUPABASE_PUBLISHABLE_KEY: process.env.LOCAL_SUPABASE_ANON_KEY ?? "",
      SUPABASE_SECRET_KEY: process.env.LOCAL_SUPABASE_SERVICE_KEY ?? "",
      FORM_RATE_LIMIT: "500",
      LOGIN_RATE_LIMIT: "500",
    },
  },
});
