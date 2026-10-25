import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";

const noSession = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } } as const;

function requireConfig() {
  const config = supabaseConfig();
  if (!config) throw new Error("Supabase is not configured.");
  return config;
}

/** Anonymous client for public reads (only the published-page functions are open to it). */
export function createPublicClient(): SupabaseClient {
  const { url, publishableKey } = requireConfig();
  return createClient(url, publishableKey, noSession);
}

export class SecretKeyMissingError extends Error {
  constructor() {
    super("SUPABASE_SECRET_KEY is not set, so website enquiries cannot be stored.");
  }
}

export function hasSecretKey(): boolean {
  return Boolean(process.env.SUPABASE_SECRET_KEY?.trim());
}

/**
 * Server-only client with the secret key. It bypasses Row Level Security, so it
 * is used for exactly one job: storing website enquiries after the server has
 * validated them and checked for spam.
 */
export function createSecretClient(): SupabaseClient {
  const { url } = requireConfig();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!key) throw new SecretKeyMissingError();
  return createClient(url, key, noSession);
}

/** Client acting as the signed-in studio user. Row Level Security applies to everything it does. */
export async function createStudioClient(): Promise<SupabaseClient> {
  const { url, publishableKey } = requireConfig();
  const store = await cookies();
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only. The proxy refreshes sessions.
        }
      },
    },
  });
}
