import type { AiConfigurationStatus, AiProvider, StructuredRequest } from "./types";

/**
 * TEST-ONLY provider. Enabled only with AI_PROVIDER=mock (used by automated
 * tests). It returns fixed, clearly labelled "[TEST]" output and is never real
 * AI. Do not enable it on a live site.
 */
type Handler = (context: unknown) => unknown;
const handlers = new Map<string, Handler>();

/** Features register a deterministic test response for their task. */
export function registerMockHandler(task: string, handler: Handler) {
  handlers.set(task, handler);
}

export class MockAiProvider implements AiProvider {
  readonly id = "mock";

  getConfigurationStatus(): AiConfigurationStatus {
    return {
      configured: true,
      providerId: this.id,
      label: "[TEST] Mock provider",
      isTestProvider: true,
      message: "Test mode: suggestions are fixed sample output for automated tests, not real AI. Do not use on a live site.",
    };
  }

  async checkAvailability() {
    return { ok: true, message: "[TEST] Mock provider is always available." };
  }

  async generateText(input: { task: string }) {
    return `[TEST] Mock response for ${input.task}. This is not real AI output.`;
  }

  async generateStructuredOutput<T>(input: StructuredRequest<T>): Promise<T> {
    const handler = handlers.get(input.task);
    if (!handler) throw new Error(`[TEST] Mock provider has no test response for "${input.task}".`);
    // Validate exactly like a real provider's output would be.
    return input.schema.parse(handler(input.context));
  }
}
