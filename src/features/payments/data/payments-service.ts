import type { Payment } from "../domain/payment";
import { generatePayments } from "./generate-payments";
import { getReferencePayments, referenceTimestamp } from "./reference-payments";

const GENERATED_COUNT = 480;
const GENERATED_SEED = 20261120;

/**
 * The demo clock is frozen right after the newest payment in the reference
 * screenshot, so dates read "Aug 16, 5:03 PM" and the date presets
 * ("Today", "Last 7 days"...) still have data to work with.
 */
export const DATASET_NOW = referenceTimestamp(17, 5);

/** Stands in for an API call. */
export async function listPayments(): Promise<Payment[]> {
  const reference = getReferencePayments();
  const oldestReference = Math.min(...reference.map((p) => p.created));

  const generated = generatePayments({
    count: GENERATED_COUNT,
    seed: GENERATED_SEED,
    now: oldestReference - 60 * 1000,
  });

  return [...reference, ...generated];
}

/** Stands in for an API call; resolves to null when the payment does not exist. */
export async function getPayment(id: string): Promise<Payment | null> {
  const payments = await listPayments();
  return payments.find((payment) => payment.id === id) ?? null;
}
