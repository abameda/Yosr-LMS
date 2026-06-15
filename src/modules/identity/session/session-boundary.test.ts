// @vitest-environment node

import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("authentication import and rendering boundaries", () => {
  it("uses explicit public environment references in the browser client", async () => {
    const source = await readFile(
      path.resolve("src/lib/supabase/client.ts"),
      "utf8",
    );

    expect(source).toContain("process.env.NEXT_PUBLIC_SUPABASE_URL");
    expect(source).toContain(
      "process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  });

  it("keeps credential-free browser verification available before identity CI", async () => {
    const globalSetup = await readFile(
      path.resolve("tests/e2e/global-setup.ts"),
      "utf8",
    );
    const authSessionSpec = await readFile(
      path.resolve("tests/e2e/auth-session.spec.ts"),
      "utf8",
    );

    expect(globalSetup).toContain("sb_publishable_test-value");
    expect(globalSetup).toContain("http://127.0.0.1:55321");
    expect(authSessionSpec).toContain("test.skip(");
  });

  it.each([
    "src/lib/supabase/server.ts",
    "src/lib/supabase/admin.ts",
    "src/modules/identity/session/trusted-claims.ts",
  ])("marks %s as server-only", async (filePath) => {
    const source = await readFile(path.resolve(filePath), "utf8");

    expect(source).toMatch(/^import "server-only";/);
  });

  it.each(["src/app/(authenticated)/layout.tsx", "src/app/(admin)/layout.tsx"])(
    "forces authenticated route group %s to render dynamically",
    async (filePath) => {
      const source = await readFile(path.resolve(filePath), "utf8");

      expect(source).toContain('export const dynamic = "force-dynamic";');
    },
  );
});
