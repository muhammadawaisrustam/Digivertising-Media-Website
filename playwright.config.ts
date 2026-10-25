import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const NO_AI_PORT = PORT + 1;

/** Test-only settings. Real secrets never go here: these values only exist for the local test servers. */
const testEnv = {
  STUDIO_PASSWORD: "e2e-studio-password",
  SESSION_SECRET: "e2e-session-secret-0123456789abcdef",
  FORM_RATE_LIMIT: "500",
  LOGIN_RATE_LIMIT: "500",
};

/**
 * End-to-end tests run against a production build:
 *   npm run build && npm run test:e2e
 * Two servers start: one with the test-only mock AI provider, one with no AI
 * configured (to check the honest "not configured" state).
 */
export default defineConfig({
  testDir: "tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: [
    {
      command: `npx next start -p ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: true,
      timeout: 60_000,
      env: { ...testEnv, AI_PROVIDER: "mock", DATA_DIR: ".data-e2e" },
    },
    {
      command: `npx next start -p ${NO_AI_PORT}`,
      url: `http://localhost:${NO_AI_PORT}`,
      reuseExistingServer: true,
      timeout: 60_000,
      env: { ...testEnv, DATA_DIR: ".data-e2e-noai" },
    },
  ],
});
