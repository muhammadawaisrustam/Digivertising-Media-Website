import type { Metadata } from "next";
import Link from "next/link";
import { listEditablePages } from "@/features/pages/service";
import { aiStatus } from "@/lib/ai";
import { ADMINS, hasRole, requireStudio } from "@/lib/auth/studio-auth";
import { getStudioStore, storageDescription } from "@/lib/database";

export const metadata: Metadata = { title: "Dashboard" };

export default async function StudioDashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requireStudio();
  const { denied } = await searchParams;
  const seesLeads = hasRole(user, ADMINS);
  const store = await getStudioStore();
  const [pages, leads] = await Promise.all([listEditablePages(), seesLeads ? store.listLeads() : Promise.resolve([])]);
  const storage = storageDescription();
  const ai = aiStatus();
  const newLeads = leads.filter((l) => l.status === "new").length;
  const drafts = pages.filter((p) => p.hasDraft).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h2">Dashboard</h1>
        <p className="mt-2 text-muted">Everything here is private. Nothing is published or sent without you pressing the button.</p>
      </div>
      {denied ? <p role="status" className="card border-warning p-4 text-sm text-warning">Your role ({user.role}) does not have access to that part of the studio. Ask the owner if you need it.</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/studio/pages" className="card card-interactive p-5">
          <p className="text-sm text-subtle">Pages</p>
          <p className="mt-1 text-3xl font-semibold">{pages.length}</p>
          <p className="mt-1 text-sm text-muted">{drafts ? `${drafts} with unpublished drafts` : "No unpublished drafts"}</p>
        </Link>
        {seesLeads ? (
          <Link href="/studio/leads" className="card card-interactive p-5">
            <p className="text-sm text-subtle">Website enquiries</p>
            <p className="mt-1 text-3xl font-semibold">{leads.length}</p>
            <p className="mt-1 text-sm text-muted">{newLeads} new</p>
          </Link>
        ) : (
          <div className="card p-5">
            <p className="text-sm text-subtle">Website enquiries</p>
            <p className="mt-1 text-sm text-muted">Only the owner and admins can see enquiries.</p>
          </div>
        )}
        <div className="card p-5">
          <p className="text-sm text-subtle">Storage</p>
          <p className={`mt-1 font-semibold ${storage.ready ? "" : "text-warning"}`} data-testid="dashboard-storage">{storage.kind === "supabase" ? "Supabase database" : "Local files"}</p>
          <p className="mt-1 text-sm text-muted">{storage.note}</p>
        </div>
        <div className="card p-5" data-testid="dashboard-ai">
          <p className="text-sm text-subtle">AI provider</p>
          <p className={`mt-1 font-semibold ${ai.isTestProvider ? "text-warning" : ""}`}>{ai.label}</p>
          <p className="mt-1 text-sm text-muted">{ai.message}</p>
        </div>
      </div>
      <section className="card p-6">
        <h2 className="text-h3">Coming in later phases</h2>
        <ul className="mt-3 list-disc space-y-1 ps-5 text-sm text-muted">
          <li>Phase 4: lead pipeline and CRM statuses, approval queue.</li>
          <li>Phase 5 to 7: AI workforce, research workflows, deployment.</li>
        </ul>
      </section>
    </div>
  );
}
