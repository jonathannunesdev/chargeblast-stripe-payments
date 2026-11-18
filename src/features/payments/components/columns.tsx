import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import { createColumnHelper } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { formatCurrencyCode, formatPaymentDate } from "../domain/format";
import type { Payment } from "../domain/payment";
import {
  compareByAmount,
  compareByCreated,
  compareByStatus,
} from "../domain/sorting";
import { AmountCell } from "./cells/amount-cell";
import { CopyableId } from "./cells/copyable-id";
import { DateCell } from "./cells/date-cell";
import { EmptyValue } from "./cells/empty-value";
import { PaymentMethodCell } from "./cells/payment-method-cell";
import { StatusBadge } from "./cells/status-badge";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    /** Column width in px, measured from the reference screenshot. */
    width: number;
    align?: "left" | "right" | "center";
    /** Header label stays hidden until the header is hovered or focused. */
    revealHeaderOnHover?: boolean;
    className?: string;
  }
}

const column = createColumnHelper<Payment>();

export function createPaymentColumns(now: number) {
  return [
    column.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all payments on this page"
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select payment ${row.original.id}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      meta: { width: 26, align: "center", className: "px-[5px]" },
    }),
    column.accessor("amount", {
      header: "Amount",
      cell: ({ row }) => (
        <AmountCell
          amount={row.original.amount}
          currency={row.original.currency}
        />
      ),
      sortingFn: (a, b) => compareByAmount(a.original, b.original),
      sortDescFirst: true,
      meta: { width: 91, align: "right", className: "pr-2 pl-1.5" },
    }),
    column.accessor("currency", {
      header: () => <span className="sr-only">Currency</span>,
      cell: ({ getValue }) => (
        <span className="text-ink-subdued">
          {formatCurrencyCode(getValue())}
        </span>
      ),
      enableSorting: false,
      meta: { width: 41 },
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue()} />,
      sortingFn: (a, b) => compareByStatus(a.original, b.original),
      meta: { width: 121, revealHeaderOnHover: true },
    }),
    column.accessor("paymentMethod", {
      header: "Payment method",
      cell: ({ getValue }) => <PaymentMethodCell method={getValue()} />,
      enableSorting: false,
      meta: { width: 145 },
    }),
    column.accessor("description", {
      header: "Description",
      cell: ({ getValue }) => (
        <span className="text-ink-subdued">{getValue()}</span>
      ),
      enableSorting: false,
      meta: { width: 156 },
    }),
    column.accessor("customerEmail", {
      header: "Customer",
      cell: ({ getValue }) => (
        <span className="text-ink-subdued">{getValue()}</span>
      ),
      enableSorting: false,
      meta: { width: 272 },
    }),
    column.accessor("created", {
      header: "Date",
      cell: ({ getValue }) => <DateCell timestamp={getValue()} now={now} />,
      sortingFn: (a, b) => compareByCreated(a.original, b.original),
      sortDescFirst: true,
      meta: { width: 136 },
    }),
    column.accessor("refundedAt", {
      header: "Refunded date",
      cell: ({ getValue }) => {
        const refundedAt = getValue();
        return refundedAt ? (
          <span className="text-ink-subdued">
            {formatPaymentDate(refundedAt, now)}
          </span>
        ) : (
          <EmptyValue />
        );
      },
      enableSorting: false,
      meta: { width: 115 },
    }),
    column.accessor("declineReason", {
      header: "Decline reason",
      cell: ({ getValue }) => {
        const reason = getValue();
        return reason ? (
          <span className="text-ink-subdued">{reason}</span>
        ) : (
          <EmptyValue />
        );
      },
      enableSorting: false,
      meta: { width: 180 },
    }),
    column.accessor("id", {
      header: "Payment ID",
      cell: ({ getValue }) => <CopyableId id={getValue()} />,
      enableSorting: false,
      meta: { width: 190 },
    }),
    column.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <button
          type="button"
          aria-label={`More actions for payment ${row.original.id}`}
          className="grid size-6 cursor-pointer place-content-center rounded text-ink-muted hover:bg-offset hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
        >
          <EllipsisHorizontalIcon className="size-4" aria-hidden />
        </button>
      ),
      meta: {
        width: 41,
        align: "center",
        className:
          "sticky right-0 z-10 bg-white px-0 shadow-[2px_0_0_#fff] group-hover/row:bg-hover [&>*]:mx-auto",
      },
    }),
  ];
}
