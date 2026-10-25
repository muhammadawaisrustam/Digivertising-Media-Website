"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const inputClass = "mt-2 block w-full rounded-xl border border-line-strong bg-ink-950/70 px-4 py-3 focus:border-signal-400 focus:outline-none";

/** mode "supabase": email + password account. mode "password": the local owner password. */
export function LoginForm({ mode }: { mode: "supabase" | "password" }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const describedBy = state.error ? "login-error" : undefined;
  return (
    <form action={action} className="space-y-4">
      {mode === "supabase" ? (
        <div>
          <label htmlFor="studio-email" className="block text-sm font-medium">Email</label>
          <input id="studio-email" name="email" type="email" autoComplete="username" required dir="ltr" className={inputClass} aria-describedby={describedBy} />
        </div>
      ) : null}
      <div>
        <label htmlFor="studio-password" className="block text-sm font-medium">{mode === "supabase" ? "Password" : "Studio password"}</label>
        <input id="studio-password" name="password" type="password" autoComplete="current-password" required className={inputClass} aria-describedby={describedBy} />
      </div>
      {state.error ? <p id="login-error" role="alert" className="text-sm text-danger">{state.error}</p> : null}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
