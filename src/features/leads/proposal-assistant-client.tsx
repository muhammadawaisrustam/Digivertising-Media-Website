"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { CheckboxGroup, Honeypot, SelectField, TextArea, TextField } from "@/components/ui/form-fields";
import type { CategoryId } from "@/content/services";
import type { Locale } from "@/i18n/config";
import { sendProposalAction } from "./actions";
import type { FormCopy } from "./form-copy";
import type { Qualification } from "./qualification";
import { budgetOptions, fieldErrors, proposalInputSchema, timelineOptions } from "./schema";

type Props = {
  locale: Locale;
  copy: FormCopy;
  services: { value: string; label: string; group: string }[];
  categoryLabels: Record<CategoryId, string>;
  privacyHref: string;
};

type Values = {
  name: string; businessName: string; email: string; phone: string; country: string; timezone: string;
  services: string[]; goals: string; website: string; scope: string;
  timeline: (typeof timelineOptions)[number]; budget: (typeof budgetOptions)[number]; details: string;
  consent: boolean; companyWebsite: string;
};

/** Which fields each step asks for. The last step (review) holds consent. */
const stepFields: (keyof Values)[][] = [
  ["name", "businessName", "email", "phone", "country", "timezone"],
  ["services"],
  ["goals", "website"],
  ["scope", "timeline", "budget", "details"],
  ["consent"],
];

const initial: Values = {
  name: "", businessName: "", email: "", phone: "", country: "", timezone: "",
  services: [], goals: "", website: "", scope: "", timeline: "flexible", budget: "not-sure", details: "",
  consent: false, companyWebsite: "",
};

