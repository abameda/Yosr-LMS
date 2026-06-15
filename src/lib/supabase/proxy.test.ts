// @vitest-environment node

import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it } from "vitest";

import {
  applySupabaseCookies,
  markAuthenticatedResponsePrivate,
} from "@/lib/supabase/proxy";

describe("Supabase proxy cookies", () => {
  it("propagates refreshed cookies to the request and browser response", () => {
    const request = new NextRequest("http://localhost/account");
    const response = applySupabaseCookies(request, [
      {
        name: "sb-local-auth-token",
        value: "refreshed-token",
        options: {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
        },
      },
    ]);

    expect(request.cookies.get("sb-local-auth-token")?.value).toBe(
      "refreshed-token",
    );
    expect(response.cookies.get("sb-local-auth-token")?.value).toBe(
      "refreshed-token",
    );
    expect(response.cookies.get("sb-local-auth-token")?.httpOnly).toBe(true);
  });

  it("marks authenticated responses private and non-cacheable", () => {
    const response = markAuthenticatedResponsePrivate(NextResponse.next());

    expect(response.headers.get("Cache-Control")).toBe(
      "private, no-cache, no-store, max-age=0, must-revalidate",
    );
  });
});
