import { describe, expect, it } from "vitest";

import { reorderByPosition } from "./column-order";

const ORDER = ["select", "amount", "currency", "status", "customer", "actions"];
const WIDTHS = {
  select: 20,
  amount: 90,
  currency: 40,
  status: 100,
  customer: 200,
  actions: 40,
};

describe("reorderByPosition", () => {
  it("keeps the order until the pointer passes a neighbor's center", () => {
    expect(
      reorderByPosition(ORDER, WIDTHS, "status", { pointer: 210, left: 160 }),
    ).toEqual({
      order: ORDER,
      offset: 10,
    });
  });

  it("moves a column once the pointer passes the next one's center", () => {
    expect(
      reorderByPosition(ORDER, WIDTHS, "status", { pointer: 310, left: 260 }),
    ).toEqual({
      order: ["select", "amount", "currency", "customer", "status", "actions"],
      offset: -90,
    });
  });

  it("moves the currency together with the amount", () => {
    expect(
      reorderByPosition(ORDER, WIDTHS, "amount", { pointer: 400, left: 320 })
        .order,
    ).toEqual([
      "select",
      "status",
      "customer",
      "amount",
      "currency",
      "actions",
    ]);
  });

  it("never splits the amount from its currency", () => {
    expect(
      reorderByPosition(ORDER, WIDTHS, "status", { pointer: 70, left: 20 })
        .order,
    ).toEqual([
      "select",
      "status",
      "amount",
      "currency",
      "customer",
      "actions",
    ]);
  });

  it("keeps pinned columns at the edges", () => {
    const start = reorderByPosition(ORDER, WIDTHS, "customer", {
      pointer: -400,
      left: -500,
    });
    expect(start.order[0]).toBe("select");
    expect(start.offset).toBe(0);

    const end = reorderByPosition(ORDER, WIDTHS, "amount", {
      pointer: 5100,
      left: 5000,
    });
    expect(end.order.at(-1)).toBe("actions");
    expect(end.offset).toBe(0);
  });
});
