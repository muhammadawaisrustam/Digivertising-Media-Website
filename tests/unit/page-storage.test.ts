import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { PageLocaleContent } from "@/features/pages/schema";
import { seedPage } from "@/features/pages/seed";
import { FileStore } from "@/lib/database/file-store";

let dir: string;

beforeAll(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "dv-pages-"));
  process.env.DATA_DIR = dir; // used by the page service (getStore)
});
afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

const withTitle = (title: string): PageLocaleContent => {
  const page = structuredClone(seedPage("about", "en")!);
  (page.blocks[0]!.data as { title: string }).title = title;
  return page;
};

describe("file store", () => {
  it("keeps drafts separate from the published page and records revisions", async () => {
    const store = new FileStore(path.join(dir, "store-a"));
    await store.saveDraft("about", "en", withTitle("Draft one"));
    let record = await store.getPage("about", "en");
    expect(record?.published).toBeNull();
    expect(record?.draft).not.toBeNull();

    await store.publish("about", "en", withTitle("Live one"), "first");
    record = await store.getPage("about", "en");
    expect(record?.draft).toBeNull();
    expect(record?.revisions).toHaveLength(1);
    expect(record?.publishedAt).toBeTruthy();

    await store.discardDraft("about", "en");
    expect((await store.getPage("about", "en"))?.published).not.toBeNull();
  });

  it("keeps at most 20 revisions, newest first", async () => {
    const store = new FileStore(path.join(dir, "store-b"));
    for (let i = 1; i <= 23; i++) await store.publish("about", "en", withTitle(`Version ${i}`), `v${i}`);
    const record = await store.getPage("about", "en");
    expect(record?.revisions).toHaveLength(20);
    expect(record?.revisions[0]?.note).toBe("v23");
  });

  it("handles concurrent writes without losing data", async () => {
    const store = new FileStore(path.join(dir, "store-c"));
    await Promise.all(Array.from({ length: 10 }, (_, i) => store.saveDraft(`page-${i}`, "en", withTitle(`P${i}`))));
    expect(await store.listPages()).toHaveLength(10);
  });
});

describe("page service", () => {
  it("rejects an invalid draft and never changes the live page", async () => {
    const service = await import("@/features/pages/service");
    const { getStore } = await import("@/lib/database");

    expect((await service.saveDraft("about", "en", withTitle("Good live"))).ok).toBe(true);
    expect((await service.publishDraft("about", "en", "ok")).ok).toBe(true);

    const invalid = await service.saveDraft("about", "en", withTitle(""));
    expect(invalid.ok).toBe(false);

    // Even if a broken draft reaches storage, publishing refuses it.
    await getStore().saveDraft("about", "en", withTitle("") as PageLocaleContent);
    const publish = await service.publishDraft("about", "en", "should fail");
    expect(publish.ok).toBe(false);
    const record = await getStore().getPage("about", "en");
    expect((record?.published?.blocks[0]?.data as { title: string }).title).toBe("Good live");
  });

  it("restores an earlier version into the draft only", async () => {
    const service = await import("@/features/pages/service");
    const { getStore } = await import("@/lib/database");
    await service.saveDraft("about", "en", withTitle("Second live"));
    await service.publishDraft("about", "en", "second");
    const record = await getStore().getPage("about", "en");
    const older = record!.revisions.find((r) => r.note === "ok")!;
    expect((await service.restoreRevision("about", "en", older.id)).ok).toBe(true);
    const after = await getStore().getPage("about", "en");
    expect((after?.draft?.blocks[0]?.data as { title: string }).title).toBe("Good live");
    expect((after?.published?.blocks[0]?.data as { title: string }).title).toBe("Second live");
  });

  it("validates landing page addresses", async () => {
    const service = await import("@/features/pages/service");
    expect((await service.createLandingPage("Bad Slug!", "Title", "en")).ok).toBe(false);
    expect((await service.createLandingPage("home", "Title", "en")).ok).toBe(false);
    expect((await service.createLandingPage("google-ads-audit", "Google Ads audit", "en")).ok).toBe(true);
    expect((await service.createLandingPage("google-ads-audit", "Again", "en")).ok).toBe(false);
    expect(await service.listPublishedLandingSlugs("en")).toEqual([]);
  });
});
