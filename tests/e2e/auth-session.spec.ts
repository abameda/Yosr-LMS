import { randomUUID } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

function encodeCookiePayload(payload: unknown) {
  return `base64-${Buffer.from(JSON.stringify(payload)).toString("base64url")}`;
}

test("refreshes a valid stale session and propagates the new cookie", async ({
  context,
  page,
}) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  test.skip(
    !supabaseUrl || !publishableKey || !secretKey,
    "Live refresh requires the local Supabase Auth test configuration.",
  );

  expect(supabaseUrl).toBeTruthy();
  expect(publishableKey).toBeTruthy();
  expect(secretKey).toBeTruthy();

  const adminClient = createClient(supabaseUrl!, secretKey!, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  const authClient = createClient(supabaseUrl!, publishableKey!, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  const email = `task-1-4-${randomUUID()}@example.com`;
  const password = `Local-${randomUUID()}-Password`;
  const {
    data: { user },
    error: createError,
  } = await adminClient.auth.admin.createUser({
    email,
    email_confirm: true,
    password,
  });

  expect(createError).toBeNull();
  expect(user).not.toBeNull();

  try {
    const {
      data: { session },
      error: signInError,
    } = await authClient.auth.signInWithPassword({ email, password });

    expect(signInError).toBeNull();
    expect(session).not.toBeNull();

    const staleCookieValue = encodeCookiePayload({
      ...session,
      expires_at: 1,
      expires_in: 0,
    });
    await context.addCookies([
      {
        name: "sb-127-auth-token",
        value: staleCookieValue,
        url: "http://127.0.0.1:3100",
      },
    ]);

    const response = await page.goto("/");
    const refreshedCookie = (await context.cookies()).find(
      ({ name }) => name === "sb-127-auth-token",
    );

    expect(response?.status()).toBe(200);
    expect(refreshedCookie?.value).toBeTruthy();
    expect(refreshedCookie?.value).not.toBe(staleCookieValue);
    expect(response?.headers()["cache-control"]).not.toContain("public");
  } finally {
    if (user) {
      await adminClient.auth.admin.deleteUser(user.id);
    }
  }
});

test("keeps a stale Auth cookie from producing a cacheable response", async ({
  context,
  page,
}) => {
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      value: encodeCookiePayload({}),
      url: "http://127.0.0.1:3100",
    },
  ]);

  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  const cacheControl = response?.headers()["cache-control"] ?? "";
  expect(cacheControl).toContain("no-cache");
  expect(cacheControl).not.toContain("public");
  expect(cacheControl).not.toContain("s-maxage");
});
