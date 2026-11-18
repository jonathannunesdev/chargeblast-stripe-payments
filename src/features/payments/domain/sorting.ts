import { toMajorUnits } from "./currency";
import { STATUS_LABELS, type Payment } from "./payment";

export type PaymentComparator = (a: Payment, b: Payment) => number;

/** Compares face value across currencies; no FX conversion is applied. */
export const compareByAmount: PaymentComparator = (a, b) =>
  toMajorUnits(a.amount, a.currency) - toMajorUnits(b.amount, b.currency);

export const compareByStatus: PaymentComparator = (a, b) =>
  STATUS_LABELS[a.status].localeCompare(STATUS_LABELS[b.status]);

export const compareByCreated: PaymentComparator = (a, b) =>
  a.created - b.created;

export type PaymentSortKey = "amount" | "status" | "created";

export interface PaymentSort {
  key: PaymentSortKey;
  desc: boolean;
}

const COMPARATORS: Record<PaymentSortKey, PaymentComparator> = {
  amount: compareByAmount,
  status: compareByStatus,
  created: compareByCreated,
};

/** Stable sort that returns a new array. */
export function sortPayments(
  payments: readonly Payment[],
  sort: PaymentSort,
): Payment[] {
  const compare = COMPARATORS[sort.key];
  const direction = sort.desc ? -1 : 1;
  return [...payments].sort((a, b) => direction * compare(a, b));
}
