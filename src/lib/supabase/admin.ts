import "server-only";

import { createClient } from "@supabase/supabase-js";

import { readPrivilegedSupabaseEnvironment } from "@/lib/environment/supabase";

export function createPrivilegedSupabaseClient() {
  const { secretKey, supabaseUrl } = readPrivilegedSupabaseEnvironment(
    process.env,
  );

  return createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
