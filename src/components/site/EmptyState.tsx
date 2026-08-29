import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { btnPrimary } from "@/lib/ui";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  actionSearch,
  onAction,
  as: Heading = "h2",
}: {
  icon?: ReactNode;
  title: string;
  description?: string | undefined;
  actionLabel: string;
  actionTo?: string | undefined;
  actionSearch?: Record<string, unknown> | undefined;
  onAction?: (() => void) | undefined;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-col items-center border border-border bg-cream px-6 py-20 text-center">
      {icon ? <div className="mb-6 text-gold">{icon}</div> : null}
      <Heading className="max-w-lg font-display text-3xl md:text-4xl">{title}</Heading>
      {description ? (
        <p className="mt-3 max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-8">
        {actionTo ? (
          <Link to={actionTo} search={actionSearch as never} className={btnPrimary}>
            {actionLabel}
          </Link>
        ) : (
          <button type="button" onClick={onAction} className={btnPrimary}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
