import "server-only";
import { MockAiProvider } from "./mock-provider";
import { AiNotConfiguredError, type AiConfigurationStatus, type AiProvider } from "./types";

/**
 * Picks the AI provider from server environment variables.
 * - AI_PROVIDER unset: no provider. Features show "AI not configured" honestly.
 * - AI_PROVIDER=mock: test-only provider with labelled sample output.
 * A free hosted provider will be added after the owner chooses one (see docs/ai.md).
 */
export function getAiProvider(): AiProvider | null {
  const id = process.env.AI_PROVIDER?.trim();
  if (id === "mock") return new MockAiProvider();
  return null;
}

export function requireAiProvider(): AiProvider {
  const provider = getAiProvider();
  if (!provider) throw new AiNotConfiguredError();
  return provider;
}

export function aiStatus(): AiConfigurationStatus {
  const provider = getAiProvider();
  if (provider) return provider.getConfigurationStatus();
  const unknown = process.env.AI_PROVIDER?.trim();
  return {
    configured: false,
    providerId: null,
    label: "Not configured",
    isTestProvider: false,
    message: unknown
      ? `AI_PROVIDER is set to "${unknown}", which this version does not support yet. AI features are switched off.`
      : "No AI provider is connected yet, so AI suggestions are switched off. Everything else in the editor works normally.",
  };
}

export { AiNotConfiguredError } from "./types";
