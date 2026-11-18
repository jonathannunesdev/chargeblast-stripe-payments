import { format, formatDistanceStrict, isSameYear } from "date-fns";

import {
  getCurrencyDecimals,
  toMajorUnits,
  type CurrencyCode,
} from "./currency";

/**
 * Formats an amount the way the Stripe Dashboard does: narrow symbol,
 * with a space after multi-character symbols ("R$ 99.99", "$9.88").
 */
export function formatAmount(amount: number, currency: CurrencyCode): string {
  const decimals = getCurrencyDecimals(currency);
  const parts = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).formatToParts(toMajorUnits(amount, currency));

  return parts
    .map((part) =>
      part.type === "currency" && part.value.length > 1
        ? `${part.value} `
        : part.value,
    )
    .join("");
}

export function formatCurrencyCode(currency: CurrencyCode): string {
  return currency.toUpperCase();
}

export function formatPaymentDate(timestamp: number, now: number): string {
  const pattern = isSameYear(timestamp, now)
    ? "MMM d, h:mm a"
    : "MMM d, yyyy, h:mm a";
  return format(timestamp, pattern);
}

export function formatRelativeTime(timestamp: number, now: number): string {
  return formatDistanceStrict(timestamp, now, { addSuffix: true });
}

/** "pi_3SUuVfKZ1dqrhK3O0nTqzQ4e" -> "pi_3SUuVf…zQ4e" */
export function shortenId(id: string): string {
  if (id.length <= 14) return id;
  return `${id.slice(0, 9)}…${id.slice(-4)}`;
}
