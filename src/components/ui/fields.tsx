import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { clsx } from "clsx";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

const FIELD_CLASSES =
  "h-8 w-full rounded-md bg-white px-2 text-sm text-ink shadow-[0_0_0_1px_var(--color-line),0_1px_1px_rgba(0,0,0,0.04)] placeholder:text-ink-muted/70 focus:shadow-[0_0_0_1px_var(--color-brand),0_0_0_4px_rgba(83,58,253,0.18)] focus:outline-none aria-invalid:shadow-[0_0_0_1px_var(--color-danger-ink)]";

export function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(FIELD_CLASSES, className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select
        className={clsx(
          FIELD_CLASSES,
          "cursor-pointer appearance-none pr-7 font-semibold",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronUpDownIcon
        className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-ink-subdued"
        aria-hidden
      />
    </span>
  );
}
