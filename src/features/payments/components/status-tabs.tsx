import { clsx } from "clsx";

import { STATUS_LABELS, type PaymentStatus } from "../domain/payment";

const QUICK_FILTERS: (PaymentStatus | null)[] = [
  null,
  "succeeded",
  "refunded",
  "disputed",
  "failed",
  "uncaptured",
];

interface StatusTabsProps {
  selected: PaymentStatus[];
  onSelect: (statuses: PaymentStatus[]) => void;
}

export function StatusTabs({ selected, onSelect }: StatusTabsProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="Quick status filters">
      {QUICK_FILTERS.map((status) => {
        const active =
          status === null
            ? selected.length === 0
            : selected.length === 1 && selected[0] === status;

        return (
          <button
            key={status ?? "all"}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(status === null ? [] : [status])}
            className={clsx(
              "flex h-10 min-w-0 flex-1 cursor-pointer items-center rounded-md bg-white px-3 text-left text-sm whitespace-nowrap",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              active
                ? "font-semibold text-brand shadow-[0_0_0_2px_var(--color-brand)]"
                : "text-ink-subdued shadow-[0_0_0_1px_var(--color-line)] hover:shadow-[0_0_0_1px_var(--color-ink-muted)]",
            )}
          >
            {status === null ? "All" : STATUS_LABELS[status]}
          </button>
        );
      })}
    </div>
  );
}
