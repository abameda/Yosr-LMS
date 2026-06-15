import { randomUUID } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { Pool } from "pg";

test("shows Arabic validation without submitting authority fields", async ({
  page,
}) => {
  await page.goto("/register");

  await expect(
    page.getByRole("heading", { name: "إنشاء حساب جديد" }),
  ).toBeVisible();
  await page.getByLabel("البريد الإلكتروني").fill("invalid");
  await page.getByLabel("كلمة المرور").fill("short");
  await page.getByRole("button", { name: "إنشاء الحساب" }).click();

  await expect(page.getByText("أدخل بريدًا إلكترونيًا صحيحًا.")).toBeVisible();
  await expect(
    page.getByText("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل."),
  ).toBeVisible();
  await expect(page.locator('[name="role"]')).toHaveCount(0);
  await expect(page.locator('[name="status"]')).toHaveCount(0);
  await expect(page.locator('[name="userId"]')).toHaveCount(0);
});

test("registers one Customer, one Learner profile, and sends confirmation email", async ({
  page,
}) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const testDatabaseUrl = process.env.TEST_DATABASE_URL;

  test.skip(
    !supabaseUrl || !secretKey || !testDatabaseUrl,
    "Live registration requires local Supabase Auth, Mailpit, and database configuration.",
  );

  const email = `task-1-5-${randomUUID()}@example.com`;
  const password = `Local-${randomUUID()}-Password`;
  const database = new Pool({ connectionString: testDatabaseUrl });
  const adminClient = createClient(supabaseUrl!, secretKey!, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  let authUserId: string | undefined;

  try {
    await page.goto("/register");
    await page.getByLabel("البريد الإلكتروني").fill(email);
    await page.getByLabel("كلمة المرور").fill(password);
    await page.getByRole("button", { name: "إنشاء الحساب" }).click();

    await expect(
      page.getByText(
        "تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيد الحساب قبل تسجيل الدخول.",
      ),
    ).toBeVisible();
    await expect(page.getByLabel("كلمة المرور")).toHaveValue("");

    const result = await database.query<{
      auth_user_id: string;
      profile_count: number;
      role: string;
      status: string;
    }>(
      `
        select
          u.auth_user_id,
          u.role::text as role,
          u.status::text as status,
          count(lp.id)::int as profile_count
        from users u
        left join learner_profiles lp on lp.user_id = u.id
        where u.normalized_email = $1
        group by u.id
      `,
      [email],
    );

    expect(result.rows).toEqual([
      {
        auth_user_id: expect.any(String),
        profile_count: 1,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
    ]);
    authUserId = result.rows[0]?.auth_user_id;

    await expect
      .poll(
        async () => {
          const response = await fetch(
            "http://127.0.0.1:55324/api/v1/messages",
          );
          const payload = (await response.json()) as {
            messages?: Array<{
              To?: Array<{ Address?: string }>;
            }>;
          };

          return Boolean(
            payload.messages?.some((message) =>
              message.To?.some(({ Address }) => Address === email),
            ),
          );
        },
        { timeout: 10_000 },
      )
      .toBe(true);
  } finally {
    await database.query("delete from users where normalized_email = $1", [
      email,
    ]);
    await database.end();

    if (authUserId) {
      await adminClient.auth.admin.deleteUser(authUserId);
    }
  }
});
