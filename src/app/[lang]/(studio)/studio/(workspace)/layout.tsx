import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { logoutAction } from "@/features/studio/actions";
import { ADMINS, getStudioUser, hasRole, STAFF } from "@/lib/auth/studio-auth";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await getStudioUser();
  const signedIn = hasRole(user, STAFF);
  return (
    <>
      <header className="border-b border-line bg-ink-900/60">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/studio"><Logo /></Link>
            <span className="badge">Studio</span>
          </div>
          {signedIn ? (
            <nav aria-label="Studio" className="flex flex-wrap items-center gap-4 text-sm">
              <Link href="/studio" className="text-muted hover:text-fg">Dashboard</Link>
              <Link href="/studio/pages" className="text-muted hover:text-fg">Pages</Link>
              {hasRole(user, ADMINS) ? <Link href="/studio/leads" className="text-muted hover:text-fg">Leads</Link> : null}
              <Link href="/" className="text-muted hover:text-fg" target="_blank" rel="noreferrer">View site ↗</Link>
              <span className="text-xs text-subtle" data-testid="studio-user">{user?.email ? `${user.email} · ` : ""}{user?.role}</span>
              <form action={logoutAction}>
                <button type="submit" className="rounded-full border border-line px-3 py-1 text-muted hover:text-fg">Sign out</button>
              </form>
            </nav>
          ) : null}
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-8 md:px-6">{children}</main>
    </>
  );
}
