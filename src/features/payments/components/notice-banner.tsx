"use client";

import { XMarkIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

import { SparkleIcon } from "@/components/icons/ui-icons";

export function NoticeBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <aside className="flex h-9 items-center gap-3 rounded-md bg-offset pr-2.5 pl-2 text-sm">
      <span className="flex items-center gap-1 text-xs font-bold">
        <SparkleIcon className="size-3 text-ink" />
        New
      </span>
      <p className="ml-1 min-w-0 flex-1 truncate">
        Rule Attributes are now in Sigma and Data Pipeline for better fraud
        insights.
      </p>
      <div className="flex items-center">
        <button
          type="button"
          className="cursor-pointer rounded-sm text-brand hover:underline focus-visible:outline-2 focus-visible:outline-brand"
        >
          Get started
        </button>
        <span className="ml-[18px] h-5 w-px bg-line" aria-hidden />
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="ml-1.5 grid size-6 cursor-pointer place-content-center rounded text-ink hover:bg-line-subtle focus-visible:outline-2 focus-visible:outline-brand"
        >
          <XMarkIcon className="size-5" aria-hidden />
        </button>
      </div>
    </aside>
  );
}
