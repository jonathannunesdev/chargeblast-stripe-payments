"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import { clsx } from "clsx";
import type { ReactNode } from "react";

export const TooltipProvider = RadixTooltip.Provider;

const SIZE_CLASSES = {
  sm: "rounded-md px-2 py-1 text-xs",
  lg: "max-w-[300px] rounded-lg p-4 text-sm",
} as const;

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: RadixTooltip.TooltipContentProps["side"];
  size?: keyof typeof SIZE_CLASSES;
}

export function Tooltip({
  content,
  children,
  side = "top",
  size = "sm",
}: TooltipProps) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className={clsx(
            "z-50 bg-white text-ink shadow-[0_0_0_1px_rgba(64,68,82,0.08),0_1px_1px_rgba(0,0,0,0.12),0_2px_5px_rgba(48,49,61,0.08)]",
            SIZE_CLASSES[size],
          )}
        >
          {content}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
