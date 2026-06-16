import type { Metadata } from "next";

import { IdentityShell } from "@/components/identity/identity-shell";
import { RegistrationForm } from "@/components/identity/registration-form";

export const metadata: Metadata = {
  title: "إنشاء حساب | يُسر",
  description: "إنشاء حساب عميل جديد في منصة يُسر.",
};

export default function RegistrationPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10 sm:px-6">
      <IdentityShell
        title="إنشاء حساب جديد"
        description="استخدم بريدك الإلكتروني لإنشاء حساب عميل وملف متعلم واحد."
      >
        <RegistrationForm />
      </IdentityShell>
    </main>
  );
}
