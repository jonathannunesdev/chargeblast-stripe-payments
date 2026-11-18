"use client";

import { XCircleIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { useState, type ReactNode } from "react";

import { AddCircleIcon } from "@/components/icons/ui-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterChipProps {
  label: string;
  /** Human-readable summary of the applied value; empty when inactive. */
  value: string;
  onClear: () => void;
  children: (close: () => void) => ReactNode;
}

export function FilterChip({
  label,
  value,
  onClear,
  children,
}: FilterChipProps) {
  const [open, setOpen] = useState(false);
  const active = value !== "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <span
        className={clsx(
          "inline-flex h-6 items-center rounded-full border text-xs font-medium whitespace-nowrap text-ink-subdued",
          active ? "border-solid border-line" : "border-dashed border-line",
        )}
      >
        {active ? (
          <button
            type="button"
            onClick={onClear}
            aria-label={`Clear ${label} filter`}
            className="grid h-full cursor-pointer place-content-center rounded-full pr-0.5 pl-1.5 hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
          >
            <XCircleIcon
              className="size-4 stroke-[1.6] text-ink-subdued"
              aria-hidden
            />
          </button>
        ) : null}
        <PopoverTrigger asChild>
          <button
            type="button"
            className={clsx(
              "inline-flex h-full cursor-pointer items-center gap-1 rounded-full pr-2.5 hover:text-ink focus-visible:outline-2 focus-visible:outline-brand",
              active ? "pl-0.5" : "pl-[7px]",
            )}
          >
            {!active && <AddCircleIcon className="size-4 text-ink-subdued" />}
            {label}
            {active && (
              <>
                <span className="mx-0.5 h-3 w-px bg-line" aria-hidden />
                <span className="text-brand">{value}</span>
              </>
            )}
          </button>
        </PopoverTrigger>
      </span>
      <PopoverContent title={`Filter by ${label.toLowerCase()}`}>
        {children(() => setOpen(false))}
      </PopoverContent>
    </Popover>
  );
}
