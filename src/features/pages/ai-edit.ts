import "server-only";
import { z } from "zod";
import type { Locale } from "@/i18n/config";
import { registerMockHandler } from "@/lib/ai/mock-provider";
import type { AiProvider } from "@/lib/ai/types";
import { diffPages, type PageDiff } from "./diff";
import { pageLocaleContentSchema, type PageLocaleContent } from "./schema";

/**
 * AI-assisted page editing. The AI may only return page content in the block
 * format; the result is validated, protective flags are restored, and it is
 * shown to the owner as a diff and preview. Nothing is saved or published
 * until the owner applies it to the draft and publishes it themselves.
 * The AI never sees leads, credentials or code, and cannot run commands.
 */

export const MAX_INSTRUCTION = 1000;

const suggestionSchema = z.object({
  summary: z.string().trim().min(1).max(600),
  content: pageLocaleContentSchema,
});

export type PageEditSuggestion = { summary: string; content: PageLocaleContent; diff: PageDiff; isTest: boolean };

const SYSTEM = [
  "You edit pages of the Digivertising Media & PR website. You return JSON only, matching the given format: { summary, content }.",
  "content has the same shape as the input page: { meta: { title, description }, blocks: [...] }.",
  "Rules:",
  "- Change only what the instruction asks for. Keep every other block and field exactly as it is.",
  "- Keep the id of every existing block. New blocks need a new unique id (letters, numbers, - or _, 4 to 40 characters).",
  "- Use only these block types: hero, text, imageText, serviceGrid, featureList, process, testimonial, caseStudy, faq, cta, contactForm, visual.",
  "- Never invent testimonials, client names, case studies, statistics, awards, rankings or guarantees.",
  "- Links must be site paths like /contact or full https:// addresses.",
  "- Write in the page's language. Keep the brand tone: clear, confident, honest, no hype.",
  "- summary: one or two sentences describing what you changed.",
].join("\n");

/** Re-applies values the AI is never allowed to change. */
function protect(before: PageLocaleContent, after: PageLocaleContent): PageLocaleContent {
  const old = new Map(before.blocks.map((b) => [b.id, b]));
  return {
    ...after,
    blocks: after.blocks.map((b) => {
      const prev = old.get(b.id);
      if (b.type === "testimonial") {
        const confirmed = prev?.type === "testimonial" ? prev.data.permissionConfirmed : false;
        return { ...b, data: { ...b.data, permissionConfirmed: confirmed } };
      }
      if (b.type === "caseStudy") {
        const verified = prev?.type === "caseStudy" ? prev.data.verified : false;
        return { ...b, data: { ...b.data, verified } };
      }
      return b;
    }),
  };
}

export async function suggestPageEdit(provider: AiProvider, current: PageLocaleContent, instruction: string, locale: Locale): Promise<PageEditSuggestion> {
  const prompt = [
    `Page language: ${locale === "ar" ? "Arabic" : "English"}`,
    `Instruction from the site owner: ${instruction.slice(0, MAX_INSTRUCTION)}`,
    "Current page JSON:",
    JSON.stringify(current),
  ].join("\n\n");

  const raw = await provider.generateStructuredOutput({ task: "page-edit", system: SYSTEM, prompt, schema: suggestionSchema, context: { content: current, instruction } });
  const content = pageLocaleContentSchema.parse(protect(current, raw.content));
  return { summary: raw.summary, content, diff: diffPages(current, content), isTest: provider.getConfigurationStatus().isTestProvider };
}

/* Deterministic test response for the mock provider (AI_PROVIDER=mock only). */
registerMockHandler("page-edit", (context) => {
  const { content } = context as { content: PageLocaleContent };
  const next = structuredClone(content);
  const first = next.blocks.find((b) => "heading" in b.data || "title" in b.data);
  let changed = "nothing";
  if (first) {
    const data = first.data as Record<string, unknown>;
    const key = "title" in data ? "title" : "heading";
    const value = String(data[key] ?? "");
    if (!value.startsWith("[TEST]")) data[key] = `[TEST] ${value}`.slice(0, 140);
    changed = `the ${key} of the first ${first.type} block`;
  }
  return { summary: `[TEST] Sample suggestion from the mock provider: changed ${changed}. This is not real AI.`, content: next };
});
