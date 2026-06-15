import type { ReactNode } from "react";

interface IdentityShellProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function IdentityShell({
  title,
  description,
  children,
}: IdentityShellProps) {
  return (
    <section
      aria-label={title}
      className="w-full max-w-md rounded-xl border border-border bg-card p-5 text-card-foreground sm:p-7"
    >
      <header className="text-start">
        <p className="text-sm font-medium text-primary">يُسر</p>
        <h1 className="mt-3 text-2xl font-semibold text-balance">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-pretty text-muted-foreground">
          {description}
        </p>
      </header>

      {children ? <div className="mt-7">{children}</div> : null}
    </section>
  );
}
