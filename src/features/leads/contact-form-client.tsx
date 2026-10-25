"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { CheckboxGroup, Honeypot, TextArea, TextField } from "@/components/ui/form-fields";
import type { Locale } from "@/i18n/config";
import { sendContactAction } from "./actions";
import type { FormCopy } from "./form-copy";
import { contactInputSchema, fieldErrors } from "./schema";

type Props = {
  locale: Locale;
  copy: FormCopy;
  services: { value: string; label: string; group: string }[];
  privacyHref: string;
  proposalHref: string;
  disabled: boolean;
};

export function ContactFormClient({ locale, copy, services, privacyHref, proposalHref, disabled }: Props) {
  const [values, setValues] = useState({ name: "", email: "", businessName: "", message: "", services: [] as string[], consent: false, companyWebsite: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [pending, startTransition] = useTransition();
  const startedAt = useRef<number | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  // Time the form was shown; very fast submissions are treated as bots on the server.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const msg = (code?: string) => (code ? (copy.errors as Record<string, string>)[code] ?? copy.errors.invalid : undefined);

  const set = <K extends keyof typeof values>(k: K, v: (typeof values)[K]) => {
    startedAt.current ??= Date.now();
    setValues((s) => ({ ...s, [k]: v }));
  };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    const payload = { ...values, locale, startedAt: startedAt.current ?? Date.now() };
    const local = contactInputSchema.safeParse(payload);
    if (!local.success) {
      const errs = fieldErrors(local.error);
      if (!errs.companyWebsite) {
        setErrors(errs);
        setFormError(copy.errors.fixBelow);
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
    }
    setErrors({});
    setFormError("");
    startTransition(async () => {
      const res = await sendContactAction(payload);
      if (res.ok) {
        setStatus("done");
      } else {
        setErrors(res.fieldErrors);
        setFormError(res.formError ? copy.errors[res.formError] : copy.errors.fixBelow);
        setStatus("error");
        requestAnimationFrame(() => summaryRef.current?.focus());
      }
    });
  }

  if (status === "done") {
    return (
      <div role="status" className="card border-success/40 p-6 text-fg">
        <p className="font-semibold text-success">✓ {copy.contact.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5" aria-describedby={formError ? "contact-form-error" : undefined}>
      <div ref={summaryRef} tabIndex={-1} id="contact-form-error" aria-live="assertive">
        {formError ? <p className="rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger">{formError}</p> : null}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label={copy.fields.name} name="name" autoComplete="name" required value={values.name} onChange={(e) => set("name", e.target.value)} error={msg(errors.name)} />
        <TextField label={copy.fields.email} name="email" type="email" autoComplete="email" required value={values.email} onChange={(e) => set("email", e.target.value)} error={msg(errors.email)} dir="ltr" />
      </div>
      <TextField label={copy.fields.businessName} name="businessName" autoComplete="organization" optionalLabel={copy.fields.optional} value={values.businessName} onChange={(e) => set("businessName", e.target.value)} error={msg(errors.businessName)} />
      <details className="rounded-xl border border-line p-4">
        <summary className="cursor-pointer text-sm font-medium text-fg">{copy.fields.services} <span className="font-normal text-subtle">({copy.fields.optional})</span></summary>
        <div className="mt-2">
          <CheckboxGroup legend={copy.fields.services} name="services" options={services} value={values.services} onChange={(v) => set("services", v)} error={msg(errors.services)} />
        </div>
      </details>
      <TextArea label={copy.fields.message} name="message" required rows={5} value={values.message} onChange={(e) => set("message", e.target.value)} error={msg(errors.message)} />
      <Honeypot value={values.companyWebsite} onChange={(v) => set("companyWebsite", v)} />
      <div>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="consent" checked={values.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={Boolean(errors.consent)} className="mt-0.5 h-4 w-4 accent-[#4c7dff]" />
          <span>
            {copy.fields.consent} <Link href={privacyHref} className="text-signal-300 underline">{copy.fields.privacy}</Link>.
          </span>
        </label>
        {errors.consent ? <p className="mt-1.5 text-sm text-danger" role="alert">{msg(errors.consent)}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={pending || disabled} aria-disabled={pending || disabled}>
          {pending ? copy.contact.sending : copy.contact.submit}
        </button>
        {disabled ? <span className="text-sm text-subtle">{copy.contact.previewDisabled}</span> : null}
      </div>
      <p className="text-sm text-muted">
        {copy.contact.proposalPrompt} <Link href={proposalHref} className="text-signal-300 underline">{copy.contact.proposalLink}</Link>
      </p>
    </form>
  );
}
