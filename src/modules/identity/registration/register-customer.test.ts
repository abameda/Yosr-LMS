// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

import { registerCustomer } from "@/modules/identity/registration/register-customer";
import { initialRegistrationState } from "@/modules/identity/registration/registration-state";

function createDependencies() {
  return {
    createAuthClient: vi.fn(),
    provision: vi.fn(),
  };
}

describe("registerCustomer", () => {
  it("validates before calling Supabase Auth", async () => {
    const dependencies = createDependencies();
    const formData = new FormData();
    formData.set("email", "invalid");
    formData.set("password", "short");

    const result = await registerCustomer(
      initialRegistrationState,
      formData,
      dependencies,
    );

    expect(result.status).toBe("invalid");
    expect(result.fieldErrors).toEqual({
      email: "أدخل بريدًا إلكترونيًا صحيحًا.",
      password: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
    });
    expect(dependencies.createAuthClient).not.toHaveBeenCalled();
  });

  it("signs up with normalized credentials and provisions only trusted Auth fields", async () => {
    const signUp = vi.fn().mockResolvedValue({
      data: {
        user: {
          id: "auth-user-id",
          email: "learner@example.com",
          email_confirmed_at: null,
          identities: [{ id: "identity-id" }],
        },
      },
      error: null,
    });
    const dependencies = createDependencies();
    dependencies.createAuthClient.mockResolvedValue({ auth: { signUp } });
    dependencies.provision.mockResolvedValue({
      learnerProfileId: "learner-profile-id",
      userId: "local-user-id",
    });
    const formData = new FormData();
    formData.set("email", "  Learner@Example.COM ");
    formData.set("password", "StrongPass123");
    formData.set("role", "ADMIN");
    formData.set("status", "DISABLED");
    formData.set("userId", "attacker-selected-owner");

    const result = await registerCustomer(
      initialRegistrationState,
      formData,
      dependencies,
    );

    expect(signUp).toHaveBeenCalledWith({
      email: "learner@example.com",
      password: "StrongPass123",
    });
    expect(dependencies.provision).toHaveBeenCalledWith({
      authUserId: "auth-user-id",
      email: "learner@example.com",
      emailVerifiedAt: null,
    });
    expect(result).toEqual({
      status: "success",
      message:
        "تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيد الحساب قبل تسجيل الدخول.",
      fieldErrors: {},
    });
  });

  it("returns login or password-reset guidance for an existing email", async () => {
    const signUp = vi.fn().mockResolvedValue({
      data: {
        user: {
          id: "obfuscated-user-id",
          email: "existing@example.com",
          email_confirmed_at: null,
          identities: [],
        },
      },
      error: null,
    });
    const dependencies = createDependencies();
    dependencies.createAuthClient.mockResolvedValue({ auth: { signUp } });
    const formData = new FormData();
    formData.set("email", "existing@example.com");
    formData.set("password", "StrongPass123");

    const result = await registerCustomer(
      initialRegistrationState,
      formData,
      dependencies,
    );

    expect(result).toEqual({
      status: "existing_email",
      message:
        "يوجد حساب بهذا البريد. جرّب تسجيل الدخول أو استعادة كلمة المرور.",
      fieldErrors: {},
    });
    expect(dependencies.provision).not.toHaveBeenCalled();
  });
});
