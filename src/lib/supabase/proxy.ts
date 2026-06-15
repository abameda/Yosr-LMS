import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { readPublicSupabaseEnvironment } from "@/lib/environment/supabase";

type CookieToSet = {
  name: string;
  options: CookieOptions;
  value: string;
};

const privateCacheControl =
  "private, no-cache, no-store, max-age=0, must-revalidate";

export function applySupabaseCookies(
  request: NextRequest,
  cookiesToSet: CookieToSet[],
) {
  for (const { name, value } of cookiesToSet) {
    request.cookies.set(name, value);
  }

  const response = NextResponse.next({ request });

  for (const { name, options, value } of cookiesToSet) {
    response.cookies.set(name, value, options);
  }

  return response;
}

export function markAuthenticatedResponsePrivate(response: NextResponse) {
  response.headers.set("Cache-Control", privateCacheControl);
  return response;
}

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some(({ name }) => name.startsWith("sb-") && name.includes("-auth-token"));
}

export async function updateSession(request: NextRequest) {
  const { publishableKey, supabaseUrl } = readPublicSupabaseEnvironment(
    process.env,
  );
  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        response = applySupabaseCookies(request, cookiesToSet);
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();

  if (hasSupabaseAuthCookie(request) || (!error && data?.claims)) {
    return markAuthenticatedResponsePrivate(response);
  }

  return response;
}
