import { describe, expect, it } from "vitest";

import {
  filtersFromSearchParams,
  filtersToSearchParams,
} from "./filter-params";
import { EMPTY_FILTERS, type PaymentFilters } from "./filters";

const FILTERS: PaymentFilters = {
  dateRange: { type: "custom", from: "2026-08-10", to: "2026-08-12" },
  statuses: ["failed", "refunded"],
  methods: ["card"],
  currencies: ["usd", "brl"],
  amount: { min: 10, max: 20.5 },
  query: "jjuan",
};

describe("filter search params", () => {
  it("leaves the URL empty when no filter is applied", () => {
    expect(filtersToSearchParams(EMPTY_FILTERS).toString()).toBe("");
  });

  it("writes short, readable parameters", () => {
    expect(filtersToSearchParams(FILTERS).toString()).toBe(
      "date=custom&from=2026-08-10&to=2026-08-12&status=failed%2Crefunded&method=card&currency=usd%2Cbrl&min=10&max=20.5&q=jjuan",
    );
  });

  it("reads back what it writes", () => {
    expect(filtersFromSearchParams(filtersToSearchParams(FILTERS))).toEqual(
      FILTERS,
    );
  });

  it("reads date presets", () => {
    expect(
      filtersFromSearchParams(new URLSearchParams("date=last_7_days"))
        .dateRange,
    ).toEqual({ type: "preset", preset: "last_7_days" });
  });

  it("ignores values it does not know", () => {
    expect(
      filtersFromSearchParams(
        new URLSearchParams(
          "date=yesterday&status=failed,lost&method=crypto&currency=xyz&min=-5&max=abc",
        ),
      ),
    ).toEqual({ ...EMPTY_FILTERS, statuses: ["failed"] });
  });

  it("drops an amount range where the minimum exceeds the maximum", () => {
    expect(
      filtersFromSearchParams(new URLSearchParams("min=50&max=10")).amount,
    ).toEqual(EMPTY_FILTERS.amount);
  });
});
