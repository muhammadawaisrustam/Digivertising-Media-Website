import type { CategoryId } from "@/content/services";
import { categoryOrder, serviceCategories } from "@/content/services";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/paths";
import { formCopy } from "./form-copy";
import { ProposalAssistantClient } from "./proposal-assistant-client";
import { serviceOptions } from "./service-options";

/** Server wrapper: prepares all text and options so the client bundle stays small. */
export function ProposalAssistant({ locale }: { locale: Locale }) {
  const categoryLabels = Object.fromEntries(categoryOrder.map((c) => [c, serviceCategories[c][locale].label])) as Record<CategoryId, string>;
  return (
    <ProposalAssistantClient
      locale={locale}
      copy={formCopy[locale]}
      services={serviceOptions(locale)}
      categoryLabels={categoryLabels}
      privacyHref={localizedPath(locale, "/privacy")}
    />
  );
}
