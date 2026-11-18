import { endOfDay, parseISO, startOfDay, subDays } from "date-fns";

import { toMajorUnits, type CurrencyCode } from "./currency";
import {
  getPaymentMethodCategory,
  type Payment,
  type PaymentMethodCategory,
  type PaymentStatus,
} from "./payment";

export const DATE_PRESETS = ["today", "last_7_days", "last_30_days"] as const;

export type DatePreset = (typeof DATE_PRESETS)[number];

export const DATE_PRESET_LABELS: Record<DatePreset, string> = {
  today: "Today",
  last_7_days: "Last 7 days",
  last_30_days: "Last 30 days",
};

export type DateRangeFilter =
  | { type: "preset"; preset: DatePreset }
  /** Calendar dates as `yyyy-MM-dd`. Both ends are inclusive. */
  | { type: "custom"; from: string | null; to: string | null };

/** Bounds are in major units (e.g. dollars), compared against each payment's own currency. */
export interface AmountRange {
  min: number | null;
  max: number | null;
}

export interface PaymentFilters {
  dateRange: DateRangeFilter | null;
  statuses: PaymentStatus[];
  methods: PaymentMethodCategory[];
  currencies: CurrencyCode[];
  amount: AmountRange;
  query: string;
}

export const EMPTY_FILTERS: PaymentFilters = {
  dateRange: null,
  statuses: [],
  methods: [],
  currencies: [],
  amount: { min: null, max: null },
  query: "",
};

interface Interval {
  start: number;
  end: number;
}

export function resolveDateRange(
  range: DateRangeFilter,
  now: number,
): Interval {
  if (range.type === "custom") {
    return {
      start: range.from
        ? startOfDay(parseISO(range.from)).getTime()
        : -Infinity,
      end: range.to ? endOfDay(parseISO(range.to)).getTime() : Infinity,
    };
  }

  const daysBack = { today: 0, last_7_days: 6, last_30_days: 29 }[range.preset];
  return {
    start: startOfDay(subDays(now, daysBack)).getTime(),
    end: endOfDay(now).getTime(),
  };
}

export function isAmountRangeValid({ min, max }: AmountRange): boolean {
  return min === null || max === null || min <= max;
}

function matchesQuery(payment: Payment, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  return (
    payment.id.toLowerCase().includes(needle) ||
    payment.customerEmail.toLowerCase().includes(needle) ||
    payment.paymentMethod.last4 === needle
  );
}

export function filterPayments(
  payments: readonly Payment[],
  filters: PaymentFilters,
  now: number,
): Payment[] {
  const interval = filters.dateRange
    ? resolveDateRange(filters.dateRange, now)
    : null;
  const statuses = new Set(filters.statuses);
  const methods = new Set(filters.methods);
  const currencies = new Set(filters.currencies);
  const { min, max } = filters.amount;

  return payments.filter((payment) => {
    if (
      interval &&
      (payment.created < interval.start || payment.created > interval.end)
    ) {
      return false;
    }
    if (statuses.size > 0 && !statuses.has(payment.status)) return false;
    if (
      methods.size > 0 &&
      !methods.has(getPaymentMethodCategory(payment.paymentMethod))
    ) {
      return false;
    }
    if (currencies.size > 0 && !currencies.has(payment.currency)) return false;

    const amount = toMajorUnits(payment.amount, payment.currency);
    if (min !== null && amount < min) return false;
    if (max !== null && amount > max) return false;

    return matchesQuery(payment, filters.query);
  });
}
