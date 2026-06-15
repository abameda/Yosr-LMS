export type RegistrationInput = {
  email: string;
  password: string;
};

export type RegistrationFieldErrors = Partial<
  Record<keyof RegistrationInput, string>
>;

export type RegistrationParseResult =
  | {
      success: true;
      data: RegistrationInput;
    }
  | {
      success: false;
      fieldErrors: RegistrationFieldErrors;
    };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseRegistrationInput(
  formData: FormData,
): RegistrationParseResult {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const email =
    typeof emailValue === "string"
      ? emailValue.trim().toLocaleLowerCase("en-US")
      : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const fieldErrors: RegistrationFieldErrors = {};

  if (!email || email.length > 320 || !emailPattern.test(email)) {
    fieldErrors.email = "أدخل بريدًا إلكترونيًا صحيحًا.";
  }

  if (password.length < 8) {
    fieldErrors.password = "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.";
  } else if (password.length > 72) {
    fieldErrors.password = "يجب ألا تتجاوز كلمة المرور 72 حرفًا.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return {
    success: true,
    data: { email, password },
  };
}
