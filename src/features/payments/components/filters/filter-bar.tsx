"use client";

import {
  ArrowUpTrayIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
} from "@heroicons/react/16/solid";

import { Button } from "@/components/ui/button";

import { CURRENCIES } from "../../domain/currency";
import {
  summarizeAmount,
  summarizeCurrencies,
  summarizeDateRange,
  summarizeMethods,
  summarizeStatuses,
} from "../../domain/filter-summary";
import { EMPTY_FILTERS, type PaymentFilters } from "../../domain/filters";
import {
  PAYMENT_METHOD_CATEGORIES,
  PAYMENT_METHOD_CATEGORY_LABELS,
  PAYMENT_STATUSES,
  STATUS_LABELS,
} from "../../domain/payment";
import { AmountFilter } from "./amount-filter";
import { CheckboxListFilter } from "./checkbox-list-filter";
import { DateFilter } from "./date-filter";
import { FilterChip } from "./filter-chip";

const STATUS_OPTIONS = PAYMENT_STATUSES.map((value) => ({
  value,
  label: STATUS_LABELS[value],
}));

const METHOD_OPTIONS = PAYMENT_METHOD_CATEGORIES.map((value) => ({
  value,
  label: PAYMENT_METHOD_CATEGORY_LABELS[value],
}));

const CURRENCY_OPTIONS = CURRENCIES.map((value) => ({
  value,
  label: value.toUpperCase(),
}));

interface FilterBarProps {
  filters: PaymentFilters;
  now: number;
  onChange: <K extends keyof PaymentFilters>(
    key: K,
    value: PaymentFilters[K],
  ) => void;
}

export function FilterBar({ filters, now, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filters"
      >
        <FilterChip
          label="Date and time"
          value={filters.dateRange ? summarizeDateRange(filters.dateRange) : ""}
          onClear={() => onChange("dateRange", EMPTY_FILTERS.dateRange)}
        >
          {(close) => (
            <DateFilter
              value={filters.dateRange}
              now={now}
              onApply={(range) => {
                onChange("dateRange", range);
                close();
              }}
            />
          )}
        </FilterChip>
        <FilterChip
          label="Amount"
          value={summarizeAmount(filters.amount)}
          onClear={() => onChange("amount", EMPTY_FILTERS.amount)}
        >
          {(close) => (
            <AmountFilter
              value={filters.amount}
              onApply={(range) => {
                onChange("amount", range);
                close();
              }}
            />
          )}
        </FilterChip>
        <FilterChip
          label="Currency"
          value={summarizeCurrencies(filters.currencies)}
          onClear={() => onChange("currencies", [])}
        >
          {(close) => (
            <CheckboxListFilter
              options={CURRENCY_OPTIONS}
              selected={filters.currencies}
              onApply={(values) => {
                onChange("currencies", values);
                close();
              }}
            />
          )}
        </FilterChip>
        <FilterChip
          label="Status"
          value={summarizeStatuses(filters.statuses)}
          onClear={() => onChange("statuses", [])}
        >
          {(close) => (
            <CheckboxListFilter
              options={STATUS_OPTIONS}
              selected={filters.statuses}
              onApply={(values) => {
                onChange("statuses", values);
                close();
              }}
            />
          )}
        </FilterChip>
        <FilterChip
          label="Payment method"
          value={summarizeMethods(filters.methods)}
          onClear={() => onChange("methods", [])}
        >
          {(close) => (
            <CheckboxListFilter
              options={METHOD_OPTIONS}
              selected={filters.methods}
              onApply={(values) => {
                onChange("methods", values);
                close();
              }}
            />
          )}
        </FilterChip>
        <span
          className="inline-flex h-6 items-center gap-1 rounded-full border border-dashed border-line px-1.5 pr-2 text-xs font-semibold whitespace-nowrap text-ink-subdued/70"
          aria-disabled="true"
          title="Not available in this demo"
        >
          <PlusCircleIcon className="size-3.5" aria-hidden />
          More filters
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button>
          <ArrowUpTrayIcon className="size-3.5 text-ink-subdued" aria-hidden />
          Export
        </Button>
        <Button>
          <Cog6ToothIcon className="size-3.5 text-ink-subdued" aria-hidden />
          Edit columns
        </Button>
      </div>
    </div>
  );
}
