import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import type { Payment } from "../domain/payment";

interface TableFooterProps {
  table: Table<Payment>;
  pageSizes: readonly number[];
}

const numberFormat = new Intl.NumberFormat("en-US");

export function TableFooter({ table, pageSizes }: TableFooterProps) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getRowCount();
  const first = total === 0 ? 0 : pageIndex * pageSize + 1;
  const last = Math.min(total, (pageIndex + 1) * pageSize);

  return (
    <div className="flex items-center justify-between pt-3 text-sm text-ink-body">
      <p aria-live="polite">
        {total === 0 ? (
          "0 results"
        ) : (
          <>
            Viewing{" "}
            <span className="font-semibold text-ink">
              {numberFormat.format(first)}–{numberFormat.format(last)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-ink">
              {numberFormat.format(total)}
            </span>{" "}
            results
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-xs text-ink-subdued">
          Rows per page
          <select
            value={pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="h-6 cursor-pointer rounded-md bg-white px-1.5 text-xs font-semibold text-ink shadow-[0_0_0_1px_var(--color-line)] focus-visible:outline-2 focus-visible:outline-brand"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <Button
          size="sm"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <Button
          size="sm"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
