import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Providers } from "@/app/providers";

import { DATASET_NOW, listPayments } from "../data/payments-service";
import { formatAmount } from "../domain/format";
import {
  EMPTY_FILTERS,
  filterPayments,
  type PaymentFilters,
} from "../domain/filters";
import { compareByAmount } from "../domain/sorting";
import { PaymentsScreen } from "./payments-screen";

async function renderScreen() {
  const user = userEvent.setup();
  render(
    <Providers>
      <PaymentsScreen />
    </Providers>,
  );
  await screen.findByText("jlima@fwdesign.com");
  return user;
}

function footerText() {
  return screen.getByText(/^(Viewing .+|0) results$/).textContent;
}

function filterChip(name: string) {
  return within(screen.getByRole("group", { name: "Filters" })).getByRole(
    "button",
    { name },
  );
}

function dataRows() {
  return screen.getAllByRole("row").slice(1);
}

async function expectedCount(filters: Partial<PaymentFilters>) {
  const payments = await listPayments();
  return filterPayments(payments, { ...EMPTY_FILTERS, ...filters }, DATASET_NOW)
    .length;
}

describe("PaymentsScreen", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the newest 25 payments first", async () => {
    await renderScreen();
    expect(dataRows()).toHaveLength(25);
    expect(footerText()).toBe("Viewing 1–25 of 500 results");
    expect(within(dataRows()[0]!).getByText("$9.88")).toBeInTheDocument();
  });

  it("filters by status from the quick filters", async () => {
    const user = await renderScreen();
    await user.click(
      screen.getByRole("button", { name: "Failed", pressed: false }),
    );

    const count = await expectedCount({ statuses: ["failed"] });
    expect(footerText()).toBe(`Viewing 1–25 of ${count} results`);
    for (const row of dataRows()) {
      expect(within(row).getByText("Failed")).toBeInTheDocument();
    }
  });

  it("applies a multi-select status filter from its popover", async () => {
    const user = await renderScreen();
    await user.click(filterChip("Status"));
    await user.click(screen.getByRole("checkbox", { name: "Refunded" }));
    await user.click(screen.getByRole("checkbox", { name: "Blocked" }));
    await user.click(screen.getByRole("button", { name: "Apply" }));

    const count = await expectedCount({ statuses: ["refunded", "blocked"] });
    expect(footerText()).toBe(`Viewing 1–25 of ${count} results`);
    expect(
      screen.getByRole("button", { name: /Status.*Refunded, Blocked/ }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Clear Status filter" }),
    );
    expect(footerText()).toBe("Viewing 1–25 of 500 results");
  });

  it("searches by the last 4 digits", async () => {
    const user = await renderScreen();
    await user.type(screen.getByRole("searchbox"), "4149");
    const count = await expectedCount({ query: "4149" });
    expect(dataRows()).toHaveLength(count);
    expect(screen.getByText("jlima@fwdesign.com")).toBeInTheDocument();
  });

  it("shows an empty state that clears the filters", async () => {
    const user = await renderScreen();
    await user.type(screen.getByRole("searchbox"), "no-such-payment");

    expect(
      screen.getByText("No payments match the current filters."),
    ).toBeInTheDocument();
    expect(footerText()).toBe("0 results");

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(footerText()).toBe("Viewing 1–25 of 500 results");
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });

  it("rejects an amount range where the minimum exceeds the maximum", async () => {
    const user = await renderScreen();
    await user.click(filterChip("Amount"));
    await user.type(screen.getByLabelText("Minimum amount"), "50");
    await user.type(screen.getByLabelText("Maximum amount"), "10");

    expect(screen.getByRole("alert")).toHaveTextContent("minimum must be less");
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
  });

  it("filters by a date preset", async () => {
    const user = await renderScreen();
    await user.click(filterChip("Date and time"));
    await user.selectOptions(screen.getByLabelText("Date range"), "today");
    await user.click(screen.getByRole("button", { name: "Apply" }));

    const count = await expectedCount({
      dateRange: { type: "preset", preset: "today" },
    });
    expect(count).toBeGreaterThan(20);
    expect(count).toBeLessThan(500);
    expect(footerText()).toBe(`Viewing 1–25 of ${count} results`);
  });

  it("sorts by amount, largest first", async () => {
    const user = await renderScreen();
    await user.click(
      within(screen.getByRole("columnheader", { name: /Amount/ })).getByRole(
        "button",
      ),
    );

    const largest = [...(await listPayments())].sort(compareByAmount).at(-1)!;
    expect(
      within(dataRows()[0]!).getByText(
        formatAmount(largest.amount, largest.currency),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Amount/ }),
    ).toHaveAttribute("aria-sort", "descending");
  });

  it("paginates with 25, 50 or 100 rows per page", async () => {
    const user = await renderScreen();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(footerText()).toBe("Viewing 26–50 of 500 results");

    await user.selectOptions(screen.getByLabelText("Rows per page"), "100");
    expect(dataRows()).toHaveLength(100);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });

  it("copies the full payment ID", async () => {
    const user = await renderScreen();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue();

    await user.click(
      screen.getByRole("button", {
        name: "Copy payment ID pi_3kMg5AEfd5tYxm9rM6ynPK98",
      }),
    );

    expect(writeText).toHaveBeenCalledWith("pi_3kMg5AEfd5tYxm9rM6ynPK98");
    await waitFor(() =>
      expect(screen.getByText("Copied to clipboard")).toBeInTheDocument(),
    );
  });
});
