import type { Locale } from "@/i18n/config";
import type { PageLocaleContent } from "@/features/pages/schema";

/**
 * Storage interfaces. The app talks to these, never to a specific database, so
 * the local file store (development) can be swapped for Supabase (Phase 3)
 * without touching features.
 */

export type PageRevision = {
  id: string;
  content: PageLocaleContent;
  publishedAt: string;
  note: string;
};

export type PageRecord = {
  slug: string;
  locale: Locale;
  published: PageLocaleContent | null;
  draft: PageLocaleContent | null;
  publishedAt: string | null;
  updatedAt: string;
  revisions: PageRevision[];
};

export type LeadStatus =
  | "new" | "researching" | "qualified" | "needs_review" | "contact_drafted" | "approved_for_contact"
  | "contacted" | "replied" | "proposal_drafted" | "won" | "lost" | "archived";

export type LeadRecord = {
  id: string;
  createdAt: string;
  status: LeadStatus;
  source: "website_contact" | "website_proposal";
  locale: Locale;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  timezone: string;
  services: string[];
  goals: string;
  website: string;
  scope: string;
  timeline: string;
  budget: string;
  details: string;
  consentAt: string;
  /** Rule-based automated qualification (not AI, not a quote). */
  qualification: {
    categories: string[];
    missingInfo: string[];
    discoveryQuestions: string[];
    priority: "low" | "medium" | "high";
  } | null;
};

export type NewLead = Omit<LeadRecord, "id" | "createdAt" | "status">;

export interface PageStore {
  getPage(slug: string, locale: Locale): Promise<PageRecord | null>;
  listPages(): Promise<PageRecord[]>;
  /** Saves a validated draft. Never touches the published version. */
  saveDraft(slug: string, locale: Locale, content: PageLocaleContent): Promise<PageRecord>;
  /** Replaces the published version with the given validated content and records a revision. */
  publish(slug: string, locale: Locale, content: PageLocaleContent, note: string): Promise<PageRecord>;
  discardDraft(slug: string, locale: Locale): Promise<void>;
}

export interface LeadStore {
  createLead(lead: NewLead): Promise<LeadRecord>;
  listLeads(): Promise<LeadRecord[]>;
}

export const MAX_REVISIONS = 20;
