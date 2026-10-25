import type { Metadata } from "next";
import { Suspense } from "react";

/** Private studio: never indexed. Pages read the session cookie, so they render per request. */
export const metadata: Metadata = {
  title: { default: "Studio", template: "%s | Digivertising Studio" },
  robots: { index: false, follow: false, nocache: true },
};

export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<p className="p-8 text-muted">Loading studio…</p>}>{children}</Suspense>;
}
