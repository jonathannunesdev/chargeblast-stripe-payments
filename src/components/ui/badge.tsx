import { clsx } from "clsx";
import type { ReactNode } from "react";

export type BadgeVariant = "success" | "danger" | "warning" | "neutral";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "border-success-line bg-success-bg text-success-ink",
  danger: "border-danger-line bg-danger-bg text-danger-ink",
  warning: "border-warning-line bg-warning-bg text-warning-ink",
  neutral: "border-neutral-line bg-neutral-bg text-neutral-ink",
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
        "inline-flex h-5 items-center gap-0.5 rounded border pr-1 pl-[7px] text-xs font-medium whitespace-nowrap",
        VARIANT_CLASSES[variant],
      )}
    >
      {children}
      {icon}
    </span>
  );
}
