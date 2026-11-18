import type { Payment } from "../domain/payment";
import { createRandom } from "./random";

export interface PaymentDetails {
  /** In the payment currency's smallest unit; null when nothing was charged. */
  fee: number | null;
  cardExpiry: { month: number; year: number } | null;
  statementDescriptor: string;
  metadata: Record<string, string>;
}

const CHARGED_STATUSES = new Set(["succeeded", "refunded", "disputed"]);
const PLANS = ["Starter", "Pro", "Team"] as const;

function seedFromId(id: string): number {
  let hash = 2166136261;
  for (const char of id) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

/**
 * Mock details that the list API does not return. They are derived from the
 * payment ID, so a payment always shows the same values.
 */
export function getPaymentDetails(payment: Payment): PaymentDetails {
  const random = createRandom(seedFromId(payment.id));
  const isCard = payment.paymentMethod.type === "card";

  return {
    fee: CHARGED_STATUSES.has(payment.status)
      ? Math.round(payment.amount * 0.029) + 30
      : null,
    cardExpiry: isCard
      ? { month: random.int(1, 12), year: random.int(2027, 2031) }
      : null,
    statementDescriptor: "CRAMLY.AI",
    metadata: random.chance(0.8)
      ? {
          order_id: `ord_${random.alphanumeric(10)}`,
          plan: random.pick(PLANS),
        }
      : {},
  };
}
