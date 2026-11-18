import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  indeterminate?: boolean;
};

export function Checkbox({
  indeterminate = false,
  className,
  ...props
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      ref={(el) => {
        if (el) el.indeterminate = indeterminate;
      }}
      className={clsx(
        "grid size-3.5 cursor-pointer appearance-none place-content-center rounded border border-line bg-white",
        "checked:border-brand checked:bg-brand indeterminate:border-brand indeterminate:bg-brand",
        "before:hidden before:size-2 before:bg-white before:content-[''] before:[clip-path:polygon(14%_44%,0_65%,50%_100%,100%_16%,80%_0%,43%_62%)] checked:before:block",
        "after:hidden after:h-0.5 after:w-2 after:bg-white after:content-[''] indeterminate:before:hidden indeterminate:after:block",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        "disabled:cursor-default disabled:border-line-subtle disabled:bg-line-subtle",
        className,
      )}
      {...props}
    />
  );
}
