import type { Payment } from "./payment";

export interface StatusDetails {
  title?: string;
  body: string;
  /** Ends the text with "Find more details on the payment timeline." */
  mentionsTimeline?: boolean;
  learnMoreHref?: string;
}

const BANK_DECLINE =
  "This payment failed because the issuing bank declined it.";

const DECLINE_DETAILS: Record<string, string> = {
  "Insufficient funds":
    "This payment failed because the customer had insufficient funds.",
  "Incorrect CVC":
    "This payment failed because the customer entered an incorrect CVC.",
  "Generic decline": BANK_DECLINE,
  "Do not honor": BANK_DECLINE,
  "Transaction not allowed": BANK_DECLINE,
};

/** The explanation the Stripe Dashboard shows when hovering a status badge. */
export function getStatusDetails(payment: Payment): StatusDetails | null {
  switch (payment.status) {
    case "failed":
      if (payment.declineReason === "Expired card") {
        return { body: "The customer’s card is expired." };
      }
      return {
        body: DECLINE_DETAILS[payment.declineReason ?? ""] ?? BANK_DECLINE,
        mentionsTimeline: true,
      };
    case "pending":
      return {
        body: "The customer must complete additional steps to complete the payment.",
        learnMoreHref:
          "https://docs.stripe.com/payments/payment-intents/verifying-status#next-actions",
      };
    case "blocked":
      return {
        title: "Payment declined by rule",
        body: "One of your rules blocked this payment.",
      };
    case "disputed":
      return {
        body: "Respond to this dispute before the deadline. Without a response, the customer keeps the dispute amount and the dispute received fee won’t be returned.",
      };
    case "canceled":
      return {
        body: "This payment was canceled before any funds were captured.",
      };
    case "refunded":
      return { body: "A refund has been initiated." };
    case "succeeded":
    case "uncaptured":
      return null;
  }
}
