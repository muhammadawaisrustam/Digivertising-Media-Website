import { mkdir, writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { ACCOUNTS_FILE, PASSWORD, type Accounts } from "./helpers";

/** Creates one fresh account per role in the LOCAL stack and records the emails for the tests. */
export default async function globalSetup() {
  const run = Date.now().toString(36);
  const accounts: Accounts = { owner: `owner-${run}@example.test`, editor: `editor-${run}@example.test`, viewer: `viewer-${run}@example.test`, pending: `pending-${run}@example.test` };
  const admin = createClient(process.env.LOCAL_SUPABASE_URL!, process.env.LOCAL_SUPABASE_SERVICE_KEY!, { auth: { persistSession: false } });
  for (const [role, email] of Object.entries(accounts)) {
    const { data, error } = await admin.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true });
    if (error) throw error;
    if (role !== "pending") {
      const res = await admin.from("profiles").update({ role }).eq("id", data.user!.id);
      if (res.error) throw res.error;
    }
  }
  await mkdir(".data-e2e-supabase", { recursive: true });
  await writeFile(ACCOUNTS_FILE, JSON.stringify(accounts));
}
