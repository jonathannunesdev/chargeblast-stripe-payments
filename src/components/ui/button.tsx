import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-[0_1px_1px_rgba(0,0,0,0.12)] hover:bg-brand-hover",
  secondary:
    "bg-white text-[#273951] shadow-[0_0_0_1px_var(--color-line),0_1px_1px_rgba(0,0,0,0.04)] hover:bg-offset disabled:text-ink-muted/60 disabled:shadow-[0_0_0_1px_var(--color-line-subtle)] disabled:hover:bg-white",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "secondary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2 text-sm font-semibold whitespace-nowrap",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-default",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
