"use client";

import { SparklesIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

export function NoticeBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <aside className="flex h-9 items-center gap-3 rounded-md bg-offset pr-1.5 pl-3 text-sm">
      <span className="flex items-center gap-1 text-xs font-semibold">
        <SparklesIcon className="size-3 text-ink-subdued" aria-hidden />
        New
      </span>
      <p className="min-w-0 flex-1 truncate">
        Rule Attributes are now in Sigma and Data Pipeline for better fraud
        insights.
      </p>
      <a href="#" className="font-semibold text-brand hover:text-brand-hover">
        Get started
      </a>
      <span className="h-4 w-px bg-line" aria-hidden />
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="grid size-6 cursor-pointer place-content-center rounded text-ink-subdued hover:bg-line-subtle hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
      >
        <XMarkIcon className="size-4" aria-hidden />
      </button>
    </aside>
  );
}
