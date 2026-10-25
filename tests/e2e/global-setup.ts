import { rm } from "node:fs/promises";

/** Start every run with empty test data. */
export default async function globalSetup() {
  await rm(".data-e2e", { recursive: true, force: true });
  await rm(".data-e2e-noai", { recursive: true, force: true });
}
