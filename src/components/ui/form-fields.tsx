"use client";

import { useId } from "react";

const inputCls =
  "mt-2 block w-full rounded-xl border bg-ink-900/70 px-4 py-3 text-fg placeholder:text-subtle transition-colors focus:border-signal-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-pulse-400";

function borderFor(error?: string) {
  return error ? "border-danger/70" : "border-line-strong";
}

type Base = { label: string; name: string; error?: string; hint?: string; required?: boolean; optionalLabel?: string };

function Label({ htmlFor, label, required, optionalLabel }: { htmlFor: string; label: string; required?: boolean; optionalLabel?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-fg">
      {label}
      {required ? <span aria-hidden="true" className="text-pulse-300"> *</span> : optionalLabel ? <span className="font-normal text-subtle"> ({optionalLabel})</span> : null}
    </label>
  );
}

function Help({ id, hint, error }: { id: string; hint?: string; error?: string }) {
  return (
    <>
      {hint ? <p id={`${id}-hint`} className="mt-1.5 text-sm text-subtle">{hint}</p> : null}
      {error ? <p id={`${id}-error`} className="mt-1.5 text-sm text-danger" role="alert">{error}</p> : null}
    </>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  return [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
}

export function TextField({ label, name, error, hint, required, optionalLabel, ...rest }: Base & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} label={label} required={required} optionalLabel={optionalLabel} />
      <input id={id} name={name} required={required} aria-invalid={Boolean(error)} aria-describedby={describedBy(id, hint, error)} className={`${inputCls} ${borderFor(error)}`} {...rest} />
      <Help id={id} hint={hint} error={error} />
    </div>
  );
}

export function TextArea({ label, name, error, hint, required, optionalLabel, ...rest }: Base & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} label={label} required={required} optionalLabel={optionalLabel} />
      <textarea id={id} name={name} required={required} rows={4} aria-invalid={Boolean(error)} aria-describedby={describedBy(id, hint, error)} className={`${inputCls} ${borderFor(error)}`} {...rest} />
      <Help id={id} hint={hint} error={error} />
    </div>
  );
}

export function SelectField({ label, name, error, hint, required, optionalLabel, options, ...rest }: Base & { options: { value: string; label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} label={label} required={required} optionalLabel={optionalLabel} />
      <select id={id} name={name} required={required} aria-invalid={Boolean(error)} aria-describedby={describedBy(id, hint, error)} className={`${inputCls} ${borderFor(error)}`} {...rest}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Help id={id} hint={hint} error={error} />
    </div>
  );
}

export function CheckboxGroup({ legend, name, options, value, onChange, error, required }: {
  legend: string; name: string; options: { value: string; label: string; group?: string }[]; value: string[]; onChange: (v: string[]) => void; error?: string; required?: boolean;
}) {
  const id = useId();
  const groups = [...new Set(options.map((o) => o.group ?? ""))];
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="text-sm font-medium text-fg">
        {legend}
        {required ? <span aria-hidden="true" className="text-pulse-300"> *</span> : null}
      </legend>
      {groups.map((g) => (
        <div key={g} className="mt-4">
          {g ? <p className="mb-2 text-xs font-semibold tracking-wide text-subtle">{g}</p> : null}
          <div className="grid gap-2 sm:grid-cols-2">
            {options.filter((o) => (o.group ?? "") === g).map((o) => {
              const checked = value.includes(o.value);
              return (
                <label key={o.value} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${checked ? "border-signal-400/60 bg-signal-500/10 text-fg" : "border-line-strong text-muted hover:text-fg"}`}>
                  <input
                    type="checkbox"
                    name={name}
                    value={o.value}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked ? [...value, o.value] : value.filter((v) => v !== o.value))}
                    className="h-4 w-4 accent-[#4c7dff]"
                  />
                  {o.label}
                </label>
              );
            })}
          </div>
        </div>
      ))}
      {error ? <p id={`${id}-error`} className="mt-2 text-sm text-danger" role="alert">{error}</p> : null}
    </fieldset>
  );
}

/** Hidden from people (and screen readers); bots that fill every field reveal themselves. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -start-[10000px] h-px w-px overflow-hidden">
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
