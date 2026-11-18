"use client";

import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import { ArrowUturnLeftIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useState, type ComponentType, type SVGProps } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";

import type { Payment, PaymentStatus } from "../../domain/payment";

type QuickAction = "refund" | "cancel" | "receipt";

const QUICK_ACTIONS: Partial<Record<PaymentStatus, QuickAction[]>> = {
  succeeded: ["refund", "receipt"],
  uncaptured: ["cancel", "receipt"],
  refunded: ["receipt"],
};

const ACTIONS: Record<
  QuickAction,
  { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  refund: { label: "Refund payment", Icon: ArrowUturnLeftIcon },
  cancel: { label: "Cancel payment", Icon: ArrowUturnLeftIcon },
  receipt: { label: "Send receipt", Icon: EnvelopeIcon },
};

const NOT_AVAILABLE = "Not available in this demo";

const BUTTON_CLASSES =
  "grid h-6 w-7 cursor-pointer place-content-center rounded-[5px] text-ink hover:bg-offset focus-visible:outline-2 focus-visible:outline-brand";

/** Quick actions appear when the row is hovered; the menu is always there. */
export function RowActions({ payment }: { payment: Payment }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const quickActions = QUICK_ACTIONS[payment.status] ?? [];

  async function copyId() {
    setMenuOpen(false);
    try {
      await navigator.clipboard.writeText(payment.id);
    } catch {
      // Clipboard access can be denied; there is nothing else to do here.
    }
  }

  return (
    <div className="absolute top-1/2 right-[7px] flex -translate-y-1/2 items-center rounded-md border border-transparent group-focus-within/row:border-line-subtle group-focus-within/row:bg-white group-hover/row:border-line-subtle group-hover/row:bg-white">
      {quickActions.map((action) => {
        const { label, Icon } = ACTIONS[action];
        return (
          <Tooltip key={action} content={label}>
            <button
              type="button"
              aria-label={label}
              aria-disabled="true"
              className={`hidden group-focus-within/row:grid group-hover/row:grid ${BUTTON_CLASSES}`}
            >
              <Icon className="size-3.5 stroke-2" aria-hidden />
            </button>
          </Tooltip>
        );
      })}
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`More actions for payment ${payment.id}`}
            className={`${BUTTON_CLASSES} text-ink-muted hover:text-ink`}
          >
            <EllipsisHorizontalIcon className="size-4" aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent
          title="Actions"
          align="end"
          className="z-50 w-max min-w-[170px] rounded-lg bg-white py-3 text-sm text-ink shadow-[0_0_0_1px_rgba(64,68,82,0.08),0_3px_9px_rgba(64,68,82,0.12),0_10px_30px_rgba(0,0,0,0.1)] focus:outline-none [&>p]:px-4 [&>p]:text-[13px]"
        >
          <ul>
            {quickActions.map((action) => (
              <MenuItem key={action} unavailable>
                {ACTIONS[action].label}
              </MenuItem>
            ))}
            <MenuItem onSelect={copyId}>Copy payment ID</MenuItem>
          </ul>
          <div className="my-2 h-px bg-line-subtle" />
          <p className="mb-2 px-4 text-[13px] font-semibold">Connections</p>
          <ul>
            <MenuItem unavailable>View customer</MenuItem>
            <MenuItem unavailable>View payment details</MenuItem>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function MenuItem({
  children,
  onSelect,
  unavailable = false,
}: {
  children: string;
  onSelect?: () => void;
  unavailable?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-disabled={unavailable || undefined}
        title={unavailable ? NOT_AVAILABLE : undefined}
        className="flex h-8 w-full cursor-pointer items-center px-4 text-left whitespace-nowrap hover:bg-offset focus-visible:bg-offset focus-visible:outline-none aria-disabled:cursor-default"
      >
        {children}
      </button>
    </li>
  );
}
