"use client";

import { CheckIcon, Square2StackIcon } from "@heroicons/react/16/solid";
import { clsx } from "clsx";
import { useEffect, useState } from "react";

import { Tooltip } from "@/components/ui/tooltip";

import { shortenId } from "../../domain/format";

const COPIED_FEEDBACK_MS = 1500;

/** A payment ID with a copy button; `full` shows the whole ID and keeps the button visible. */
export function CopyableId({
  id,
  full = false,
}: {
  id: string;
  full?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <span className="group/id flex items-center gap-1">
      <span className="text-ink-subdued" title={id}>
        {full ? id : shortenId(id)}
      </span>
      <Tooltip
        content={copied ? "Copied" : "Copy ID"}
        open={copied || undefined}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            void copy();
          }}
          aria-label={copied ? "Payment ID copied" : `Copy payment ID ${id}`}
          className={clsx(
            "grid size-5 cursor-pointer place-content-center rounded text-ink-muted hover:bg-offset hover:text-ink focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-brand",
            !full && "opacity-0 group-hover/row:opacity-100",
          )}
        >
          {copied ? (
            <CheckIcon className="size-3.5 text-success-ink" aria-hidden />
          ) : (
            <Square2StackIcon className="size-3.5" aria-hidden />
          )}
        </button>
      </Tooltip>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </span>
  );
}
