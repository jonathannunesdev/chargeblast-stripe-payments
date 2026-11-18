import { getCurrencyDecimals, toMajorUnits } from "./currency";
import {
  getPaymentMethodCategory,
  STATUS_LABELS,
  type Payment,
} from "./payment";

const HEADERS = [
  "id",
  "created",
  "amount",
  "currency",
  "status",
  "payment_method",
  "card_brand",
  "wallet",
  "last4",
  "description",
  "customer_email",
  "refunded_at",
  "decline_reason",
];

/**
 * Quotes values that need it and neutralizes leading characters that
 * spreadsheet apps would otherwise evaluate as formulas.
 */
function escapeCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\n\r]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

function toIso(timestamp: number | null): string {
  return timestamp === null ? "" : new Date(timestamp).toISOString();
}

function toRow(payment: Payment): string[] {
  const method = payment.paymentMethod;
  return [
    payment.id,
    toIso(payment.created),
    toMajorUnits(payment.amount, payment.currency).toFixed(
      getCurrencyDecimals(payment.currency),
    ),
    payment.currency.toUpperCase(),
    STATUS_LABELS[payment.status],
    getPaymentMethodCategory(method),
    method.type === "card" ? method.brand : "",
    method.type === "card" ? (method.wallet ?? "") : "",
    method.last4,
    payment.description,
    payment.customerEmail,
    toIso(payment.refundedAt),
    payment.declineReason ?? "",
  ];
}

export function paymentsToCsv(payments: readonly Payment[]): string {
  return [HEADERS, ...payments.map(toRow)]
    .map((row) => row.map(escapeCell).join(","))
    .join("\n");
}
