import { describe, expect, it } from "vitest";

import {
  formatAmount,
  formatPaymentDate,
  formatRelativeTime,
  shortenId,
} from "./format";

describe("formatAmount", () => {
  it.each([
    [988, "usd", "$9.88"],
    [1599, "gbp", "£15.99"],
    [9999, "brl", "R$ 99.99"],
    [123456, "eur", "€1,234.56"],
    [1200, "jpy", "¥1,200"],
  ] as const)("formats %i %s as %s", (amount, currency, expected) => {
    expect(formatAmount(amount, currency)).toBe(expected);
  });
});

describe("formatPaymentDate", () => {
  const now = new Date(2026, 10, 18, 12, 0).getTime();

  it("omits the year for dates in the current year", () => {
    const date = new Date(2026, 7, 16, 17, 3).getTime();
    expect(formatPaymentDate(date, now)).toBe("Aug 16, 5:03 PM");
  });

  it("includes the year for dates in previous years", () => {
    const date = new Date(2025, 11, 31, 9, 5).getTime();
    expect(formatPaymentDate(date, now)).toBe("Dec 31, 2025, 9:05 AM");
  });
});

describe("formatRelativeTime", () => {
  it("describes the distance from now", () => {
    const now = new Date(2026, 10, 18, 12, 0).getTime();
    const threeHoursAgo = new Date(2026, 10, 18, 9, 0).getTime();
    expect(formatRelativeTime(threeHoursAgo, now)).toBe("3 hours ago");
  });
});

describe("shortenId", () => {
  it("keeps the prefix and the last characters", () => {
    expect(shortenId("pi_3SUuVfKZ1dqrhK3O0nTqzQ4e")).toBe("pi_3SUuVf…zQ4e");
  });

  it("leaves short ids untouched", () => {
    expect(shortenId("pi_123")).toBe("pi_123");
  });
});
