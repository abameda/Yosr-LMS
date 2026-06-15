"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <section
        role="alert"
        aria-labelledby="global-error-title"
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground"
      >
        <h1 id="global-error-title" className="text-xl font-semibold">
          تعذّر تحميل الصفحة
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          حدث خطأ غير متوقع. يمكنك إعادة المحاولة دون تغيير صلاحيات الحساب.
        </p>
        <Button type="button" className="mt-6" onClick={reset}>
          إعادة المحاولة
        </Button>
      </section>
    </main>
  );
}
