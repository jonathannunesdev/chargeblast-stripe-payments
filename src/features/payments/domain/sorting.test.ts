import { describe, expect, it } from "vitest";

import type { Payment } from "./payment";
import { sortPayments } from "./sorting";

function payment(id: string, overrides: Partial<Payment>): Payment {
  return {
    id,
    amount: 1000,
    currency: "usd",
    status: "succeeded",
    paymentMethod: { type: "card", brand: "visa", last4: "4242", wallet: null },
    description: "Subscription update",
    customerEmail: "jane@example.com",
    created: 0,
    refundedAt: null,
    declineReason: null,
    ...overrides,
  };
}

const PAYMENTS = [
  payment("a", { amount: 500, status: "succeeded", created: 3 }),
  payment("b", { amount: 1200, currency: "jpy", status: "failed", created: 1 }),
  payment("c", { amount: 2500, status: "blocked", created: 2 }),
];

const ids = (payments: Payment[]) => payments.map((p) => p.id);

describe("sortPayments", () => {
  it("sorts by amount in major units", () => {
    expect(ids(sortPayments(PAYMENTS, { key: "amount", desc: true }))).toEqual([
      "b",
      "c",
      "a",
    ]);
  });

  it("sorts by status label", () => {
    expect(ids(sortPayments(PAYMENTS, { key: "status", desc: false }))).toEqual(
      ["c", "b", "a"],
    );
  });

  it("sorts by date without mutating the input", () => {
    expect(ids(sortPayments(PAYMENTS, { key: "created", desc: true }))).toEqual(
      ["a", "c", "b"],
    );
    expect(ids(PAYMENTS)).toEqual(["a", "b", "c"]);
  });
});
