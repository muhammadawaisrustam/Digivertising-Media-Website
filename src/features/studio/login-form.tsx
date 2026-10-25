"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="studio-password" className="block text-sm font-medium">Studio password</label>
        <input id="studio-password" name="password" type="password" autoComplete="current-password" required className="mt-2 block w-full rounded-xl border border-line-strong bg-ink-950/70 px-4 py-3 focus:border-signal-400 focus:outline-none" aria-describedby={state.error ? "login-error" : undefined} />
      </div>
      {state.error ? <p id="login-error" role="alert" className="text-sm text-danger">{state.error}</p> : null}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
