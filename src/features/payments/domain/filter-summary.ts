import { format, parseISO } from "date-fns";

import { CURRENCIES, type CurrencyCode } from "./currency";
import {
  DATE_PRESET_LABELS,
  type AmountRange,
  type DateRangeFilter,
  type PaymentFilters,
} from "./filters";
import {
  PAYMENT_METHOD_CATEGORY_LABELS,
  STATUS_LABELS,
  type PaymentMethodCategory,
  type PaymentStatus,
} from "./payment";

const MAX_LISTED_VALUES = 2;

function listValues(labels: string[]): string {
  if (labels.length <= MAX_LISTED_VALUES) return labels.join(", ");
  const listed = labels.slice(0, MAX_LISTED_VALUES).join(", ");
  return `${listed} +${labels.length - MAX_LISTED_VALUES}`;
}

function formatDay(isoDate: string): string {
  return format(parseISO(isoDate), "MMM d");
}

export function summarizeDateRange(range: DateRangeFilter): string {
  if (range.type === "preset") return DATE_PRESET_LABELS[range.preset];
  if (range.from && range.to) {
    return `${formatDay(range.from)} – ${formatDay(range.to)}`;
  }
  if (range.from) return `After ${formatDay(range.from)}`;
  if (range.to) return `Before ${formatDay(range.to)}`;
  return "";
}

const amountFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export function summarizeAmount({ min, max }: AmountRange): string {
  if (min !== null && max !== null) {
    return min === max
      ? amountFormat.format(min)
      : `${amountFormat.format(min)} – ${amountFormat.format(max)}`;
  }
  if (min !== null) return `≥ ${amountFormat.format(min)}`;
  if (max !== null) return `≤ ${amountFormat.format(max)}`;
  return "";
}

export function summarizeStatuses(statuses: PaymentStatus[]): string {
  return listValues(statuses.map((status) => STATUS_LABELS[status]));
}

export function summarizeMethods(methods: PaymentMethodCategory[]): string {
  return listValues(
    methods.map((method) => PAYMENT_METHOD_CATEGORY_LABELS[method]),
  );
}

export function summarizeCurrencies(currencies: CurrencyCode[]): string {
  const ordered = CURRENCIES.filter((code) => currencies.includes(code));
  return listValues(ordered.map((code) => code.toUpperCase()));
}

export function hasActiveFilters(filters: PaymentFilters): boolean {
  return (
    filters.dateRange !== null ||
    filters.statuses.length > 0 ||
    filters.methods.length > 0 ||
    filters.currencies.length > 0 ||
    filters.amount.min !== null ||
    filters.amount.max !== null ||
    filters.query.trim() !== ""
  );
}
