import type { z } from "zod";

/**
 * Provider-agnostic AI interface. The app talks only to this interface, so a
 * free hosted provider can be added in one file without touching features.
 * Private keys are read from server environment variables only.
 */

export type AiConfigurationStatus = {
  configured: boolean;
  providerId: string | null;
  /** Shown in the studio, e.g. "Not configured" or "[TEST] Mock provider". */
  label: string;
  /** True for the test-only mock provider. Its output is never real AI. */
  isTestProvider: boolean;
  message: string;
};

export type StructuredRequest<T> = {
  /** Identifies the job, e.g. "page-edit". The mock provider uses it to pick a test response. */
  task: string;
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  /** Structured input the mock provider can read (real providers use the prompt). */
  context?: unknown;
};

export interface AiProvider {
  readonly id: string;
  getConfigurationStatus(): AiConfigurationStatus;
  checkAvailability(): Promise<{ ok: boolean; message: string }>;
  generateText(input: { task: string; system: string; prompt: string; maxOutputTokens?: number }): Promise<string>;
  /** Returns output that has already passed the given schema, or throws. Never invents a fallback. */
  generateStructuredOutput<T>(input: StructuredRequest<T>): Promise<T>;
}

export class AiNotConfiguredError extends Error {
  constructor() {
    super("No AI provider is configured.");
  }
}
