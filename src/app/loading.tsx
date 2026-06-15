export default function Loading() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <div
        role="status"
        aria-live="polite"
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground"
      >
        <div
          aria-hidden="true"
          className="mb-5 h-2 w-16 rounded-full bg-muted-foreground/30 motion-safe:animate-pulse"
        />
        <p className="text-base font-medium">جارٍ تحميل الصفحة…</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          يُرجى الانتظار قليلًا.
        </p>
      </div>
    </main>
  );
}
