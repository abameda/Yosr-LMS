// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

import { readTrustedAuthIdentity } from "@/modules/identity/session/trusted-claims";

const nowInSeconds = 1_800_000_000;

describe("trusted Auth claims", () => {
  it("returns an identity only from validated, unexpired claims", async () => {
    const getClaims = vi.fn().mockResolvedValue({
      data: {
        claims: {
          email: "customer@example.com",
          exp: nowInSeconds + 300,
          sub: "auth-user-id",
        },
      },
      error: null,
    });

    await expect(
      readTrustedAuthIdentity({ auth: { getClaims } }, nowInSeconds),
    ).resolves.toEqual({
      authUserId: "auth-user-id",
      email: "customer@example.com",
      expiresAt: nowInSeconds + 300,
    });
    expect(getClaims).toHaveBeenCalledOnce();
  });

  it.each([
    {
      data: { claims: { exp: nowInSeconds + 300 } },
      error: null,
    },
    {
      data: {
        claims: { exp: nowInSeconds, sub: "auth-user-id" },
      },
      error: null,
    },
    {
      data: { claims: null },
      error: new Error("invalid JWT"),
    },
  ])("rejects forged, expired, or malformed claims", async (result) => {
    const getClaims = vi.fn().mockResolvedValue(result);

    await expect(
      readTrustedAuthIdentity({ auth: { getClaims } }, nowInSeconds),
    ).resolves.toBeNull();
  });

  it("never falls back to getSession for authorization", async () => {
    const getClaims = vi.fn().mockResolvedValue({
      data: { claims: null },
      error: new Error("invalid JWT"),
    });
    const getSession = vi.fn();

    await readTrustedAuthIdentity(
      {
        auth: {
          getClaims,
          getSession,
        },
      },
      nowInSeconds,
    );

    expect(getSession).not.toHaveBeenCalled();
  });
});
