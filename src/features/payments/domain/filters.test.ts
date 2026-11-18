import { describe, expect, it } from "vitest";

import {
  EMPTY_FILTERS,
  filterPayments,
  isAmountRangeValid,
  type PaymentFilters,
} from "./filters";
import type { Payment } from "./payment";

const NOW = new Date(2026, 10, 18, 15, 0).getTime();

function at(month: number, day: number, hour = 12): number {
  return new Date(2026, month, day, hour).getTime();
}

function payment(overrides: Partial<Payment> & Pick<Payment, "id">): Payment {
  return {
    amount: 1000,
    currency: "usd",
    status: "succeeded",
    paymentMethod: { type: "card", brand: "visa", last4: "4242", wallet: null },
    description: "Subscription update",
    customerEmail: "jane@example.com",
    created: at(10, 18),
    refundedAt: null,
    declineReason: null,
    ...overrides,
  };
}

const PAYMENTS: Payment[] = [
  payment({ id: "pi_today", created: at(10, 18, 1) }),
  payment({
    id: "pi_six_days",
    created: at(10, 12, 0),
    status: "failed",
    currency: "gbp",
    amount: 2500,
  }),
  payment({
    id: "pi_seven_days",
    created: at(10, 11, 23),
    status: "refunded",
    paymentMethod: {
      type: "us_bank_account",
      bankName: "Chase",
      last4: "6789",
    },
  }),
  payment({
    id: "pi_month",
    created: at(9, 20),
    status: "pending",
    currency: "jpy",
    amount: 1200,
    customerEmail: "Tom.Silva@Gmail.com",
    paymentMethod: {
      type: "card",
      brand: "mastercard",
      last4: "0900",
      wallet: "apple_pay",
    },
  }),
  payment({ id: "pi_old", created: at(7, 16) }),
];

function ids(filters: Partial<PaymentFilters>): string[] {
  return filterPayments(PAYMENTS, { ...EMPTY_FILTERS, ...filters }, NOW).map(
    (p) => p.id,
  );
}

describe("filterPayments", () => {
  it("returns everything when no filter is set", () => {
    expect(ids({})).toHaveLength(PAYMENTS.length);
  });

  describe("date range", () => {
    it("keeps only payments created today", () => {
      expect(ids({ dateRange: { type: "preset", preset: "today" } })).toEqual([
        "pi_today",
      ]);
    });

    it("covers the last 7 calendar days including today", () => {
      expect(
        ids({ dateRange: { type: "preset", preset: "last_7_days" } }),
      ).toEqual(["pi_today", "pi_six_days"]);
    });

    it("covers the last 30 calendar days including today", () => {
      expect(
        ids({ dateRange: { type: "preset", preset: "last_30_days" } }),
      ).toEqual(["pi_today", "pi_six_days", "pi_seven_days", "pi_month"]);
    });

    it("treats both ends of a custom range as inclusive days", () => {
      expect(
        ids({
          dateRange: { type: "custom", from: "2026-11-11", to: "2026-11-12" },
        }),
      ).toEqual(["pi_six_days", "pi_seven_days"]);
    });

    it("supports open-ended custom ranges", () => {
      expect(
        ids({ dateRange: { type: "custom", from: null, to: "2026-10-31" } }),
      ).toEqual(["pi_month", "pi_old"]);
    });
  });

  it("filters by any of the selected statuses", () => {
    expect(ids({ statuses: ["failed", "refunded"] })).toEqual([
      "pi_six_days",
      "pi_seven_days",
    ]);
  });

  it("separates cards, wallets and bank debits", () => {
    expect(ids({ methods: ["ach"] })).toEqual(["pi_seven_days"]);
    expect(ids({ methods: ["wallet"] })).toEqual(["pi_month"]);
    expect(ids({ methods: ["card", "wallet"] })).not.toContain("pi_seven_days");
  });

  it("filters by currency", () => {
    expect(ids({ currencies: ["gbp", "jpy"] })).toEqual([
      "pi_six_days",
      "pi_month",
    ]);
  });

  describe("amount range", () => {
    it("compares in major units with inclusive bounds", () => {
      expect(ids({ amount: { min: 10, max: 25 } })).toEqual([
        "pi_today",
        "pi_six_days",
        "pi_seven_days",
        "pi_old",
      ]);
    });

    it("handles zero-decimal currencies", () => {
      expect(ids({ amount: { min: 1000, max: null } })).toEqual(["pi_month"]);
    });
  });

  describe("search", () => {
    it("matches part of a payment id", () => {
      expect(ids({ query: "SIX_DAYS" })).toEqual(["pi_six_days"]);
    });

    it("matches emails case-insensitively", () => {
      expect(ids({ query: "  tom.silva@gmail " })).toEqual(["pi_month"]);
    });

    it("matches the last 4 digits exactly", () => {
      expect(ids({ query: "6789" })).toEqual(["pi_seven_days"]);
      expect(ids({ query: "678" })).toEqual([]);
    });
  });

  it("combines filters", () => {
    expect(
      ids({
        dateRange: { type: "preset", preset: "last_30_days" },
        statuses: ["succeeded", "pending"],
        methods: ["card"],
      }),
    ).toEqual(["pi_today"]);
  });
});

describe("isAmountRangeValid", () => {
  it("rejects a minimum above the maximum", () => {
    expect(isAmountRangeValid({ min: 50, max: 10 })).toBe(false);
    expect(isAmountRangeValid({ min: 10, max: 10 })).toBe(true);
    expect(isAmountRangeValid({ min: null, max: 10 })).toBe(true);
  });
});
