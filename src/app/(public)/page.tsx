import { IdentityShell } from "@/components/identity/identity-shell";

const detailClassName =
  "flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-border pt-3";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="fixed start-4 top-4 z-50 -translate-y-24 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground outline-none transition-transform focus-visible:translate-y-0 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      >
        انتقل إلى المحتوى
      </a>

      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-svh items-center justify-center px-4 py-10 sm:px-6"
      >
        <IdentityShell
          title="أساس واجهة الحسابات جاهز"
          description="تم إعداد الاتجاه العربي ومكوّنات النماذج الأساسية تمهيدًا لصفحات التسجيل والدخول واستعادة كلمة المرور."
        >
          <dl className="grid gap-3 text-sm text-muted-foreground">
            <div className={detailClassName}>
              <dt>بريد تجريبي</dt>
              <dd
                dir="ltr"
                className="max-w-full break-all font-medium text-foreground"
              >
                hello@example.com
              </dd>
            </div>
            <div className={detailClassName}>
              <dt>مرجع تجريبي</dt>
              <dd className="font-medium text-foreground">
                <bdi dir="ltr">YSR-1024</bdi>
              </dd>
            </div>
            <div className={detailClassName}>
              <dt>سنة الأساس</dt>
              <dd className="font-medium text-foreground">
                <bdi dir="ltr">2026</bdi>
              </dd>
            </div>
          </dl>
        </IdentityShell>
      </main>
    </>
  );
}
