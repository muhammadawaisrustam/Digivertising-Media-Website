/**
 * Runs the Supabase storage code against a local Supabase-compatible stack
 * (see docs/supabase.md, "Testing against a local copy"). Skipped unless
 * LOCAL_SUPABASE_URL, LOCAL_SUPABASE_ANON_KEY and LOCAL_SUPABASE_SERVICE_KEY are
 * set. Never point these at the live project: the test creates accounts and rows.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";
import { blankLandingPage } from "@/features/pages/seed";
import { SupabasePublicReader, SupabaseStore } from "@/lib/database/supabase-store";
import type { NewLead } from "@/lib/database/types";

const url = process.env.LOCAL_SUPABASE_URL;
const anonKey = process.env.LOCAL_SUPABASE_ANON_KEY;
const serviceKey = process.env.LOCAL_SUPABASE_SERVICE_KEY;
const enabled = Boolean(url && anonKey && serviceKey);
if (enabled && !/^http:\/\/(127\.0\.0\.1|localhost)[:/]/.test(url!)) throw new Error("LOCAL_SUPABASE_URL must point at a local stack.");

const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const run = Date.now().toString(36);
const password = "local-test-password-123";

async function signedIn(email: string): Promise<{ client: SupabaseClient; id: string }> {
  const client = createClient(url!, anonKey!, opts);
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw error ?? new Error("no user");
  return { client, id: data.user.id };
}

const lead: NewLead = {
  source: "website_contact", locale: "en", name: "Local Test", businessName: "", email: "local@example.com", phone: "",
  country: "", timezone: "", services: ["seo"], goals: "", website: "", scope: "", timeline: "", budget: "",
  details: "Integration test enquiry (local test data).", consentAt: new Date().toISOString(), qualification: null,
};

describe.skipIf(!enabled)("Supabase storage (local stack)", () => {
  let admin: SupabaseClient;
  const emails = { owner: `owner-${run}@example.test`, editor: `editor-${run}@example.test`, viewer: `viewer-${run}@example.test`, pending: `pending-${run}@example.test` };

  beforeAll(async () => {
    admin = createClient(url!, serviceKey!, opts);
    for (const [role, email] of Object.entries(emails)) {
      const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
      if (error) throw error;
      if (role !== "pending") {
        const res = await admin.from("profiles").update({ role }).eq("id", data.user!.id);
        if (res.error) throw res.error;
      }
    }
  });

  it("gives new accounts the pending role", async () => {
    const { client, id } = await signedIn(emails.pending);
    const { data } = await client.from("profiles").select("role").eq("id", id).single();
    expect(data?.role).toBe("pending");
    // A pending account cannot read pages or enquiries.
    expect((await client.from("pages").select("slug")).data).toEqual([]);
    expect((await client.from("leads").select("id")).data).toEqual([]);
  });

  it("lets an editor save, publish and keep versions; the public sees only the published page", async () => {
    const { client, id } = await signedIn(emails.editor);
    const store = new SupabaseStore(client, id);
    const slug = `itest-${run}`;
    const draft = blankLandingPage("Local integration test page");

    const saved = await store.saveDraft(slug, "en", draft);
    expect(saved.draft?.blocks.length).toBeGreaterThan(0);

    const reader = new SupabasePublicReader(createClient(url!, anonKey!, opts));
    expect(await reader.getPublished(slug, "en")).toBeNull();

    const published = await store.publish(slug, "en", draft, "first version");
    expect(published.draft).toBeNull();
    expect(published.revisions[0]?.note).toBe("first version");
    expect(await reader.getPublished(slug, "en")).toMatchObject({ blocks: draft.blocks });
    expect(await reader.listPublishedLandingSlugs("en")).toContain(slug);

    // Editors cannot read enquiries.
    expect((await client.from("leads").select("id")).data).toEqual([]);
  });

  it("does not let a viewer change pages", async () => {
    const { client, id } = await signedIn(emails.viewer);
    const store = new SupabaseStore(client, id);
    await expect(store.saveDraft(`viewer-${run}`, "en", blankLandingPage("Not allowed"))).rejects.toThrow();
  });

  it("stores enquiries with the secret key, and only owners and admins can read them", async () => {
    const created = await new SupabaseStore(admin).createLead(lead);
    expect(created.status).toBe("new");

    const anon = createClient(url!, anonKey!, opts);
    expect((await anon.from("leads").select("id")).data ?? []).toEqual([]);
    const anonInsert = await anon.from("leads").insert({ name: "x" });
    expect(anonInsert.error).not.toBeNull();

    const { client, id } = await signedIn(emails.owner);
    const leads = await new SupabaseStore(client, id).listLeads();
    expect(leads.some((l) => l.id === created.id)).toBe(true);
  });

  it("lets editors upload images to the media bucket, and refuses viewers", async () => {
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==", "base64");
    const editor = (await signedIn(emails.editor)).client;
    const key = `uploads/itest/${run}.png`;
    const ok = await editor.storage.from("media").upload(key, png, { contentType: "image/png", upsert: false });
    expect(ok.error).toBeNull();
    const res = await fetch(editor.storage.from("media").getPublicUrl(key).data.publicUrl);
    expect(res.status).toBe(200);
    expect(Buffer.from(await res.arrayBuffer()).equals(png)).toBe(true);

    const outside = await editor.storage.from("media").upload(`elsewhere/${run}.png`, png, { contentType: "image/png" });
    expect(outside.error).not.toBeNull();
    const viewer = (await signedIn(emails.viewer)).client;
    const refused = await viewer.storage.from("media").upload(`uploads/itest/${run}-viewer.png`, png, { contentType: "image/png" });
    expect(refused.error).not.toBeNull();
  });

  it("stops a user from making themselves owner", async () => {
    const { client, id } = await signedIn(emails.editor);
    await client.from("profiles").update({ role: "owner" }).eq("id", id);
    const { data } = await admin.from("profiles").select("role").eq("id", id).single();
    expect(data?.role).toBe("editor");
  });
});
