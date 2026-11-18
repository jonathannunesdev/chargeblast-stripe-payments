"use client";

import { SparklesIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

export function NoticeBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <aside className="flex h-9 items-center gap-3 rounded-md bg-offset pr-2.5 pl-2 text-sm">
      <span className="flex items-center gap-1 text-xs font-bold">
        <SparklesIcon className="size-3 text-ink" aria-hidden />
        New
      </span>
      <p className="ml-1 min-w-0 flex-1 truncate">
        Rule Attributes are now in Sigma and Data Pipeline for better fraud
        insights.
      </p>
      <a href="#" className="text-brand hover:underline">
        Get started
      </a>
      <span className="h-4 w-px bg-line" aria-hidden />
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="grid size-6 cursor-pointer place-content-center rounded text-ink hover:bg-line-subtle focus-visible:outline-2 focus-visible:outline-brand"
      >
        <XMarkIcon className="size-4 stroke-1" aria-hidden />
      </button>
    </aside>
  );
}
