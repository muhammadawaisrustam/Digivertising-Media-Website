import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/paths";
import { ContactFormClient } from "./contact-form-client";
import { formCopy } from "./form-copy";
import { serviceOptions } from "./service-options";

export function ContactForm({ locale, disabled = false }: { locale: Locale; disabled?: boolean }) {
  return (
    <ContactFormClient
      locale={locale}
      copy={formCopy[locale]}
      services={serviceOptions(locale)}
      privacyHref={localizedPath(locale, "/privacy")}
      proposalHref={localizedPath(locale, "/request-a-proposal")}
      disabled={disabled}
    />
  );
}
