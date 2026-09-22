import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; to: string; search?: Record<string, unknown> };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow text-gold">{eyebrow}</p> : null}
        <h2 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">{title}</h2>
        {description ? (
          <p className="mt-3 text-sm text-muted-foreground md:text-base">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          to={action.to}
          search={action.search as never}
          className="eyebrow w-fit shrink-0 border-b border-gold pb-1 text-charcoal transition-colors hover:text-gold"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-border bg-cream">
      <div className="shell py-16 md:py-24">
        {eyebrow ? <p className="eyebrow text-gold">{eyebrow}</p> : null}
        <h1 className="mt-4 max-w-3xl font-display text-5xl md:text-6xl">{title}</h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </header>
  );
}
