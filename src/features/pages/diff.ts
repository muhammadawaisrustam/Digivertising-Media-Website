import type { Block, PageLocaleContent } from "./schema";

/** Human-readable differences between two versions of a page (used for AI suggestions). */

export type FieldChange = { path: string; before: string; after: string };
export type BlockChange =
  | { kind: "added"; id: string; type: Block["type"]; index: number }
  | { kind: "removed"; id: string; type: Block["type"] }
  | { kind: "moved"; id: string; type: Block["type"]; from: number; to: number }
  | { kind: "changed"; id: string; type: Block["type"]; changes: FieldChange[] };

export type PageDiff = { meta: FieldChange[]; blocks: BlockChange[]; hasChanges: boolean };

function flatten(value: unknown, prefix = "", out: Record<string, string> = {}): Record<string, string> {
  if (value === null || value === undefined) return out;
  if (Array.isArray(value)) {
    value.forEach((v, i) => flatten(v, prefix ? `${prefix}.${i + 1}` : String(i + 1), out));
  } else if (typeof value === "object") {
    for (const [k, v] of Object.entries(value)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else {
    out[prefix] = String(value);
  }
  return out;
}

function compare(before: unknown, after: unknown): FieldChange[] {
  const a = flatten(before);
  const b = flatten(after);
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  return keys.filter((k) => a[k] !== b[k]).map((k) => ({ path: k, before: a[k] ?? "", after: b[k] ?? "" }));
}

export function diffPages(before: PageLocaleContent, after: PageLocaleContent): PageDiff {
  const meta = compare(before.meta, after.meta);
  const blocks: BlockChange[] = [];
  const beforeById = new Map(before.blocks.map((b) => [b.id, b]));
  const afterIds = new Set(after.blocks.map((b) => b.id));

  for (const b of before.blocks) if (!afterIds.has(b.id)) blocks.push({ kind: "removed", id: b.id, type: b.type });

  const commonBefore = before.blocks.filter((b) => afterIds.has(b.id)).map((b) => b.id);
  const commonAfter = after.blocks.filter((b) => beforeById.has(b.id)).map((b) => b.id);

  after.blocks.forEach((b, index) => {
    const old = beforeById.get(b.id);
    if (!old) {
      blocks.push({ kind: "added", id: b.id, type: b.type, index });
      return;
    }
    const from = commonBefore.indexOf(b.id);
    const to = commonAfter.indexOf(b.id);
    if (from !== to) blocks.push({ kind: "moved", id: b.id, type: b.type, from: from + 1, to: to + 1 });
    const changes = compare({ type: old.type, data: old.data, settings: old.settings }, { type: b.type, data: b.data, settings: b.settings });
    if (changes.length) blocks.push({ kind: "changed", id: b.id, type: b.type, changes });
  });

  return { meta, blocks, hasChanges: meta.length > 0 || blocks.length > 0 };
}
