import type { PageDiff } from "@/features/pages/diff";
import { blockMeta } from "./block-fields";

/** Shows what an AI suggestion would change, before anything is applied. */
export function DiffView({ diff }: { diff: PageDiff }) {
  if (!diff.hasChanges) return <p className="text-sm text-muted">The suggestion does not change anything.</p>;
  return (
    <div className="space-y-3 text-sm" data-testid="ai-diff">
      {diff.meta.length ? (
        <div className="rounded-lg border border-line p-3">
          <p className="font-semibold">Search title and description</p>
          <Changes changes={diff.meta} />
        </div>
      ) : null}
      {diff.blocks.map((c, i) => (
        <div key={`${c.kind}-${c.id}-${i}`} className="rounded-lg border border-line p-3">
          <p className="font-semibold">
            <span className={c.kind === "removed" ? "text-danger" : c.kind === "added" ? "text-success" : "text-pulse-300"}>
              {c.kind === "added" ? "Added" : c.kind === "removed" ? "Removed" : c.kind === "moved" ? "Moved" : "Changed"}
            </span>{" "}
            {blockMeta[c.type].label} <span className="font-normal text-subtle">({c.id})</span>
          </p>
          {c.kind === "moved" ? <p className="mt-1 text-muted">From position {c.from} to {c.to}</p> : null}
          {c.kind === "added" ? <p className="mt-1 text-muted">At position {c.index + 1}</p> : null}
          {c.kind === "changed" ? <Changes changes={c.changes} /> : null}
        </div>
      ))}
    </div>
  );
}

function Changes({ changes }: { changes: { path: string; before: string; after: string }[] }) {
  return (
    <dl className="mt-2 space-y-2">
      {changes.slice(0, 30).map((ch) => (
        <div key={ch.path}>
          <dt className="text-xs text-subtle">{ch.path.replace(/^data\./, "")}</dt>
          <dd className="mt-0.5 grid gap-1">
            {ch.before ? <del className="rounded bg-danger/10 px-2 py-1 text-danger/90 no-underline">− {ch.before}</del> : null}
            {ch.after ? <ins className="rounded bg-success/10 px-2 py-1 text-success no-underline">+ {ch.after}</ins> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
