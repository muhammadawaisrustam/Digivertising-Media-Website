import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Locale } from "@/i18n/config";
import type { PageLocaleContent } from "@/features/pages/schema";
import { MAX_REVISIONS, type LeadRecord, type LeadStore, type NewLead, type PageRecord, type PageStore } from "./types";

/**
 * Local JSON file storage for development and single-server use.
 * Data lives in DATA_DIR (default ./.data, git-ignored). Not suitable for
 * serverless hosting, where files are not persistent: use Supabase there.
 */
export class FileStore implements PageStore, LeadStore {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly dir: string) {}

  private file(name: string) {
    return path.join(this.dir, `${name}.json`);
  }

  private async read<T>(name: string, fallback: T): Promise<T> {
    try {
      return JSON.parse(await readFile(this.file(name), "utf8")) as T;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
      throw err;
    }
  }

  private async write(name: string, data: unknown) {
    await mkdir(this.dir, { recursive: true });
    const tmp = `${this.file(name)}.${randomUUID()}.tmp`;
    await writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
    await rename(tmp, this.file(name)); // atomic replace: a crash never leaves half a file
  }

  /** Serialises writes so concurrent requests cannot overwrite each other. */
  private exclusive<T>(fn: () => Promise<T>): Promise<T> {
    const run = this.queue.then(fn, fn);
    this.queue = run.catch(() => undefined);
    return run;
  }

  private key(slug: string, locale: Locale) {
    return `${slug}:${locale}`;
  }

  async getPage(slug: string, locale: Locale) {
    const pages = await this.read<Record<string, PageRecord>>("pages", {});
    return pages[this.key(slug, locale)] ?? null;
  }

  async listPages() {
    return Object.values(await this.read<Record<string, PageRecord>>("pages", {}));
  }

  private mutatePage(slug: string, locale: Locale, change: (p: PageRecord) => PageRecord) {
    return this.exclusive(async () => {
      const pages = await this.read<Record<string, PageRecord>>("pages", {});
      const now = new Date().toISOString();
      const current: PageRecord = pages[this.key(slug, locale)] ?? {
        slug, locale, published: null, draft: null, publishedAt: null, updatedAt: now, revisions: [],
      };
      const next = { ...change(current), updatedAt: now };
      pages[this.key(slug, locale)] = next;
      await this.write("pages", pages);
      return next;
    });
  }

  saveDraft(slug: string, locale: Locale, content: PageLocaleContent) {
    return this.mutatePage(slug, locale, (p) => ({ ...p, draft: content }));
  }

  publish(slug: string, locale: Locale, content: PageLocaleContent, note: string) {
    return this.mutatePage(slug, locale, (p) => {
      const publishedAt = new Date().toISOString();
      const revision = { id: randomUUID(), content, publishedAt, note };
      return { ...p, published: content, draft: null, publishedAt, revisions: [revision, ...p.revisions].slice(0, MAX_REVISIONS) };
    });
  }

  async discardDraft(slug: string, locale: Locale) {
    await this.mutatePage(slug, locale, (p) => ({ ...p, draft: null }));
  }

  createLead(lead: NewLead) {
    return this.exclusive(async () => {
      const leads = await this.read<LeadRecord[]>("leads", []);
      const record: LeadRecord = { ...lead, id: randomUUID(), createdAt: new Date().toISOString(), status: "new" };
      leads.unshift(record);
      await this.write("leads", leads);
      return record;
    });
  }

  listLeads() {
    return this.read<LeadRecord[]>("leads", []);
  }
}
