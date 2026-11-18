import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-solid text-white shadow-[0_1px_1px_rgba(0,0,0,0.12),0_2px_5px_rgba(60,66,87,0.08)] hover:bg-brand-solid-hover",
  secondary:
    "bg-white text-ink shadow-[0_0_0_1px_var(--color-line),0_1px_1px_rgba(0,0,0,0.06)] hover:bg-offset disabled:text-ink-disabled disabled:shadow-[0_0_0_1px_var(--color-line-subtle)] disabled:hover:bg-white",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-6 px-2 text-xs",
  md: "h-7 px-2 text-sm",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-md font-semibold whitespace-nowrap",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-default",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
