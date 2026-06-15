import { createBrowserClient } from "@supabase/ssr";

import { readPublicSupabaseEnvironment } from "@/lib/environment/supabase";

export function createBrowserSupabaseClient() {
  const { publishableKey, supabaseUrl } = readPublicSupabaseEnvironment({
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });

  return createBrowserClient(supabaseUrl, publishableKey);
}
