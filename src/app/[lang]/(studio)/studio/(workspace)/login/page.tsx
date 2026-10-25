import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { LoginForm } from "@/features/studio/login-form";
import { isStudioSignedIn, studioAuthConfig, studioAuthMode } from "@/lib/auth/studio-auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await connection(); // read the environment at request time, not build time
  if (await isStudioSignedIn()) redirect("/studio");
  const config = studioAuthConfig();
  const mode = studioAuthMode();
  const { status } = await searchParams;
  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="text-h2">Sign in to the studio</h1>
      <p className="mt-3 text-muted">The private workspace for editing pages and reviewing enquiries.</p>
      {status === "pending" ? (
        <p role="status" className="card mt-6 p-4 text-sm text-warning">Your account exists but is waiting for the owner to give it access. You can sign in once a role has been assigned.</p>
      ) : null}
      <div className="card mt-8 p-6">
        {config.ok ? (
          <LoginForm mode={mode} />
        ) : (
          <div role="status" className="space-y-3 text-sm">
            <p className="font-semibold text-warning">The studio login is not set up on this server yet.</p>
            <p className="text-muted">{config.problem}</p>
            <p className="text-muted">Add <code>STUDIO_PASSWORD</code> and <code>SESSION_SECRET</code> to your <code>.env.local</code> file (never to the code or Git), then restart the server. Step-by-step instructions are in <code>docs/editor.md</code>.</p>
          </div>
        )}
      </div>
      <p className="mt-6 text-xs text-subtle">
        {mode === "supabase"
          ? "Accounts are created by the owner in Supabase. There is no public sign-up."
          : "Local single-owner login for development. Connect Supabase to use personal accounts with roles (see docs/supabase.md)."}
      </p>
    </div>
  );
}
