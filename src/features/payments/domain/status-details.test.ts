import { describe, expect, it } from "vitest";

import type { Payment } from "./payment";
import { getStatusDetails } from "./status-details";

function payment(overrides: Partial<Payment>): Payment {
  return {
    id: "pi_1",
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

describe("getStatusDetails", () => {
  it("explains failed payments by decline reason", () => {
    expect(
      getStatusDetails(
        payment({ status: "failed", declineReason: "Insufficient funds" }),
      ),
    ).toEqual({
      body: "This payment failed because the customer had insufficient funds.",
      mentionsTimeline: true,
    });
  });

  it("falls back to the issuing bank for other decline reasons", () => {
    expect(
      getStatusDetails(
        payment({ status: "failed", declineReason: "Do not honor" }),
      )?.body,
    ).toBe("This payment failed because the issuing bank declined it.");
  });

  it("gives blocked payments a title", () => {
    expect(getStatusDetails(payment({ status: "blocked" }))?.title).toBe(
      "Payment declined by rule",
    );
  });

  it("links pending payments to the docs", () => {
    expect(
      getStatusDetails(payment({ status: "pending" }))?.learnMoreHref,
    ).toMatch(/^https:\/\/docs\.stripe\.com\//);
  });

  it("has nothing to add for succeeded and uncaptured payments", () => {
    expect(getStatusDetails(payment({ status: "succeeded" }))).toBeNull();
    expect(getStatusDetails(payment({ status: "uncaptured" }))).toBeNull();
  });
});
