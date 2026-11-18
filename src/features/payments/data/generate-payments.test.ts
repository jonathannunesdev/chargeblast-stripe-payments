import { describe, expect, it } from "vitest";

import { PAYMENT_STATUSES } from "../domain/payment";
import { generatePayments } from "./generate-payments";

const NOW = new Date(2026, 10, 18, 15, 0).getTime();
const payments = generatePayments({ count: 500, seed: 42, now: NOW });

describe("generatePayments", () => {
  it("is deterministic for the same seed", () => {
    const again = generatePayments({ count: 500, seed: 42, now: NOW });
    expect(again).toEqual(payments);
  });

  it("generates unique ids, newest first", () => {
    expect(new Set(payments.map((p) => p.id)).size).toBe(500);
    const created = payments.map((p) => p.created);
    expect(created).toEqual([...created].sort((a, b) => b - a));
  });

  it("never creates payments in the future", () => {
    expect(payments.every((p) => p.created <= NOW)).toBe(true);
  });

  it("includes every status and several currencies", () => {
    const statuses = new Set(payments.map((p) => p.status));
    expect([...statuses].sort()).toEqual([...PAYMENT_STATUSES].sort());
    expect(new Set(payments.map((p) => p.currency)).size).toBeGreaterThan(4);
  });

  it("only uses bank debits for USD payments", () => {
    const ach = payments.filter(
      (p) => p.paymentMethod.type === "us_bank_account",
    );
    expect(ach.length).toBeGreaterThan(0);
    expect(ach.every((p) => p.currency === "usd")).toBe(true);
  });

  it("keeps refund dates and decline reasons consistent with the status", () => {
    for (const p of payments) {
      expect(p.refundedAt !== null).toBe(p.status === "refunded");
      expect(p.declineReason !== null).toBe(p.status === "failed");
      if (p.refundedAt !== null) {
        expect(p.refundedAt).toBeGreaterThanOrEqual(p.created);
      }
    }
  });
});
