"use client";

import { useActionState } from "react";
import { createLandingPageAction, type CreatePageState } from "./actions";

export function CreatePageForm() {
  const [state, action, pending] = useActionState<CreatePageState, FormData>(createLandingPageAction, {});
  const input = "mt-1.5 block w-full rounded-lg border border-line-strong bg-ink-950/70 px-3 py-2 text-sm focus:border-signal-400 focus:outline-none";
  return (
    <form action={action} className="grid gap-4 md:grid-cols-[1fr_1fr_8rem_auto] md:items-end">
      <div>
        <label htmlFor="lp-title" className="text-sm font-medium">Page title</label>
        <input id="lp-title" name="title" required maxLength={70} className={input} placeholder="Google Ads audit" />
      </div>
      <div>
        <label htmlFor="lp-slug" className="text-sm font-medium">Address <span className="text-subtle">(/landing/…)</span></label>
        <input id="lp-slug" name="slug" required maxLength={60} pattern="[a-z0-9]+(-[a-z0-9]+)*" dir="ltr" className={input} placeholder="google-ads-audit" />
      </div>
      <div>
        <label htmlFor="lp-locale" className="text-sm font-medium">Language</label>
        <select id="lp-locale" name="locale" className={input} defaultValue="en">
          <option value="en">English</option>
          <option value="ar">Arabic</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary !py-2" disabled={pending}>Create draft</button>
      {state.error ? <p role="alert" className="text-sm text-danger md:col-span-4">{state.error}</p> : null}
    </form>
  );
}
