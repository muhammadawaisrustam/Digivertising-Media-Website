"use client";

import { useId, useState } from "react";
import type { Field, ItemField } from "./block-fields";

/** Form controls used by the block editor. Values are plain JSON. */

const inputCls =
  "mt-1.5 block w-full rounded-lg border border-line-strong bg-ink-950/70 px-3 py-2 text-sm text-fg focus:border-signal-400 focus:outline-none";

function Label({ id, label, required, hint, count, max }: { id: string; label: string; required?: boolean; hint?: string; count?: number; max?: number }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
        {required ? <span className="text-pulse-300" aria-hidden="true"> *</span> : null}
        {hint ? <span className="block text-xs font-normal text-subtle">{hint}</span> : null}
      </label>
      {max !== undefined && count !== undefined ? (
        <span className={`shrink-0 text-xs tabular-nums ${count > max ? "text-danger" : "text-subtle"}`}>
          {count}/{max}
        </span>
      ) : null}
    </div>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  return error ? <p id={`${id}-err`} className="mt-1 text-xs text-danger">{error}</p> : null;
}

export function TextInput({ label, value, onChange, max, required, hint, error, multiline, dir }: {
  label: string; value: string; onChange: (v: string) => void; max?: number; required?: boolean; hint?: string; error?: string; multiline?: boolean; dir?: "ltr" | "rtl";
}) {
  const id = useId();
  const common = {
    id,
    value,
    dir,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-err` : undefined,
    className: `${inputCls} ${error ? "border-danger/70" : ""}`,
  };
  return (
    <div>
      <Label id={id} label={label} required={required} hint={hint} count={value.length} max={max} />
      {multiline ? <textarea {...common} rows={4} onChange={(e) => onChange(e.target.value)} /> : <input {...common} type="text" onChange={(e) => onChange(e.target.value)} />}
      <ErrorText id={id} error={error} />
    </div>
  );
}

export function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const id = useId();
  return (
    <div>
      <Label id={id} label={label} />
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function CheckboxInput({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-line p-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#4c7dff]" />
      <span>
        <span className="font-medium text-fg">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-subtle">{hint}</span> : null}
      </span>
    </label>
  );
}

const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i]);

/** A list of strings edited as text: one per line, or paragraphs separated by blank lines. */
export function LinesInput({ label, hint, value, onChange, paragraphs, error }: { label: string; hint?: string; value: string[]; onChange: (v: string[]) => void; paragraphs?: boolean; error?: string }) {
  const id = useId();
  const sep = paragraphs ? "\n\n" : "\n";
  const parse = (t: string) => t.split(paragraphs ? /\n\s*\n/ : /\n/).map((s) => s.trim()).filter(Boolean);
  const [text, setText] = useState(value.join(sep));
  const [prev, setPrev] = useState(value);
  // Keep the raw text while typing, but follow outside changes (e.g. an applied AI suggestion).
  if (prev !== value) {
    setPrev(value);
    if (!sameList(parse(text), value)) setText(value.join(sep));
  }
  return (
    <div>
      <Label id={id} label={label} hint={hint} />
      <textarea
        id={id}
        rows={paragraphs ? 8 : 4}
        value={text}
        aria-invalid={Boolean(error)}
        onChange={(e) => {
          setText(e.target.value);
          onChange(parse(e.target.value));
        }}
        className={`${inputCls} ${error ? "border-danger/70" : ""}`}
      />
      <ErrorText id={id} error={error} />
    </div>
  );
}

type Link = { label: string; href: string } | undefined;

export function LinkInput({ label, value, optional, onChange, errors }: { label: string; value: Link; optional: boolean; onChange: (v: Link) => void; errors: Record<string, string> }) {
  const enabled = value !== undefined;
  return (
    <fieldset className="rounded-lg border border-line p-3">
      <legend className="px-1 text-sm font-medium text-fg">{label}</legend>
      {optional ? <CheckboxInput label="Show this button" checked={enabled} onChange={(on) => onChange(on ? { label: "Learn more", href: "/contact" } : undefined)} /> : null}
      {enabled ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <TextInput label="Button text" value={value.label} max={60} required onChange={(v) => onChange({ ...value, label: v })} error={errors.label} />
          <TextInput label="Link" hint="/contact, /ar/contact or https://…" value={value.href} required dir="ltr" onChange={(v) => onChange({ ...value, href: v })} error={errors.href} />
        </div>
      ) : null}
    </fieldset>
  );
}

export function ImageInput({ value, onChange, errors }: { value: { src: string; alt: string }; onChange: (v: { src: string; alt: string }) => void; errors: Record<string, string> }) {
  return (
    <fieldset className="rounded-lg border border-line p-3">
      <legend className="px-1 text-sm font-medium text-fg">Image</legend>
      <div className="grid gap-3">
        <TextInput label="Image address" hint="A file in /public (e.g. /images/team.jpg) or an https:// address. Uploads come with Supabase storage." value={value.src} required dir="ltr" onChange={(v) => onChange({ ...value, src: v })} error={errors.src} />
        <TextInput label="Alt text (describe the image for screen readers)" value={value.alt} max={200} onChange={(v) => onChange({ ...value, alt: v })} error={errors.alt} />
      </div>
    </fieldset>
  );
}

export function MultiSelectInput({ label, hint, options, value, onChange }: { label: string; hint: string; options: { value: string; label: string }[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-fg">
        {label}
        <span className="block text-xs font-normal text-subtle">{hint}</span>
      </legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <CheckboxInput key={o.value} label={o.label} checked={value.includes(o.value)} onChange={(on) => onChange(on ? [...value, o.value] : value.filter((v) => v !== o.value))} />
        ))}
      </div>
    </fieldset>
  );
}

export function ItemsInput({ field, value, onChange, errors }: {
  field: Extract<Field, { kind: "items" }>; value: Record<string, string>[]; onChange: (v: Record<string, string>[]) => void; errors: Record<string, string>;
}) {
  const update = (i: number, key: string, v: string) => onChange(value.map((item, j) => (j === i ? { ...item, [key]: v } : item)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...value];
    const [item] = next.splice(i, 1);
    next.splice(i + d, 0, item!);
    onChange(next);
  };
  const blank = Object.fromEntries(field.fields.map((f: ItemField) => [f.key, ""]));
  return (
    <fieldset>
      <legend className="text-sm font-medium text-fg">{field.label}</legend>
      {errors[""] ? <p className="mt-1 text-xs text-danger">{errors[""]}</p> : null}
      <ol className="mt-2 space-y-3">
        {value.map((item, i) => (
          <li key={i} className="rounded-lg border border-line p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-subtle">{field.itemLabel} {i + 1}</span>
              <span className="flex gap-1">
                <button type="button" className="studio-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${field.itemLabel.toLowerCase()} ${i + 1} up`}>↑</button>
                <button type="button" className="studio-icon-btn" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label={`Move ${field.itemLabel.toLowerCase()} ${i + 1} down`}>↓</button>
                <button type="button" className="studio-icon-btn" onClick={() => onChange(value.filter((_, j) => j !== i))} disabled={value.length <= field.min} aria-label={`Remove ${field.itemLabel.toLowerCase()} ${i + 1}`}>✕</button>
              </span>
            </div>
            <div className="grid gap-3">
              {field.fields.map((f) => (
                <TextInput key={f.key} label={f.label} value={item[f.key] ?? ""} max={f.max} required multiline={f.kind === "textarea"} onChange={(v) => update(i, f.key, v)} error={errors[`${i}.${f.key}`]} />
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn-secondary mt-3 !px-4 !py-2 text-sm" onClick={() => onChange([...value, blank])} disabled={value.length >= field.max}>
        + Add {field.itemLabel.toLowerCase()}
      </button>
    </fieldset>
  );
}
