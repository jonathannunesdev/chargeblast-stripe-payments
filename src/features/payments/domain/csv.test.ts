import { describe, expect, it } from "vitest";

import { paymentsToCsv } from "./csv";
import type { Payment } from "./payment";

function payment(overrides: Partial<Payment>): Payment {
  return {
    id: "pi_1",
    amount: 988,
    currency: "usd",
    status: "failed",
    paymentMethod: {
      type: "card",
      brand: "visa",
      last4: "4242",
      wallet: "link",
    },
    description: "Subscription update",
    customerEmail: "jane@example.com",
    created: Date.UTC(2026, 7, 16, 20, 3),
    refundedAt: null,
    declineReason: "Do not honor",
    ...overrides,
  };
}

describe("paymentsToCsv", () => {
  it("writes a header and one line per payment", () => {
    const [header, row] = paymentsToCsv([payment({})]).split("\n");
    expect(header).toBe(
      "id,created,amount,currency,status,payment_method,card_brand,wallet,last4,description,customer_email,refunded_at,decline_reason",
    );
    expect(row).toBe(
      "pi_1,2026-08-16T20:03:00.000Z,9.88,USD,Failed,wallet,visa,link,4242,Subscription update,jane@example.com,,Do not honor",
    );
  });

  it("formats zero-decimal currencies and bank debits", () => {
    const [, row] = paymentsToCsv([
      payment({
        amount: 1200,
        currency: "jpy",
        paymentMethod: {
          type: "us_bank_account",
          bankName: "Chase",
          last4: "6789",
        },
      }),
    ]).split("\n");
    expect(row).toContain(",1200,JPY,Failed,ach,,,6789,");
  });

  it("quotes values with commas or quotes", () => {
    const [, row] = paymentsToCsv([
      payment({ description: 'Invoice "A", March' }),
    ]).split("\n");
    expect(row).toContain(',"Invoice ""A"", March",');
  });

  it("neutralises values that spreadsheets would run as formulas", () => {
    const [, row] = paymentsToCsv([
      payment({ customerEmail: "=HYPERLINK(1)" }),
    ]).split("\n");
    expect(row).toContain(",'=HYPERLINK(1),");
  });
});
