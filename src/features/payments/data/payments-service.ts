import type { Payment } from "../domain/payment";
import { generatePayments } from "./generate-payments";

const PAYMENTS_COUNT = 500;
const PAYMENTS_SEED = 20261120;

/**
 * Stands in for an API call. Dates are generated relative to the current time
 * so presets like "Today" always have data, while ids and amounts stay stable.
 */
export async function listPayments(
  now: number = Date.now(),
): Promise<Payment[]> {
  return generatePayments({
    count: PAYMENTS_COUNT,
    seed: PAYMENTS_SEED,
    now,
  });
}
