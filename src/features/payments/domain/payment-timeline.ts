import type { Payment } from "./payment";

export interface PaymentEvent {
  id: string;
  title: string;
  detail?: string;
  timestamp: number;
  /** The most recent event is highlighted, like in the Stripe Dashboard. */
  current?: boolean;
}

const SECOND = 1000;
const DAY = 24 * 60 * 60 * SECOND;

/** Rebuilds the payment's history from its status, newest event first. */
export function getPaymentTimeline(payment: Payment): PaymentEvent[] {
  const { created } = payment;
  const events: PaymentEvent[] = [
    { id: "started", title: "Payment started", timestamp: created },
  ];
  const add = (event: Omit<PaymentEvent, "id"> & { id?: string }) =>
    events.push({ id: event.id ?? event.title, ...event });

  switch (payment.status) {
    case "succeeded":
      add({ title: "Payment succeeded", timestamp: created + 2 * SECOND });
      break;
    case "failed":
      add({
        title: "Payment failed",
        detail: payment.declineReason ?? undefined,
        timestamp: created + 2 * SECOND,
      });
      break;
    case "pending":
      add({
        title: "Payment incomplete",
        detail: "The customer must complete additional steps",
        timestamp: created + 2 * SECOND,
      });
      break;
    case "uncaptured":
      add({
        title: "Payment authorized",
        detail: "Funds are held until the payment is captured",
        timestamp: created + 2 * SECOND,
      });
      break;
    case "canceled":
      add({ title: "Payment authorized", timestamp: created + 2 * SECOND });
      add({ title: "Payment canceled", timestamp: created + 2 * DAY });
      break;
    case "blocked":
      add({
        title: "Payment blocked",
        detail: "Declined by one of your rules",
        timestamp: created + 2 * SECOND,
      });
      break;
    case "refunded":
      add({ title: "Payment succeeded", timestamp: created + 2 * SECOND });
      add({
        title: "Refund initiated",
        timestamp: payment.refundedAt ?? created + DAY,
      });
      break;
    case "disputed":
      add({ title: "Payment succeeded", timestamp: created + 2 * SECOND });
      add({ title: "Dispute opened", timestamp: created + 3 * DAY });
      break;
  }

  const newestFirst = [...events].reverse();
  newestFirst[0]!.current = true;
  return newestFirst;
}
