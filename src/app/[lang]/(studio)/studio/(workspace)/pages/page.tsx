import type { Metadata } from "next";
import Link from "next/link";
import { CreatePageForm } from "@/features/studio/create-page-form";
import { editablePages, isFixedPage, pagePath } from "@/features/pages/seed";
import { listEditablePages } from "@/features/pages/service";
import { requireStudio } from "@/lib/auth/studio-auth";
import { languageName } from "@/features/studio/labels";

export const metadata: Metadata = { title: "Pages" };

export default async function StudioPages() {
  await requireStudio();
  const pages = await listEditablePages();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h2">Pages</h1>
        <p className="mt-2 text-muted">Edit page content block by block. Changes stay in a draft until you publish them.</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-start text-sm">
          <thead className="bg-ink-900/60 text-subtle">
            <tr>
              <th scope="col" className="px-4 py-3 text-start font-medium">Page</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">Address</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">Status</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pages.map((p) => (
              <tr key={p.slug}>
                <td className="px-4 py-3 font-medium">{isFixedPage(p.slug) ? editablePages[p.slug].label : p.slug}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted" dir="ltr">{pagePath(p.slug)}</td>
                <td className="px-4 py-3 text-muted">
                  {p.hasDraft ? <span className="text-warning">Draft waiting</span> : p.publishedAt ? "Published" : isFixedPage(p.slug) ? "Built-in version live" : "Not published yet"}
                </td>
                <td className="px-4 py-3">
                  <span className="flex gap-3">
                    {(isFixedPage(p.slug) ? (["en", "ar"] as const) : p.locales).map((l) => (
                      <Link key={l} href={`/studio/pages/${p.slug}/${l}`} className="text-signal-300 underline">
                        {languageName[l]}
                      </Link>
                    ))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="card p-6">
        <h2 className="text-h3">New landing page</h2>
        <p className="mt-1 text-sm text-muted">Starts as a draft with a heading and a call to action. It is not visible until you publish it.</p>
        <div className="mt-4">
          <CreatePageForm />
        </div>
      </section>
    </div>
  );
}
