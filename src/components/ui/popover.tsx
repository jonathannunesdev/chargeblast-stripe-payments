"use client";

import * as RadixPopover from "@radix-ui/react-popover";
import type { ReactNode } from "react";

export const Popover = RadixPopover.Root;
export const PopoverTrigger = RadixPopover.Trigger;

interface PopoverContentProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function PopoverContent({
  title,
  children,
  className,
}: PopoverContentProps) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        align="start"
        sideOffset={6}
        aria-label={title}
        className={
          className ??
          "z-50 w-72 rounded-lg bg-white p-3 text-sm text-ink shadow-[0_0_0_1px_rgba(64,68,82,0.08),0_3px_9px_rgba(64,68,82,0.12),0_10px_30px_rgba(0,0,0,0.1)] focus:outline-none"
        }
      >
        <p className="mb-2 font-semibold">{title}</p>
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
}
