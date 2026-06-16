"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerCustomerAction } from "@/modules/identity/registration/actions";
import { initialRegistrationState } from "@/modules/identity/registration/registration-state";

export function RegistrationForm() {
  const [state, formAction, pending] = useActionState(
    registerCustomerAction,
    initialRegistrationState,
  );
  const isSuccess = state.status === "success";

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="registration-email">البريد الإلكتروني</Label>
        <Input
          id="registration-email"
          name="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          inputMode="email"
          maxLength={320}
          required
          aria-invalid={Boolean(state.fieldErrors.email)}
          aria-describedby={
            state.fieldErrors.email ? "registration-email-error" : undefined
          }
          disabled={pending || isSuccess}
        />
        {state.fieldErrors.email ? (
          <p id="registration-email-error" className="text-sm text-destructive">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="registration-password">كلمة المرور</Label>
        <Input
          id="registration-password"
          name="password"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          aria-invalid={Boolean(state.fieldErrors.password)}
          aria-describedby={
            state.fieldErrors.password
              ? "registration-password-help registration-password-error"
              : "registration-password-help"
          }
          disabled={pending || isSuccess}
        />
        <p
          id="registration-password-help"
          className="text-sm leading-6 text-muted-foreground"
        >
          استخدم 8 أحرف على الأقل، ويفضل الجمع بين الحروف والأرقام.
        </p>
        {state.fieldErrors.password ? (
          <p
            id="registration-password-error"
            className="text-sm text-destructive"
          >
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={
            state.status === "error"
              ? "rounded-md bg-destructive/10 p-3 text-sm leading-6 text-destructive"
              : "rounded-md bg-muted p-3 text-sm leading-6 text-foreground"
          }
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending || isSuccess}>
        {pending ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
      </Button>
    </form>
  );
}
