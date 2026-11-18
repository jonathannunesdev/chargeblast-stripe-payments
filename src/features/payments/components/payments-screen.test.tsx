import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Providers } from "@/app/providers";
import { downloadFile } from "@/lib/download";

import { DATASET_NOW, listPayments } from "../data/payments-service";
import { formatAmount } from "../domain/format";
import {
  EMPTY_FILTERS,
  filterPayments,
  type PaymentFilters,
} from "../domain/filters";
import { STATUS_LABELS } from "../domain/payment";
import {
  compareByAmount,
  compareByCreated,
  compareByStatus,
} from "../domain/sorting";
import { PaymentsScreen } from "./payments-screen";

vi.mock("@/lib/download", () => ({ downloadFile: vi.fn() }));

async function renderScreen() {
  const user = userEvent.setup();
  render(
    <Providers>
      <PaymentsScreen />
    </Providers>,
  );
  await screen.findByText("jjuan@hwlawnv.com");
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

function viewing(count: number) {
  return `Viewing 1–${Math.min(25, count)} of ${count} results`;
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
    expect(screen.getByText("jjuan@hwlawnv.com")).toBeInTheDocument();
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

  it("rejects negative amounts", async () => {
    const user = await renderScreen();
    await user.click(filterChip("Amount"));
    await user.type(screen.getByLabelText("Minimum amount"), "-5");

    expect(screen.getByRole("alert")).toHaveTextContent("can’t be negative");
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
  });

  it("filters by an amount range", async () => {
    const user = await renderScreen();
    await user.click(filterChip("Amount"));
    await user.type(screen.getByLabelText("Minimum amount"), "10");
    await user.type(screen.getByLabelText("Maximum amount"), "20");
    await user.click(screen.getByRole("button", { name: "Apply" }));

    const count = await expectedCount({ amount: { min: 10, max: 20 } });
    expect(footerText()).toBe(viewing(count));
  });

  it("filters by payment method", async () => {
    const user = await renderScreen();
    await user.click(filterChip("Payment method"));
    await user.click(
      screen.getByRole("checkbox", { name: "ACH Direct Debit" }),
    );
    await user.click(screen.getByRole("button", { name: "Apply" }));

    const count = await expectedCount({ methods: ["ach"] });
    expect(count).toBeGreaterThan(0);
    expect(footerText()).toBe(viewing(count));
  });

  it("filters by a custom date range", async () => {
    const user = await renderScreen();
    await user.click(filterChip("Date and time"));
    await user.selectOptions(screen.getByLabelText("Date range"), "custom");
    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2026-08-10" },
    });
    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: "2026-08-12" },
    });
    await user.click(screen.getByRole("button", { name: "Apply" }));

    const count = await expectedCount({
      dateRange: { type: "custom", from: "2026-08-10", to: "2026-08-12" },
    });
    expect(count).toBeGreaterThan(0);
    expect(footerText()).toBe(viewing(count));
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

  it("sorts by status", async () => {
    const user = await renderScreen();
    await user.click(
      within(screen.getByRole("columnheader", { name: /Status/ })).getByRole(
        "button",
      ),
    );

    const first = [...(await listPayments())].sort(compareByStatus)[0]!;
    expect(
      within(dataRows()[0]!).getByText(STATUS_LABELS[first.status]),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Status/ }),
    ).toHaveAttribute("aria-sort", "ascending");
  });

  it("sorts by date, oldest first", async () => {
    const user = await renderScreen();
    await user.click(
      within(screen.getByRole("columnheader", { name: /Date/ })).getByRole(
        "button",
      ),
    );

    const oldest = [...(await listPayments())].sort(compareByCreated)[0]!;
    expect(
      within(dataRows()[0]!).getByText(oldest.customerEmail),
    ).toBeInTheDocument();
  });

  it("paginates with 25, 50 or 100 rows per page", async () => {
    const user = await renderScreen();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(footerText()).toBe("Viewing 26–50 of 500 results");

    await user.click(screen.getByRole("button", { name: "Rows per page: 25" }));
    await user.click(screen.getByRole("button", { name: "100 rows" }));
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
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Copied");
  });

  it("explains a failed status on hover", async () => {
    const user = await renderScreen();
    const [firstRow] = dataRows();

    await user.hover(within(firstRow!).getByText("Failed"));

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "This payment failed because the issuing bank declined it.",
    );
  });

  it("copies the payment ID from the row menu", async () => {
    const user = await renderScreen();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue();

    await user.click(
      screen.getByRole("button", {
        name: "More actions for payment pi_3kMg5AEfd5tYxm9rM6ynPK98",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Copy payment ID" }));

    expect(writeText).toHaveBeenCalledWith("pi_3kMg5AEfd5tYxm9rM6ynPK98");
  });

  it("reorders columns by dragging a header", async () => {
    await renderScreen();
    const header = (name: string) => screen.getByRole("columnheader", { name });
    // jsdom has no layout, so give each header its width from the table.
    for (const th of screen.getAllByRole("columnheader")) {
      const index = [...th.parentElement!.children].indexOf(th);
      const widths = [...document.querySelectorAll("colgroup col")].map((col) =>
        Number.parseFloat((col as HTMLElement).style.width),
      );
      const left = widths.slice(0, index).reduce((a, b) => a + b, 0);
      th.getBoundingClientRect = () =>
        ({
          left,
          width: widths[index]!,
          right: left + widths[index]!,
        }) as DOMRect;
    }

    fireEvent.pointerDown(header("Amount"), { button: 0, clientX: 60 });
    fireEvent.pointerMove(window, { clientX: 700 });
    fireEvent.pointerUp(window, { clientX: 700 });

    const names = screen
      .getAllByRole("columnheader")
      .map((th) => th.textContent);
    expect(names.indexOf("Amount")).toBeGreaterThan(names.indexOf("Customer"));
    expect(names.indexOf("Currency")).toBe(names.indexOf("Amount") + 1);
    expect(names[0]).toBe("");
    expect(names.at(-1)).toBe("Actions");
  });

  it("resizes a column by dragging its edge", async () => {
    await renderScreen();
    const customer = screen.getByRole("columnheader", { name: "Customer" });
    const column = () =>
      document.querySelectorAll("colgroup col")[
        [...customer.parentElement!.children].indexOf(customer)
      ] as HTMLElement;
    const handle = customer.querySelector(".cursor-col-resize")!;

    fireEvent.mouseDown(handle, { clientX: 500 });
    fireEvent.mouseMove(document, { clientX: 420, buttons: 1 });
    fireEvent.mouseUp(document, { clientX: 420 });

    expect(column().style.width).toBe("192px");
  });

  it("exports the filtered payments as CSV", async () => {
    const user = await renderScreen();
    await user.click(
      screen.getByRole("button", { name: "Failed", pressed: false }),
    );
    await user.click(screen.getByRole("button", { name: "Export" }));

    expect(downloadFile).toHaveBeenCalledTimes(1);
    const [filename, csv, type] = vi.mocked(downloadFile).mock.calls[0]!;
    expect(filename).toBe("payments-2026-08-16.csv");
    expect(type).toContain("text/csv");

    const lines = csv.split("\n");
    const count = await expectedCount({ statuses: ["failed"] });
    expect(lines).toHaveLength(count + 1);
    expect(lines[1]).toMatch(
      /^pi_3kMg5AEfd5tYxm9rM6ynPK98,.*,9\.88,USD,Failed,/,
    );
  });
});
