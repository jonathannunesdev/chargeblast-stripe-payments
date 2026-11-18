import { clsx } from "clsx";
import type { ReactNode } from "react";

export type BadgeVariant = "success" | "danger" | "warning" | "neutral";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "border-success-line bg-success-bg text-success-ink",
  danger: "border-danger-line bg-danger-bg text-danger-ink",
  warning: "border-warning-line bg-warning-bg text-warning-ink",
  neutral: "border-line bg-offset text-ink-muted",
};

interface BadgeProps {
  variant: BadgeVariant;
  icon?: ReactNode;
  children: ReactNode;
}

export function Badge({ variant, icon, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex h-5 items-center gap-1 rounded border px-1.5 text-xs whitespace-nowrap",
        VARIANT_CLASSES[variant],
      )}
    >
      {children}
      {icon}
    </span>
  );
}
