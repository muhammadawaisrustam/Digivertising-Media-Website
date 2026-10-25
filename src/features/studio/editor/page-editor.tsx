"use client";

import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { z } from "zod";
import type { PageEditSuggestion } from "@/features/pages/ai-edit";
import { blockTypes, pageLocaleContentSchema, type Block, type BlockType, type PageLocaleContent } from "@/features/pages/schema";
import type { EditorState, Result } from "@/features/pages/service";
import type { AiConfigurationStatus } from "@/lib/ai/types";
import { aiSuggestAction, discardDraftAction, publishAction, restoreRevisionAction, saveDraftAction } from "../actions";
import { blockMeta, blockTitle, createBlock } from "./block-fields";
import { BlockForm } from "./block-form";
import { DiffView } from "./diff-view";
import { TextInput } from "./field-inputs";

type Props = { initial: EditorState; publicUrl: string; ai: AiConfigurationStatus; pageLabel: string };
type Notice = { kind: "success" | "error" | "info"; text: string; details?: string[] };

const devices = [
  { id: "mobile", label: "Mobile", width: 375 },
  { id: "tablet", label: "Tablet", width: 768 },
  { id: "desktop", label: "Desktop", width: 1280 },
] as const;

/** Friendly wording for validation problems. */
function friendly(issue: z.core.$ZodIssue): string {
  if (issue.code === "too_small") return issue.minimum === 1 && issue.origin === "string" ? "This field is required." : `Add at least ${issue.minimum}.`;
  if (issue.code === "too_big") return issue.origin === "string" ? `Keep this under ${issue.maximum} characters.` : `Use at most ${issue.maximum}.`;
  return issue.message;
}

function SortableBlock({ block, index, total, selected, invalid, onSelect, onMove, onRemove, onDuplicate }: {
  block: Block; index: number; total: number; selected: boolean; invalid: boolean;
  onSelect: () => void; onMove: (d: -1 | 1) => void; onRemove: () => void; onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      data-testid="editor-block"
      data-block-type={block.type}
      className={`flex items-center gap-2 rounded-xl border p-2 ${selected ? "border-signal-400 bg-signal-500/10" : "border-line bg-ink-900/60"} ${isDragging ? "z-10 opacity-80 shadow-lg" : ""}`}
    >
      <button type="button" className="studio-icon-btn cursor-grab touch-none" aria-label={`Drag to reorder: ${blockMeta[block.type].label}, ${blockTitle(block)}`} {...attributes} {...listeners}>
        ⠿
      </button>
      <button type="button" onClick={onSelect} aria-pressed={selected} className="min-w-0 flex-1 text-start">
        <span className="block text-xs text-subtle">
          {index + 1}. {blockMeta[block.type].label}
          {invalid ? <span className="ms-1 text-danger">• needs attention</span> : null}
        </span>
        <span className="block truncate text-sm text-fg">{blockTitle(block)}</span>
      </button>
      <span className="flex shrink-0 gap-1">
        <button type="button" className="studio-icon-btn" onClick={() => onMove(-1)} disabled={index === 0} aria-label={`Move ${blockTitle(block)} up`}>↑</button>
        <button type="button" className="studio-icon-btn" onClick={() => onMove(1)} disabled={index === total - 1} aria-label={`Move ${blockTitle(block)} down`}>↓</button>
        <button type="button" className="studio-icon-btn" onClick={onDuplicate} aria-label={`Duplicate ${blockTitle(block)}`}>⧉</button>
        <button type="button" className="studio-icon-btn" onClick={onRemove} aria-label={`Remove ${blockTitle(block)}`}>✕</button>
      </span>
    </li>
  );
}

