import { clsx } from "clsx";

import { AnalyzeIcon, PlusIcon } from "@/components/icons/ui-icons";
import { Button } from "@/components/ui/button";
import { NOT_AVAILABLE_IN_DEMO } from "@/lib/demo";

const TABS = [
  "Payments",
  "Payouts",
  "Top-ups",
  "Collected fees",
  "Transfers",
  "All activity",
] as const;

export function PageHeader() {
  return (
    <header>
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] leading-9 font-bold text-ink-strong">
          Transactions
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            aria-disabled="true"
            title={NOT_AVAILABLE_IN_DEMO}
          >
            <PlusIcon className="size-3.5" />
            Create payment
          </Button>
          <Button aria-disabled="true" title={NOT_AVAILABLE_IN_DEMO}>
            <AnalyzeIcon className="size-3.5 text-icon" />
            Analyze
          </Button>
        </div>
      </div>
      <nav
        aria-label="Transactions"
        className="mt-1 border-b border-line-subtle"
      >
        <ul className="flex gap-6">
          {TABS.map((tab) => {
            const active = tab === "Payments";
            return (
              <li key={tab}>
                <a
                  href={active ? "/payments" : "#"}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "-mb-px block border-b-2 py-2 text-sm font-semibold",
                    active
                      ? "border-brand text-brand"
                      : "border-transparent text-ink-subdued hover:text-ink",
                  )}
                >
                  {tab}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
