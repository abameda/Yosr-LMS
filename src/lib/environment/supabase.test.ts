// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  readPrivilegedSupabaseEnvironment,
  readPublicSupabaseEnvironment,
} from "@/lib/environment/supabase";

const localUrl = "http://127.0.0.1:55321";
const publishableKey = "sb_publishable_test-value";

describe("Supabase environment", () => {
  it.each([undefined, "", "   "])(
    "rejects a missing public Supabase URL",
    (supabaseUrl) => {
      expect(() =>
        readPublicSupabaseEnvironment({
          NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishableKey,
        }),
      ).toThrow("NEXT_PUBLIC_SUPABASE_URL");
    },
  );

  it.each(["not-a-url", "ftp://example.com", "https://"])(
    "rejects a malformed public Supabase URL",
    (supabaseUrl) => {
      expect(() =>
        readPublicSupabaseEnvironment({
          NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishableKey,
        }),
      ).toThrow("NEXT_PUBLIC_SUPABASE_URL");
    },
  );

  it.each([undefined, "", "sb_secret_server-only", "service_role"])(
    "rejects a missing or privileged browser key",
    (key) => {
      expect(() =>
        readPublicSupabaseEnvironment({
          NEXT_PUBLIC_SUPABASE_URL: localUrl,
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
        }),
      ).toThrow("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    },
  );

  it("accepts the documented local Auth configuration", () => {
    expect(
      readPublicSupabaseEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: localUrl,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishableKey,
      }),
    ).toEqual({
      publishableKey,
      supabaseUrl: localUrl,
    });
  });

  it("requires a secret key for privileged server operations", () => {
    expect(() =>
      readPrivilegedSupabaseEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: localUrl,
        SUPABASE_SECRET_KEY: "",
      }),
    ).toThrow("SUPABASE_SECRET_KEY");
  });

  it("does not include rejected values in errors", () => {
    const secretValue = "private-test-value-do-not-expose";

    expect(() =>
      readPublicSupabaseEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: localUrl,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: secretValue,
      }),
    ).toThrowError(
      expect.objectContaining({
        message: expect.not.stringContaining(secretValue),
      }),
    );
  });
});
