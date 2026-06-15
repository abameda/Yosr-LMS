import type { CustomerAuthIdentity } from "@/modules/identity/services/provision-customer";
import { provisionCustomer } from "@/modules/identity/services/provision-customer";

import { parseRegistrationInput } from "./registration-schema";
import type { RegistrationState } from "./registration-state";

type SignUpResult = {
  data: {
    user: {
      id: string;
      email?: string | null;
      email_confirmed_at?: string | null;
      identities?: unknown[] | null;
    } | null;
  };
  error: {
    code?: string;
    message?: string;
  } | null;
};

type RegistrationAuthClient = {
  auth: {
    signUp(input: { email: string; password: string }): Promise<SignUpResult>;
  };
};

type RegistrationDependencies = {
  createAuthClient(): Promise<RegistrationAuthClient>;
  provision(identity: CustomerAuthIdentity): Promise<unknown>;
};

const existingEmailState: RegistrationState = {
  status: "existing_email",
  message: "يوجد حساب بهذا البريد. جرّب تسجيل الدخول أو استعادة كلمة المرور.",
  fieldErrors: {},
};

function isExistingEmailError(error: SignUpResult["error"]) {
  return (
    error?.code === "user_already_exists" ||
    error?.message?.toLocaleLowerCase("en-US").includes("already registered")
  );
}

function createDefaultDependencies(): RegistrationDependencies {
  return {
    async createAuthClient() {
      const { createServerSupabaseClient } =
        await import("@/lib/supabase/server");

      return createServerSupabaseClient();
    },
    async provision(identity) {
      const { database } = await import("@/lib/database/client");

      return provisionCustomer(identity, database);
    },
  };
}

export async function registerCustomer(
  _previousState: RegistrationState,
  formData: FormData,
  dependencies: RegistrationDependencies = createDefaultDependencies(),
): Promise<RegistrationState> {
  const parsed = parseRegistrationInput(formData);

  if (!parsed.success) {
    return {
      status: "invalid",
      fieldErrors: parsed.fieldErrors,
    };
  }

  const authClient = await dependencies.createAuthClient();
  const { data, error } = await authClient.auth.signUp(parsed.data);

  if (isExistingEmailError(error)) {
    return existingEmailState;
  }

  if (error || !data.user) {
    return {
      status: "error",
      message: "تعذر إنشاء الحساب الآن. حاول مرة أخرى لاحقًا.",
      fieldErrors: {},
    };
  }

  if (data.user.identities && data.user.identities.length === 0) {
    return existingEmailState;
  }

  const email = data.user.email ?? parsed.data.email;

  try {
    await dependencies.provision({
      authUserId: data.user.id,
      email,
      emailVerifiedAt: data.user.email_confirmed_at
        ? new Date(data.user.email_confirmed_at)
        : null,
    });
  } catch {
    return {
      status: "error",
      message: "تعذر إكمال إعداد الحساب الآن. حاول مرة أخرى لاحقًا.",
      fieldErrors: {},
    };
  }

  return {
    status: "success",
    message:
      "تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيد الحساب قبل تسجيل الدخول.",
    fieldErrors: {},
  };
}
