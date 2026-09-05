import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Creates an administrative Supabase client using the service role key.
 * This client bypasses Row Level Security (RLS) policies.
 *
 * IMPORTANT: Strictly restricted to server-side trusted operations, such as
 * fetching public display attributes (usernames, avatars) for public leaderboards
 * or background administrative maintenance. Never expose this client to the browser.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
