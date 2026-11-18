import { describe, expect, it } from "vitest";

import { EMPTY_FILTERS } from "./filters";
import {
  hasActiveFilters,
  summarizeAmount,
  summarizeCurrencies,
  summarizeDateRange,
  summarizeStatuses,
} from "./filter-summary";

describe("filter summaries", () => {
  it("describes date ranges", () => {
    expect(summarizeDateRange({ type: "preset", preset: "last_7_days" })).toBe(
      "Last 7 days",
    );
    expect(
      summarizeDateRange({
        type: "custom",
        from: "2026-08-01",
        to: "2026-08-16",
      }),
    ).toBe("Aug 1 – Aug 16");
    expect(
      summarizeDateRange({ type: "custom", from: null, to: "2026-08-16" }),
    ).toBe("Before Aug 16");
  });

  it("describes amount ranges", () => {
    expect(summarizeAmount({ min: 10, max: 50.5 })).toBe("10 – 50.5");
    expect(summarizeAmount({ min: 10, max: null })).toBe("≥ 10");
    expect(summarizeAmount({ min: null, max: 1000 })).toBe("≤ 1,000");
  });

  it("shortens long value lists", () => {
    expect(summarizeStatuses(["failed", "refunded", "blocked"])).toBe(
      "Failed, Refunded +1",
    );
    expect(summarizeCurrencies(["gbp", "usd"])).toBe("USD, GBP");
  });

  it("detects active filters", () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, query: "  " })).toBe(false);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, statuses: ["failed"] })).toBe(
      true,
    );
  });
});
