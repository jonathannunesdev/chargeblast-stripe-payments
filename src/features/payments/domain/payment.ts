import type { CurrencyCode } from "./currency";

export const PAYMENT_STATUSES = [
  "succeeded",
  "pending",
  "failed",
  "refunded",
  "canceled",
  "blocked",
  "disputed",
  "uncaptured",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const STATUS_LABELS: Record<PaymentStatus, string> = {
  succeeded: "Succeeded",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
  canceled: "Canceled",
  blocked: "Blocked",
  disputed: "Disputed",
  uncaptured: "Uncaptured",
};

export type CardBrand = "visa" | "mastercard" | "amex" | "discover";
export type Wallet = "apple_pay" | "google_pay" | "link";

export type PaymentMethod =
  | { type: "card"; brand: CardBrand; last4: string; wallet: Wallet | null }
  | { type: "us_bank_account"; bankName: string; last4: string };

export const PAYMENT_METHOD_CATEGORIES = ["card", "ach", "wallet"] as const;

export type PaymentMethodCategory = (typeof PAYMENT_METHOD_CATEGORIES)[number];

export const PAYMENT_METHOD_CATEGORY_LABELS: Record<
  PaymentMethodCategory,
  string
> = {
  card: "Card",
  ach: "ACH Direct Debit",
  wallet: "Wallet",
};

export interface Payment {
  id: string;
  /** Amount in the currency's smallest unit (e.g. cents), as in the Stripe API. */
  amount: number;
  currency: CurrencyCode;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  description: string;
  customerEmail: string;
  /** Unix timestamp in milliseconds. */
  created: number;
  refundedAt: number | null;
  declineReason: string | null;
}

export function getPaymentMethodCategory(
  method: PaymentMethod,
): PaymentMethodCategory {
  if (method.type === "us_bank_account") return "ach";
  return method.wallet ? "wallet" : "card";
}
