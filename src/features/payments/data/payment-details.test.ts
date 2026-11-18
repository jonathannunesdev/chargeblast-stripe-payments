import { describe, expect, it } from "vitest";

import type { Payment } from "../domain/payment";
import { getPaymentDetails } from "./payment-details";

function payment(overrides: Partial<Payment>): Payment {
  return {
    id: "pi_3kMg5AEfd5tYxm9rM6ynPK98",
    amount: 2000,
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

describe("getPaymentDetails", () => {
  it("is the same every time for a payment", () => {
    expect(getPaymentDetails(payment({}))).toEqual(
      getPaymentDetails(payment({})),
    );
  });

  it("charges a fee only when funds were captured", () => {
    expect(getPaymentDetails(payment({})).fee).toBe(88);
    expect(getPaymentDetails(payment({ status: "failed" })).fee).toBeNull();
  });

  it("has a card expiry only for cards", () => {
    expect(getPaymentDetails(payment({})).cardExpiry).not.toBeNull();
    expect(
      getPaymentDetails(
        payment({
          paymentMethod: {
            type: "us_bank_account",
            bankName: "Chase",
            last4: "6789",
          },
        }),
      ).cardExpiry,
    ).toBeNull();
  });
});
