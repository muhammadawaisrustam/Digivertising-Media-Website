import type { Dictionary } from "@/i18n/dictionaries/en";

type Nodes = Dictionary["home"]["workforce"]["nodes"];

/**
 * Animated diagram of the AI workforce: specialist groups around a central
 * orchestrator, with every external action passing through human approval.
 * Lines animate with CSS only and stop when reduced motion is requested.
 * Positions are mirrored automatically in RTL via logical properties.
 */
export function WorkforceNetwork({ nodes, label }: { nodes: Nodes; label: string }) {
  const outer: { key: keyof Nodes; pos: string }[] = [
    { key: "research", pos: "top-[6%] start-[2%]" },
    { key: "marketing", pos: "top-[6%] end-[2%]" },
    { key: "technology", pos: "top-[56%] start-[0%]" },
    { key: "delivery", pos: "top-[56%] end-[0%]" },
  ];

  return (
    <figure role="img" aria-label={label} className="relative mx-auto aspect-[5/4] w-full max-w-xl">
      <svg viewBox="0 0 500 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="wf-line" x1="0" x2="1">
            <stop offset="0" stopColor="#7096FF" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
          <radialGradient id="wf-core">
            <stop offset="0" stopColor="#4C7DFF" stopOpacity="0.5" />
            <stop offset="1" stopColor="#4C7DFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="250" cy="175" r="120" fill="url(#wf-core)" />
        <g stroke="url(#wf-line)" strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path className="signal-line" d="M95 55 C 160 70, 200 120, 250 175" />
          <path className="signal-line" d="M405 55 C 340 70, 300 120, 250 175" />
          <path className="signal-line" d="M85 255 C 150 250, 200 210, 250 175" />
          <path className="signal-line" d="M415 255 C 350 250, 300 210, 250 175" />
          <path className="signal-line" d="M250 175 L 250 330" />
        </g>
        <circle className="node-pulse" cx="250" cy="175" r="10" fill="#67E8F9" />
        <circle cx="250" cy="175" r="28" fill="none" stroke="#7096FF" strokeOpacity="0.5" />
        <circle cx="250" cy="175" r="44" fill="none" stroke="#7096FF" strokeOpacity="0.2" />
      </svg>

      <span className="absolute start-1/2 top-[30%] -translate-x-1/2 rounded-full border border-signal-400/50 bg-ink-800 px-4 py-2 font-display text-sm font-semibold text-fg shadow-[var(--shadow-glow)] rtl:translate-x-1/2">
        {nodes.orchestrator}
      </span>
      {outer.map((n) => (
        <span key={n.key} className={`absolute ${n.pos} rounded-xl border border-line-strong bg-ink-800/90 px-3 py-2 text-xs font-medium text-fg sm:text-sm`}>
          {nodes[n.key]}
        </span>
      ))}
      <span className="absolute bottom-[4%] start-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-success/50 bg-ink-800 px-4 py-2 text-sm font-semibold text-success rtl:translate-x-1/2">
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2.5l6 2.5v4.5c0 4-2.6 6.8-6 8-3.4-1.2-6-4-6-8V5z" />
          <path d="M7 10l2 2 4-4" />
        </svg>
        {nodes.approval}
      </span>
    </figure>
  );
}
