import { describe, expect, it } from "vitest";

import { formatAmount, formatPaymentDate } from "../domain/format";
import { DATASET_NOW, getPayment, listPayments } from "./payments-service";

describe("listPayments", () => {
  it("returns 500 payments with unique ids, newest first", async () => {
    const payments = await listPayments();
    expect(payments).toHaveLength(500);
    expect(new Set(payments.map((p) => p.id)).size).toBe(500);

    const created = payments.map((p) => p.created);
    expect(created).toEqual([...created].sort((a, b) => b - a));
    expect(created.every((timestamp) => timestamp <= DATASET_NOW)).toBe(true);
  });

  it("starts with the rows from the reference screenshot", async () => {
    const [first, second, , , fifth] = await listPayments();

    expect(first).toMatchObject({ status: "failed", currency: "usd" });
    expect(formatAmount(first!.amount, first!.currency)).toBe("$9.88");
    expect(formatPaymentDate(first!.created, DATASET_NOW)).toBe(
      "Aug 16, 5:03 PM",
    );

    expect(second?.paymentMethod).toMatchObject({
      brand: "mastercard",
      wallet: "link",
      last4: "0900",
    });
    expect(formatAmount(fifth!.amount, fifth!.currency)).toBe("R$ 99.99");
  });
});

describe("getPayment", () => {
  it("finds a payment by id", async () => {
    const [first] = await listPayments();
    expect(await getPayment(first!.id)).toEqual(first);
  });

  it("returns null for an unknown id", async () => {
    expect(await getPayment("pi_unknown")).toBeNull();
  });
});