export function PageEditor({ initial, publicUrl, ai, pageLabel }: Props) {
  const [state, setState] = useState(initial);
  const [content, setContent] = useState<PageLocaleContent>(initial.working);
  const [baseline, setBaseline] = useState(JSON.stringify(initial.working));
  const [selectedId, setSelectedId] = useState<string | null>(initial.working.blocks[0]?.id ?? null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [device, setDevice] = useState<(typeof devices)[number]["id"]>("desktop");
  const [previewVersion, setPreviewVersion] = useState(0);
  const [note, setNote] = useState("");
  const [addType, setAddType] = useState<BlockType>("text");
  const [instruction, setInstruction] = useState("");
  const [suggestion, setSuggestion] = useState<PageEditSuggestion | null>(null);
  const [pending, startTransition] = useTransition();

  const { slug, locale } = state;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const dirty = JSON.stringify(content) !== baseline;
  const validation = useMemo(() => pageLocaleContentSchema.safeParse(content), [content]);
  const issues = useMemo(() => (validation.success ? [] : validation.error.issues), [validation]);

  // Map validation problems to blocks and fields.
  const blockErrors = useMemo(() => {
    const map = new Map<string, Record<string, string>>();
    for (const issue of issues) {
      if (issue.path[0] !== "blocks" || typeof issue.path[1] !== "number") continue;
      const block = content.blocks[issue.path[1]];
      if (!block) continue;
      const key = issue.path.slice(3).join(".");
      const entry = map.get(block.id) ?? {};
      entry[key] ??= friendly(issue);
      map.set(block.id, entry);
    }
    return map;
  }, [issues, content.blocks]);
  const metaErrors = Object.fromEntries(issues.filter((i) => i.path[0] === "meta").map((i) => [String(i.path[1]), friendly(i)]));
  const pageErrors = issues.filter((i) => i.path.length <= 1).map((i) => i.message);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const setBlocks = (fn: (blocks: Block[]) => Block[]) => setContent((c) => ({ ...c, blocks: fn(c.blocks) }));
  const move = (index: number, d: -1 | 1) => setBlocks((b) => arrayMove(b, index, index + d));
  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    setBlocks((b) => arrayMove(b, b.findIndex((x) => x.id === e.active.id), b.findIndex((x) => x.id === e.over!.id)));
  };
  const addBlock = () => {
    if (addType === "hero" && content.blocks.some((b) => b.type === "hero")) {
      setNotice({ kind: "error", text: "A page can only have one hero block." });
      return;
    }
    const block = createBlock(addType);
    setBlocks((b) => [...b, block]);
    setSelectedId(block.id);
  };
  const duplicate = (index: number) => {
    const src = content.blocks[index]!;
    if (src.type === "hero") {
      setNotice({ kind: "error", text: "A page can only have one hero block." });
      return;
    }
    const copy = { ...structuredClone(src), id: createBlock(src.type).id };
    setBlocks((b) => [...b.slice(0, index + 1), copy, ...b.slice(index + 1)]);
    setSelectedId(copy.id);
  };
  const remove = (index: number) => {
    const block = content.blocks[index]!;
    if (!window.confirm(`Remove the "${blockTitle(block)}" block? You can undo this by not saving.`)) return;
    setBlocks((b) => b.filter((_, i) => i !== index));
    if (selectedId === block.id) setSelectedId(null);
  };

  function applyResult(res: Result<EditorState>, success: string) {
    if (!res.ok) {
      setNotice({ kind: "error", text: "Not saved. Please fix these problems:", details: res.errors });
      return;
    }
    setState(res.value);
    setContent(res.value.working);
    setBaseline(JSON.stringify(res.value.working));
    setPreviewVersion((v) => v + 1);
    setNotice({ kind: "success", text: success });
  }

  const save = () =>
    startTransition(async () => applyResult(await saveDraftAction(slug, locale, content), "Draft saved. The live page has not changed."));
  const publish = () => {
    if (!window.confirm(`Publish this version of ${pageLabel} (${locale.toUpperCase()})? Visitors will see it immediately.`)) return;
    startTransition(async () => {
      applyResult(await publishAction(slug, locale, content, note), "Published. The live page now shows this version.");
      setNote("");
    });
  };
  const discard = () => {
    if (!window.confirm("Discard the saved draft and all unsaved changes? The live page stays as it is.")) return;
    startTransition(async () => applyResult(await discardDraftAction(slug, locale), "Draft discarded. The editor now shows the live version."));
  };
  const restore = (id: string) => {
    if (dirty && !window.confirm("You have unsaved changes. Restoring will replace them. Continue?")) return;
    startTransition(async () => applyResult(await restoreRevisionAction(slug, locale, id), "Earlier version copied into the draft. Review it, then publish when ready."));
  };
  const askAi = () =>
    startTransition(async () => {
      setSuggestion(null);
      const res = await aiSuggestAction(slug, locale, content, instruction);
      if (res.ok) setSuggestion(res.suggestion);
      else setNotice({ kind: res.reason === "not_configured" ? "info" : "error", text: res.message });
    });
  const applySuggestion = () => {
    if (!suggestion) return;
    setContent(suggestion.content);
    setSuggestion(null);
    setNotice({ kind: "info", text: "Suggestion applied in the editor only. Save the draft to keep it. Nothing is live until you publish." });
  };

  const selected = content.blocks.find((b) => b.id === selectedId) ?? null;
  const width = devices.find((d) => d.id === device)!.width;

  return (
    <div className="space-y-6">
      {/* Status and actions */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-line bg-ink-950/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" data-testid="editor-status">
            {dirty ? <span className="text-warning">Unsaved changes</span> : state.hasDraft ? <span className="text-pulse-300">Draft saved (not live)</span> : <span>No changes from the live page</span>}
            {state.usingBuiltIn ? <span className="ms-2 text-subtle">· Live page uses the built-in version</span> : null}
            {!validation.success ? <span className="ms-2 text-danger">· {issues.length} problem{issues.length === 1 ? "" : "s"} to fix</span> : null}
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary !px-4 !py-2 text-sm" onClick={discard} disabled={pending || (!state.hasDraft && !dirty)}>Discard draft</button>
            <button type="button" className="btn btn-secondary !px-4 !py-2 text-sm" onClick={save} disabled={pending || !dirty || !validation.success}>Save draft</button>
            <button type="button" className="btn btn-primary !px-4 !py-2 text-sm" onClick={publish} disabled={pending || !validation.success || (!dirty && !state.hasDraft)}>Publish</button>
          </div>
        </div>
        <div aria-live="polite">
          {notice ? (
            <div role={notice.kind === "error" ? "alert" : "status"} className={`mt-3 rounded-lg border px-3 py-2 text-sm ${notice.kind === "error" ? "border-danger/50 bg-danger/10 text-danger" : notice.kind === "success" ? "border-success/40 bg-success/10 text-success" : "border-signal-400/40 bg-signal-500/10 text-fg"}`}>
              <p>{notice.text}</p>
              {notice.details?.length ? <ul className="mt-1 list-disc ps-5">{notice.details.map((d) => <li key={d}>{d}</li>)}</ul> : null}
            </div>
          ) : null}
        </div>
      </div>

      {pageErrors.length ? (
        <div role="alert" className="rounded-lg border border-danger/50 bg-danger/10 px-3 py-2 text-sm text-danger">
          {pageErrors.map((e) => <p key={e}>{e}</p>)}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
        {/* Block list */}
        <section aria-labelledby="blocks-heading" className="space-y-4">
          <h2 id="blocks-heading" className="text-lg font-semibold">Blocks</h2>
          <p className="text-xs text-subtle">Drag the ⠿ handle, or focus it and use Space and the arrow keys. The ↑ ↓ buttons also reorder.</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={content.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <ol className="space-y-2" data-testid="block-list">
                {content.blocks.map((block, i) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    index={i}
                    total={content.blocks.length}
                    selected={block.id === selectedId}
                    invalid={blockErrors.has(block.id)}
                    onSelect={() => setSelectedId(block.id)}
                    onMove={(d) => move(i, d)}
                    onRemove={() => remove(i)}
                    onDuplicate={() => duplicate(i)}
                  />
                ))}
              </ol>
            </SortableContext>
          </DndContext>
          {content.blocks.length === 0 ? <p className="text-sm text-muted">This page has no blocks yet.</p> : null}
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="add-block-type">Block type to add</label>
            <select id="add-block-type" value={addType} onChange={(e) => setAddType(e.target.value as BlockType)} className="min-w-0 flex-1 rounded-lg border border-line-strong bg-ink-950/70 px-3 py-2 text-sm">
              {blockTypes.map((t) => <option key={t} value={t}>{blockMeta[t].label}</option>)}
            </select>
            <button type="button" className="btn btn-secondary !px-4 !py-2 text-sm" onClick={addBlock} disabled={content.blocks.length >= 40}>+ Add block</button>
          </div>

          <section aria-labelledby="seo-heading" className="card space-y-3 p-4">
            <h2 id="seo-heading" className="font-semibold">Search result text</h2>
            <TextInput label="Page title" value={content.meta.title} max={70} required dir={dir} onChange={(v) => setContent((c) => ({ ...c, meta: { ...c.meta, title: v } }))} error={metaErrors.title} />
            <TextInput label="Description" value={content.meta.description} max={170} required multiline dir={dir} onChange={(v) => setContent((c) => ({ ...c, meta: { ...c.meta, description: v } }))} error={metaErrors.description} />
          </section>
        </section>

        {/* Selected block */}
        <section aria-labelledby="block-edit-heading" className="card p-4 md:p-6">
          <h2 id="block-edit-heading" className="text-lg font-semibold">{selected ? `Edit: ${blockTitle(selected)}` : "Select a block to edit"}</h2>
          <div className="mt-4">
            {selected ? (
              <BlockForm block={selected} dir={dir} errors={blockErrors.get(selected.id) ?? {}} onChange={(b) => setBlocks((blocks) => blocks.map((x) => (x.id === b.id ? b : x)))} />
            ) : (
              <p className="text-sm text-muted">Choose a block from the list to change its text, links and style.</p>
            )}
          </div>
        </section>
      </div>

      {/* AI suggestions */}
      <section aria-labelledby="ai-heading" className="card p-4 md:p-6" data-testid="ai-panel">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="ai-heading" className="text-lg font-semibold">AI suggestions</h2>
          <span className={`badge ${ai.configured ? (ai.isTestProvider ? "!text-warning" : "") : "!text-subtle"}`} data-testid="ai-status">{ai.label}</span>
        </div>
        <p className="mt-2 text-sm text-muted">{ai.message}</p>
        {ai.configured ? (
          <div className="mt-4 space-y-3">
            <TextInput label="Describe the change you want" hint="For example: make the hero intro shorter and friendlier. Suggestions are shown for review; nothing changes until you apply, save and publish." value={instruction} max={1000} multiline onChange={setInstruction} />
            <button type="button" className="btn btn-secondary !px-4 !py-2 text-sm" onClick={askAi} disabled={pending || instruction.trim().length < 5 || !validation.success}>
              Suggest changes
            </button>
          </div>
        ) : null}
        {suggestion ? (
          <div className="mt-5 space-y-4 rounded-xl border border-signal-400/40 p-4" data-testid="ai-suggestion">
            {suggestion.isTest ? <p className="text-sm font-semibold text-warning">[TEST] Sample output from the test provider. Not real AI.</p> : null}
            <p className="text-sm"><span className="font-semibold">Summary:</span> {suggestion.summary}</p>
            <DiffView diff={suggestion.diff} />
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary !px-4 !py-2 text-sm" onClick={applySuggestion} disabled={!suggestion.diff.hasChanges}>Apply to editor</button>
              <button type="button" className="btn btn-secondary !px-4 !py-2 text-sm" onClick={() => setSuggestion(null)}>Reject</button>
            </div>
          </div>
        ) : null}
      </section>

      {/* Preview */}
      <section aria-labelledby="preview-heading" className="card p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="preview-heading" className="text-lg font-semibold">Preview</h2>
            <p className="text-sm text-muted">Shows the last saved draft{state.hasDraft ? "" : " (currently the live version)"}. Save to update it.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Preview size">
            {devices.map((d) => (
              <button key={d.id} type="button" aria-pressed={device === d.id} onClick={() => setDevice(d.id)} className={`rounded-full border px-3 py-1 text-sm ${device === d.id ? "border-signal-400 bg-signal-500/15" : "border-line text-muted"}`}>
                {d.label} <span className="text-subtle">{d.width}px</span>
              </button>
            ))}
            <button type="button" className="rounded-full border border-line px-3 py-1 text-sm text-muted" onClick={() => setPreviewVersion((v) => v + 1)}>Reload</button>
            <a href={publicUrl} target="_blank" rel="noreferrer" className="rounded-full border border-line px-3 py-1 text-sm text-muted">Open live page ↗</a>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-ink-900 p-2" tabIndex={0} role="region" aria-label="Preview frame (scrolls sideways on small screens)">
          <iframe
            key={previewVersion}
            title={`Preview of ${pageLabel} at ${width}px`}
            src={`/studio/preview/${slug}/${locale}`}
            className="mx-auto block h-[70vh] rounded-lg bg-ink-950"
            style={{ width }}
          />
        </div>
      </section>

      {/* Publish note and history */}
      <section aria-labelledby="history-heading" className="card p-4 md:p-6">
        <h2 id="history-heading" className="text-lg font-semibold">Publishing and history</h2>
        <div className="mt-3 max-w-xl">
          <TextInput label="Note for this version (optional)" hint="Saved in the history when you publish, e.g. 'Updated hero text'." value={note} max={200} onChange={setNote} />
        </div>
        <p className="mt-4 text-sm text-muted">
          Last published: {state.publishedAt ? new Date(state.publishedAt).toLocaleString() : "never (the built-in version is live)"}
        </p>
        {state.revisions.length ? (
          <ol className="mt-4 divide-y divide-line rounded-xl border border-line" data-testid="revisions">
            {state.revisions.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <span>
                  <span className="text-fg">{new Date(r.publishedAt).toLocaleString()}</span>
                  <span className="ms-2 text-muted">{r.note}</span>
                </span>
                <button type="button" className="text-signal-300 underline" onClick={() => restore(r.id)} disabled={pending}>Restore to draft</button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-subtle">No published versions yet. Each time you publish, the previous version is kept here (up to 20).</p>
        )}
      </section>
    </div>
  );
}
