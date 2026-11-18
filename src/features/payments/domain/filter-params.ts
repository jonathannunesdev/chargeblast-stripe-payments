import { CURRENCIES } from "./currency";
import {
  DATE_PRESETS,
  EMPTY_FILTERS,
  type DateRangeFilter,
  type PaymentFilters,
} from "./filters";
import { PAYMENT_METHOD_CATEGORIES, PAYMENT_STATUSES } from "./payment";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Serializes filters into short, shareable query parameters. */
export function filtersToSearchParams(
  filters: PaymentFilters,
): URLSearchParams {
  const params = new URLSearchParams();
  const { dateRange, statuses, methods, currencies, amount, query } = filters;

  if (dateRange?.type === "preset") params.set("date", dateRange.preset);
  if (dateRange?.type === "custom") {
    params.set("date", "custom");
    if (dateRange.from) params.set("from", dateRange.from);
    if (dateRange.to) params.set("to", dateRange.to);
  }
  if (statuses.length > 0) params.set("status", statuses.join(","));
  if (methods.length > 0) params.set("method", methods.join(","));
  if (currencies.length > 0) params.set("currency", currencies.join(","));
  if (amount.min !== null) params.set("min", String(amount.min));
  if (amount.max !== null) params.set("max", String(amount.max));
  if (query.trim() !== "") params.set("q", query);

  return params;
}

function listParam<T extends string>(
  params: URLSearchParams,
  key: string,
  allowed: readonly T[],
): T[] {
  const values = params.get(key)?.split(",") ?? [];
  return allowed.filter((value) => values.includes(value));
}

function amountParam(params: URLSearchParams, key: string): number | null {
  const value = params.get(key);
  if (value === null || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function dateParam(params: URLSearchParams, key: string): string | null {
  const value = params.get(key);
  return value && DATE_PATTERN.test(value) ? value : null;
}

function dateRangeParam(params: URLSearchParams): DateRangeFilter | null {
  const date = params.get("date");
  if (date === "custom") {
    const from = dateParam(params, "from");
    const to = dateParam(params, "to");
    if (!from && !to) return null;
    return { type: "custom", from, to };
  }
  const preset = DATE_PRESETS.find((value) => value === date);
  return preset ? { type: "preset", preset } : null;
}

/** Reads filters back from the URL, ignoring anything that is not valid. */
export function filtersFromSearchParams(
  params: URLSearchParams,
): PaymentFilters {
  const amount = {
    min: amountParam(params, "min"),
    max: amountParam(params, "max"),
  };
  return {
    ...EMPTY_FILTERS,
    dateRange: dateRangeParam(params),
    statuses: listParam(params, "status", PAYMENT_STATUSES),
    methods: listParam(params, "method", PAYMENT_METHOD_CATEGORIES),
    currencies: listParam(params, "currency", CURRENCIES),
    amount:
      amount.min !== null && amount.max !== null && amount.min > amount.max
        ? EMPTY_FILTERS.amount
        : amount,
    query: params.get("q") ?? "",
  };
}
