"use client";

import type { Block, BlockSettings } from "@/features/pages/schema";
import { blockFields, blockMeta, settingsOptions } from "./block-fields";
import { CheckboxInput, ImageInput, ItemsInput, LinesInput, LinkInput, MultiSelectInput, SelectInput, TextInput } from "./field-inputs";

/** Errors for one sub-field, with the prefix removed: "button.href" -> { href }. */
function sub(errors: Record<string, string>, key: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(errors)) {
    if (k === key) out[""] = v;
    else if (k.startsWith(`${key}.`)) out[k.slice(key.length + 1)] = v;
  }
  return out;
}

export function BlockForm({ block, onChange, errors, dir }: { block: Block; onChange: (b: Block) => void; errors: Record<string, string>; dir: "ltr" | "rtl" }) {
  const data = block.data as Record<string, unknown>;
  const set = (key: string, value: unknown) => onChange({ ...block, data: { ...data, [key]: value } } as Block);
  const setSetting = <K extends keyof BlockSettings>(key: K, value: BlockSettings[K]) => onChange({ ...block, settings: { ...block.settings, [key]: value } });

  return (
    <div className="space-y-5">
      <div>
        <p className="badge">{blockMeta[block.type].label}</p>
        <p className="mt-2 text-sm text-muted">{blockMeta[block.type].description}</p>
      </div>
      <div className="space-y-4" dir={dir}>
        {blockFields[block.type].map((field) => {
          const value = data[field.key];
          switch (field.kind) {
            case "text":
            case "textarea":
              return <TextInput key={field.key} label={field.label} hint={field.hint} value={(value as string) ?? ""} max={field.max} required={field.required} multiline={field.kind === "textarea"} onChange={(v) => set(field.key, v)} error={errors[field.key]} />;
            case "select":
              return <SelectInput key={field.key} label={field.label} value={String(value)} options={field.options} onChange={(v) => set(field.key, v)} />;
            case "checkbox":
              return <CheckboxInput key={field.key} label={field.label} hint={field.hint} checked={Boolean(value)} onChange={(v) => set(field.key, v)} />;
            case "lines":
              return <LinesInput key={`${block.id}-${field.key}`} label={field.label} hint={field.hint} value={(value as string[]) ?? []} paragraphs={field.key === "paragraphs"} onChange={(v) => set(field.key, v)} error={errors[field.key] ?? Object.entries(sub(errors, field.key))[0]?.[1]} />;
            case "link":
              return <LinkInput key={field.key} label={field.label} optional={field.optional} value={value as { label: string; href: string } | undefined} onChange={(v) => set(field.key, v)} errors={sub(errors, field.key)} />;
            case "image":
              return <ImageInput key={field.key} value={value as { src: string; alt: string }} onChange={(v) => set(field.key, v)} errors={sub(errors, field.key)} />;
            case "multiselect":
              return <MultiSelectInput key={field.key} label={field.label} hint={field.hint} options={field.options} value={(value as string[]) ?? []} onChange={(v) => set(field.key, v)} />;
            case "items":
              return <ItemsInput key={field.key} field={field} value={(value as Record<string, string>[]) ?? []} onChange={(v) => set(field.key, v)} errors={sub(errors, field.key)} />;
          }
        })}
      </div>
      <fieldset className="rounded-lg border border-line p-3">
        <legend className="px-1 text-sm font-medium text-fg">Section style</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectInput label="Background" value={block.settings.background} options={settingsOptions.background} onChange={(v) => setSetting("background", v as BlockSettings["background"])} />
          <SelectInput label="Spacing" value={block.settings.spacing} options={settingsOptions.spacing} onChange={(v) => setSetting("spacing", v as BlockSettings["spacing"])} />
          <SelectInput label="Alignment" value={block.settings.align} options={settingsOptions.align} onChange={(v) => setSetting("align", v as BlockSettings["align"])} />
        </div>
      </fieldset>
    </div>
  );
}
