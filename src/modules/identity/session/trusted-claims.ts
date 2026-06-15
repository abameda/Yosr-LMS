import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type ClaimsResult = {
  data: {
    claims?: Record<string, unknown> | null;
  } | null;
  error: unknown;
};

type TrustedClaimsClient = {
  auth: {
    getClaims(): Promise<ClaimsResult>;
    getSession?: () => unknown;
  };
};

export type TrustedAuthIdentity = {
  authUserId: string;
  email?: string;
  expiresAt: number;
};

function parseTrustedClaims(
  claims: Record<string, unknown> | null | undefined,
  nowInSeconds: number,
): TrustedAuthIdentity | null {
  if (
    typeof claims?.sub !== "string" ||
    claims.sub.length === 0 ||
    typeof claims.exp !== "number" ||
    claims.exp <= nowInSeconds
  ) {
    return null;
  }

  return {
    authUserId: claims.sub,
    ...(typeof claims.email === "string" ? { email: claims.email } : {}),
    expiresAt: claims.exp,
  };
}

export async function readTrustedAuthIdentity(
  client?: TrustedClaimsClient,
  nowInSeconds = Math.floor(Date.now() / 1000),
): Promise<TrustedAuthIdentity | null> {
  const trustedClient = client ?? (await createServerSupabaseClient());
  const { data, error } = await trustedClient.auth.getClaims();

  if (error) {
    return null;
  }

  return parseTrustedClaims(data?.claims, nowInSeconds);
}
