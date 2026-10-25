/**
 * Supabase settings from the environment. The URL and publishable key are
 * safe to expose (access is controlled by Row Level Security). The secret key
 * is server-only and is read in clients.ts.
 */
export type SupabaseConfig = { url: string; publishableKey: string };

export function supabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();
  return url && publishableKey ? { url, publishableKey } : null;
}

/** Supabase mode: pages, enquiries and studio accounts live in Supabase. Otherwise local files and a password. */
export function isSupabaseMode(): boolean {
  return supabaseConfig() !== null;
}
