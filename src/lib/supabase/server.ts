import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { readPublicSupabaseEnvironment } from "@/lib/environment/supabase";

export async function createServerSupabaseClient() {
  const { publishableKey, supabaseUrl } = readPublicSupabaseEnvironment(
    process.env,
  );
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, options, value } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot write cookies; proxy.ts owns refresh.
        }
      },
    },
  });
}
