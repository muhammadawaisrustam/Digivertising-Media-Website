import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/i18n/config";
import type { PageLocaleContent } from "@/features/pages/schema";
import { MAX_REVISIONS, type LeadRecord, type LeadStore, type NewLead, type PageRecord, type PageStore, type PublicPageReader } from "./types";

/**
 * Supabase storage. The client decides the permissions: the studio passes a
 * client signed in as the user (Row Level Security applies), enquiries use the
 * server-only secret client, and public reads use the anonymous client.
 */

type PageRow = {
  slug: string;
  locale: Locale;
  published: PageLocaleContent | null;
  draft: PageLocaleContent | null;
  published_at: string | null;
  updated_at: string;
};

type LeadRow = {
  id: string;
  created_at: string;
  status: LeadRecord["status"];
  source: LeadRecord["source"];
  locale: Locale;
  name: string;
  business_name: string;
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
  consent_at: string;
  qualification: LeadRecord["qualification"];
};

function check<T>(result: { data: T; error: { message: string } | null }, action: string): T {
  if (result.error) throw new Error(`Supabase ${action} failed: ${result.error.message}`);
  return result.data;
}

const pageColumns = "slug, locale, published, draft, published_at, updated_at";

function toPage(row: PageRow, revisions: PageRecord["revisions"]): PageRecord {
  return { slug: row.slug, locale: row.locale, published: row.published, draft: row.draft, publishedAt: row.published_at, updatedAt: row.updated_at, revisions };
}

export function toLead(row: LeadRow): LeadRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    source: row.source,
    locale: row.locale,
    name: row.name,
    businessName: row.business_name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    timezone: row.timezone,
    services: row.services,
    goals: row.goals,
    website: row.website,
    scope: row.scope,
    timeline: row.timeline,
    budget: row.budget,
    details: row.details,
    consentAt: row.consent_at,
    qualification: row.qualification,
  };
}

export function fromNewLead(lead: NewLead): Omit<LeadRow, "id" | "created_at" | "status"> {
  return {
    source: lead.source,
    locale: lead.locale,
    name: lead.name,
    business_name: lead.businessName,
    email: lead.email,
    phone: lead.phone,
    country: lead.country,
    timezone: lead.timezone,
    services: lead.services,
    goals: lead.goals,
    website: lead.website,
    scope: lead.scope,
    timeline: lead.timeline,
    budget: lead.budget,
    details: lead.details,
    consent_at: lead.consentAt,
    qualification: lead.qualification,
  };
}

export class SupabaseStore implements PageStore, LeadStore {
  constructor(
    private readonly db: SupabaseClient,
    /** The signed-in user's id, recorded on changes. Null for system writes. */
    private readonly actor: string | null = null,
  ) {}

  async getPage(slug: string, locale: Locale): Promise<PageRecord | null> {
    const row = check(await this.db.from("pages").select(pageColumns).eq("slug", slug).eq("locale", locale).maybeSingle<PageRow>(), "read page");
    if (!row) return null;
    const revisions = check(
      await this.db
        .from("page_revisions")
        .select("id, content, note, published_at")
        .eq("slug", slug)
        .eq("locale", locale)
        .order("published_at", { ascending: false })
        .limit(MAX_REVISIONS),
      "read versions",
    ) as { id: string; content: PageLocaleContent; note: string; published_at: string }[];
    return toPage(row, revisions.map((r) => ({ id: r.id, content: r.content, note: r.note, publishedAt: r.published_at })));
  }

  async listPages(): Promise<PageRecord[]> {
    const rows = check(await this.db.from("pages").select(pageColumns).order("slug"), "list pages") as PageRow[];
    return rows.map((r) => toPage(r, []));
  }

  async saveDraft(slug: string, locale: Locale, content: PageLocaleContent): Promise<PageRecord> {
    check(
      await this.db.from("pages").upsert({ slug, locale, draft: content, updated_at: new Date().toISOString(), updated_by: this.actor }, { onConflict: "slug,locale" }),
      "save draft",
    );
    return (await this.getPage(slug, locale))!;
  }

  async publish(slug: string, locale: Locale, content: PageLocaleContent, note: string): Promise<PageRecord> {
    const now = new Date().toISOString();
    check(
      await this.db.from("pages").upsert({ slug, locale, published: content, draft: null, published_at: now, updated_at: now, updated_by: this.actor }, { onConflict: "slug,locale" }),
      "publish page",
    );
    check(await this.db.from("page_revisions").insert({ slug, locale, content, note, published_at: now, published_by: this.actor }), "record version");
    if (this.actor) {
      // Best effort: a failed log entry must not undo a successful publish.
      await this.db.from("audit_log").insert({ actor: this.actor, action: "page.publish", target: `${slug}:${locale}`, details: { note } });
    }
    return (await this.getPage(slug, locale))!;
  }

  async discardDraft(slug: string, locale: Locale): Promise<void> {
    check(await this.db.from("pages").update({ draft: null, updated_at: new Date().toISOString(), updated_by: this.actor }).eq("slug", slug).eq("locale", locale), "discard draft");
  }

  async createLead(lead: NewLead): Promise<LeadRecord> {
    const row = check(await this.db.from("leads").insert(fromNewLead(lead)).select("*").single<LeadRow>(), "store enquiry");
    return toLead(row as LeadRow);
  }

  async listLeads(): Promise<LeadRecord[]> {
    const rows = check(await this.db.from("leads").select("*").order("created_at", { ascending: false }).limit(500), "list enquiries") as LeadRow[];
    return rows.map(toLead);
  }
}

/** Public reads through the published-only database functions (no table access needed). */
export class SupabasePublicReader implements PublicPageReader {
  constructor(private readonly db: SupabaseClient) {}

  async getPublished(slug: string, locale: Locale): Promise<unknown | null> {
    return check(await this.db.rpc("published_page", { p_slug: slug, p_locale: locale }), "read live page") ?? null;
  }

  async listPublishedLandingSlugs(locale: Locale): Promise<string[]> {
    const rows = check(await this.db.rpc("published_landing_slugs", { p_locale: locale }), "list landing pages") as string[] | null;
    return rows ?? [];
  }
}