export function ProposalAssistantClient({ locale, copy, services, categoryLabels, privacyHref }: Props) {
  const p = copy.proposal;
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState<{ reference: string; qualification: Qualification } | null>(null);
  const [pending, startTransition] = useTransition();
  const startedAt = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Move focus to the new step's heading so keyboard and screen reader users know where they are.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, result]);

  const msg = (code?: string) => (code ? (copy.errors as Record<string, string>)[code] ?? copy.errors.invalid : undefined);
  const tzSuggested = useRef(false);
  const set = <K extends keyof Values>(k: K, v: Values[K]) =>
    setValues((s) => {
      const nextValues = { ...s, [k]: v };
      // On the first edit, suggest the visitor's time zone in the (visible, editable) field.
      if (!tzSuggested.current && k !== "timezone" && !s.timezone) {
        tzSuggested.current = true;
        nextValues.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      }
      return nextValues;
    });
  const payload = () => ({ ...values, locale, startedAt: startedAt.current || Date.now() });

  /** Validates only the fields on the given step. */
  function stepErrors(i: number): Record<string, string> {
    const parsed = proposalInputSchema.safeParse(payload());
    if (parsed.success) return {};
    const all = fieldErrors(parsed.error);
    return Object.fromEntries(Object.entries(all).filter(([k]) => stepFields[i]!.includes(k as keyof Values)));
  }

  function next() {
    const errs = stepErrors(step);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setFormError(copy.errors.fixBelow);
      return;
    }
    setFormError("");
    setStep((s) => Math.min(s + 1, stepFields.length - 1));
  }

  function back() {
    setErrors({});
    setFormError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit() {
    const errs = stepErrors(step);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setFormError(copy.errors.fixBelow);
      return;
    }
    setFormError("");
    startTransition(async () => {
      const res = await sendProposalAction(payload());
      if (res.ok) {
        setResult(res.data);
        return;
      }
      const fe = res.fieldErrors;
      setErrors(fe);
      setFormError(res.formError ? copy.errors[res.formError] : copy.errors.fixBelow);
      const badStep = stepFields.findIndex((fields) => fields.some((f) => fe[f]));
      if (badStep >= 0) setStep(badStep);
    });
  }

  if (result) {
    const q = result.qualification;
    return (
      <div role="status" className="space-y-6">
        <div className="card border-success/40 p-6 md:p-8">
          <h2 ref={headingRef} tabIndex={-1} className="text-h3 text-success focus:outline-none">✓ {p.resultTitle}</h2>
          <p className="mt-3 text-muted">{p.resultLead}</p>
          <p className="mt-4 text-sm text-subtle">
            {p.reference}: <span dir="ltr" className="font-mono font-semibold text-fg">{result.reference}</span>
          </p>
        </div>

        <p className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-fg">{p.disclaimer}</p>

        <section className="card p-6 md:p-8" aria-labelledby="q-auto">
          <p className="badge">{p.automatedLabel}</p>
          <h3 id="q-auto" className="text-h3 mt-3">{p.categories}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {q.categories.map((c) => <li key={c} className="rounded-full border border-line-strong px-3 py-1 text-sm">{categoryLabels[c]}</li>)}
          </ul>
          <h3 className="mt-6 font-semibold">{p.missingTitle}</h3>
          {q.missingInfo.length ? (
            <ul className="mt-2 list-disc space-y-1 ps-5 text-muted">{q.missingInfo.map((m) => <li key={m}>{m}</li>)}</ul>
          ) : (
            <p className="mt-2 text-muted">{p.none}</p>
          )}
        </section>

        <section className="card p-6 md:p-8" aria-labelledby="q-plan">
          <p className="badge">{p.indicativeLabel}</p>
          <h3 id="q-plan" className="text-h3 mt-3">{p.scopeTitle}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {q.indicativeScope.map((s) => (
              <div key={s.service} className="rounded-xl border border-line p-4">
                <p className="font-semibold">{s.service}</p>
                <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-muted">{s.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
              </div>
            ))}
          </div>
          <h3 className="mt-6 font-semibold">{p.questionsTitle}</h3>
          <ol className="mt-2 list-decimal space-y-1 ps-5 text-muted">{q.discoveryQuestions.map((d) => <li key={d}>{d}</li>)}</ol>
        </section>

        <section className="card p-6 md:p-8" aria-labelledby="q-human">
          <p className="badge">{p.humanLabel}</p>
          <p id="q-human" className="mt-3 text-muted">{p.humanNext}</p>
        </section>
      </div>
    );
  }

  const isLast = step === stepFields.length - 1;
  const serviceLabel = (v: string) => services.find((s) => s.value === v)?.label ?? v;
  const show = (v: string) => v.trim() || p.notProvided;
  const review: { step: number; label: string; value: string }[] = [
    { step: 0, label: copy.fields.name, value: show(values.name) },
    { step: 0, label: copy.fields.businessName, value: show(values.businessName) },
    { step: 0, label: copy.fields.email, value: show(values.email) },
    { step: 0, label: copy.fields.phone, value: show(values.phone) },
    { step: 0, label: copy.fields.country, value: show(values.country) },
    { step: 0, label: copy.fields.timezone, value: show(values.timezone) },
    { step: 1, label: copy.fields.services, value: values.services.map(serviceLabel).join(", ") || p.notProvided },
    { step: 2, label: copy.fields.goals, value: show(values.goals) },
    { step: 2, label: copy.fields.website, value: show(values.website) },
    { step: 3, label: copy.fields.scope, value: show(values.scope) },
    { step: 3, label: copy.fields.timeline, value: copy.timeline[values.timeline] },
    { step: 3, label: copy.fields.budget, value: copy.budget[values.budget] },
    { step: 3, label: copy.fields.details, value: show(values.details) },
  ];

  return (
    <form
      noValidate
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        if (isLast) submit();
        else next();
      }}
    >
      <ol className="flex flex-wrap gap-2" aria-label={p.stepOf.replace("{n}", String(step + 1)).replace("{total}", String(stepFields.length))}>
        {p.steps.map((label, i) => (
          <li
            key={label}
            aria-current={i === step ? "step" : undefined}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${i === step ? "border-signal-400 bg-signal-500/15 text-fg" : i < step ? "border-success/40 text-success" : "border-line text-subtle"}`}
          >
            {i < step ? "✓ " : ""}
            {label}
          </li>
        ))}
      </ol>

      <div className="card mt-6 p-6 md:p-8">
        <p className="text-sm text-subtle">{p.stepOf.replace("{n}", String(step + 1)).replace("{total}", String(stepFields.length))}</p>
        <h2 ref={headingRef} tabIndex={-1} className="text-h3 mt-1 focus:outline-none">{isLast ? p.reviewTitle : p.steps[step]}</h2>

        <div aria-live="assertive">
          {formError ? <p className="mt-4 rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger">{formError}</p> : null}
        </div>

        <div className="mt-6 space-y-5">
          {step === 0 ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label={copy.fields.name} name="name" autoComplete="name" required value={values.name} onChange={(e) => set("name", e.target.value)} error={msg(errors.name)} />
                <TextField label={copy.fields.businessName} name="businessName" autoComplete="organization" optionalLabel={copy.fields.optional} value={values.businessName} onChange={(e) => set("businessName", e.target.value)} error={msg(errors.businessName)} />
                <TextField label={copy.fields.email} name="email" type="email" autoComplete="email" required dir="ltr" value={values.email} onChange={(e) => set("email", e.target.value)} error={msg(errors.email)} />
                <TextField label={copy.fields.phone} name="phone" type="tel" autoComplete="tel" dir="ltr" value={values.phone} onChange={(e) => set("phone", e.target.value)} error={msg(errors.phone)} />
                <TextField label={copy.fields.country} name="country" autoComplete="country-name" optionalLabel={copy.fields.optional} value={values.country} onChange={(e) => set("country", e.target.value)} error={msg(errors.country)} />
                <TextField label={copy.fields.timezone} name="timezone" optionalLabel={copy.fields.optional} dir="ltr" value={values.timezone} onChange={(e) => set("timezone", e.target.value)} error={msg(errors.timezone)} />
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <CheckboxGroup legend={copy.fields.services} name="services" required options={services} value={values.services} onChange={(v) => set("services", v)} error={msg(errors.services)} />
          ) : null}

          {step === 2 ? (
            <>
              <TextArea label={copy.fields.goals} name="goals" required rows={5} hint={copy.fields.goalsHint} value={values.goals} onChange={(e) => set("goals", e.target.value)} error={msg(errors.goals)} />
              <TextField label={copy.fields.website} name="website" optionalLabel={copy.fields.optional} dir="ltr" value={values.website} onChange={(e) => set("website", e.target.value)} error={msg(errors.website)} />
            </>
          ) : null}

          {step === 3 ? (
            <>
              <TextArea label={copy.fields.scope} name="scope" optionalLabel={copy.fields.optional} rows={4} value={values.scope} onChange={(e) => set("scope", e.target.value)} error={msg(errors.scope)} />
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label={copy.fields.timeline} name="timeline" value={values.timeline} onChange={(e) => set("timeline", e.target.value as Values["timeline"])} options={timelineOptions.map((o) => ({ value: o, label: copy.timeline[o] }))} error={msg(errors.timeline)} />
                <SelectField label={copy.fields.budget} name="budget" hint={copy.fields.budgetHint} value={values.budget} onChange={(e) => set("budget", e.target.value as Values["budget"])} options={budgetOptions.map((o) => ({ value: o, label: copy.budget[o] }))} error={msg(errors.budget)} />
              </div>
              <TextArea label={copy.fields.details} name="details" optionalLabel={copy.fields.optional} rows={3} value={values.details} onChange={(e) => set("details", e.target.value)} error={msg(errors.details)} />
            </>
          ) : null}

          {isLast ? (
            <>
              <p className="text-muted">{p.reviewLead}</p>
              <dl className="divide-y divide-line rounded-xl border border-line">
                {review.map((r) => (
                  <div key={r.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr_auto] sm:items-start sm:gap-4">
                    <dt className="text-sm text-subtle">{r.label}</dt>
                    <dd className="whitespace-pre-line break-words text-fg">{r.value}</dd>
                    <dd>
                      <button type="button" className="text-sm text-signal-300 underline" onClick={() => setStep(r.step)} aria-label={`${p.edit}: ${r.label}`}>
                        {p.edit}
                      </button>
                    </dd>
                  </div>
                ))}
              </dl>
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
            </>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" className="btn btn-secondary" onClick={back} disabled={pending}>
              {p.back}
            </button>
          ) : <span />}
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {isLast ? (pending ? p.sending : p.submit) : p.next}
          </button>
        </div>
      </div>
    </form>
  );
}
