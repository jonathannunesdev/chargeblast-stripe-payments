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
