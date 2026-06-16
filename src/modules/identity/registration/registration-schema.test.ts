// @vitest-environment node

import { describe, expect, it } from "vitest";

import { parseRegistrationInput } from "@/modules/identity/registration/registration-schema";

describe("parseRegistrationInput", () => {
  it("normalizes a valid email and returns only email and password", () => {
    const formData = new FormData();
    formData.set("email", "  Learner@Example.COM ");
    formData.set("password", "StrongPass123");
    formData.set("role", "ADMIN");
    formData.set("status", "DISABLED");
    formData.set("userId", "attacker-selected-owner");

    expect(parseRegistrationInput(formData)).toEqual({
      success: true,
      data: {
        email: "learner@example.com",
        password: "StrongPass123",
      },
    });
  });

  it("rejects malformed email and short password with Arabic field guidance", () => {
    const formData = new FormData();
    formData.set("email", "not-an-email");
    formData.set("password", "short");

    expect(parseRegistrationInput(formData)).toEqual({
      success: false,
      fieldErrors: {
        email: "أدخل بريدًا إلكترونيًا صحيحًا.",
        password: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
      },
    });
  });
});
