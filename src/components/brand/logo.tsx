import { useId } from "react";

/** The Digivertising "D" mark: a D whose counter holds a broadcast signal. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  const g = `dg-${id}`;
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={g} x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7096FF" />
          <stop offset="0.55" stopColor="#4C7DFF" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect x="12" y="12" width="9" height="40" rx="4.5" fill={`url(#${g})`} />
      <path d="M21 16.5h7.5a15.5 15.5 0 0 1 0 31H21" fill="none" stroke={`url(#${g})`} strokeWidth="9" strokeLinecap="round" />
      <circle cx="30" cy="32" r="3.6" fill="#67E8F9" />
      <path d="M35.2 26.4a8 8 0 0 1 0 11.2" fill="none" stroke="#67E8F9" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** Mark + wordmark. The wordmark stays in Latin script in both languages. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} dir="ltr">
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.1875rem] font-bold tracking-[-0.02em] text-fg">Digivertising</span>
        <span className="mt-1 text-[0.625rem] font-semibold tracking-[0.28em] text-muted">MEDIA &amp; PR</span>
      </span>
    </span>
  );
}
