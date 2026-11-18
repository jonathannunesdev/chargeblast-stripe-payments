import { describe, expect, it } from "vitest";

import type { Payment } from "./payment";
import { getPaymentTimeline } from "./payment-timeline";

function payment(overrides: Partial<Payment>): Payment {
  return {
    id: "pi_1",
    amount: 1000,
    currency: "usd",
    status: "succeeded",
    paymentMethod: { type: "card", brand: "visa", last4: "4242", wallet: null },
    description: "Subscription update",
    customerEmail: "jane@example.com",
    created: 1_000_000,
    refundedAt: null,
    declineReason: null,
    ...overrides,
  };
}

const titles = (p: Payment) => getPaymentTimeline(p).map((e) => e.title);

describe("getPaymentTimeline", () => {
  it("lists events newest first and highlights the latest", () => {
    const timeline = getPaymentTimeline(payment({}));
    expect(timeline.map((e) => e.title)).toEqual([
      "Payment succeeded",
      "Payment started",
    ]);
    expect(timeline[0]!.current).toBe(true);
    expect(timeline[1]!.current).toBeUndefined();
  });

  it("explains why a payment failed", () => {
    const [failed] = getPaymentTimeline(
      payment({ status: "failed", declineReason: "Insufficient funds" }),
    );
    expect(failed).toMatchObject({
      title: "Payment failed",
      detail: "Insufficient funds",
    });
  });

  it("adds the refund after the successful charge", () => {
    expect(
      titles(payment({ status: "refunded", refundedAt: 2_000_000 })),
    ).toEqual(["Refund initiated", "Payment succeeded", "Payment started"]);
  });

  it("covers every status", () => {
    expect(titles(payment({ status: "blocked" }))[0]).toBe("Payment blocked");
    expect(titles(payment({ status: "canceled" }))[0]).toBe("Payment canceled");
    expect(titles(payment({ status: "disputed" }))[0]).toBe("Dispute opened");
    expect(titles(payment({ status: "uncaptured" }))[0]).toBe(
      "Payment authorized",
    );
    expect(titles(payment({ status: "pending" }))[0]).toBe(
      "Payment incomplete",
    );
  });
});
