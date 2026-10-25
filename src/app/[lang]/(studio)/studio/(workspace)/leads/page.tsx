import type { Metadata } from "next";
import { getService } from "@/content/services";
import { ADMINS, requireStudio } from "@/lib/auth/studio-auth";
import { getStudioStore } from "@/lib/database";

export const metadata: Metadata = { title: "Leads" };

export default async function StudioLeads() {
  await requireStudio(ADMINS);
  const leads = await (await getStudioStore()).listLeads();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2">Website enquiries</h1>
        <p className="mt-2 text-muted">Submissions from the contact form and the proposal assistant, newest first. Read-only for now: statuses, notes and the approval queue arrive with the CRM in Phase 4.</p>
      </div>
      {leads.length === 0 ? (
        <p className="card p-6 text-muted" data-testid="no-leads">No enquiries yet. They appear here when someone submits a form on the website.</p>
      ) : (
        <ul className="space-y-4" data-testid="lead-list">
          {leads.map((lead) => (
            <li key={lead.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{lead.name}{lead.businessName ? <span className="text-muted"> · {lead.businessName}</span> : null}</p>
                  <a href={`mailto:${lead.email}`} className="text-sm text-signal-300 underline" dir="ltr">{lead.email}</a>
                  {lead.phone ? <span className="ms-3 text-sm text-muted" dir="ltr">{lead.phone}</span> : null}
                </div>
                <div className="text-end text-xs text-subtle">
                  <p>{new Date(lead.createdAt).toLocaleString()}</p>
                  <p>{lead.source === "website_proposal" ? "Proposal assistant" : "Contact form"} · {lead.locale.toUpperCase()} · ref {lead.id.slice(0, 8).toUpperCase()}</p>
                  {lead.qualification ? <p className="mt-1"><span className="badge">Automated priority: {lead.qualification.priority}</span></p> : null}
                </div>
              </div>
              {lead.services.length ? <p className="mt-3 text-sm text-muted">Services: {lead.services.map((s) => getService(s)?.content.en.title ?? s).join(", ")}</p> : null}
              {lead.goals ? <p className="mt-2 whitespace-pre-line text-sm"><span className="text-subtle">Goals: </span>{lead.goals}</p> : null}
              {lead.details ? <p className="mt-2 whitespace-pre-line text-sm"><span className="text-subtle">{lead.source === "website_contact" ? "Message: " : "Details: "}</span>{lead.details}</p> : null}
              {lead.source === "website_proposal" ? (
                <p className="mt-2 text-sm text-muted">Timeline: {lead.timeline || "–"} · Budget: {lead.budget || "–"}{lead.country ? ` · ${lead.country}` : ""}{lead.timezone ? ` · ${lead.timezone}` : ""}</p>
              ) : null}
              {lead.qualification?.missingInfo.length ? <p className="mt-2 text-sm text-warning">Missing: {lead.qualification.missingInfo.join(", ")}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
