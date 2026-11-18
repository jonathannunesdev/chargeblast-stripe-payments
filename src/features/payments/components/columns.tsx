import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import { createColumnHelper } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { formatPaymentDate } from "../domain/format";
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
    align?: "left" | "right";
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
      meta: { className: "w-10 px-0 text-center [&>*]:align-middle" },
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
      meta: { align: "right" },
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue()} />,
      sortingFn: (a, b) => compareByStatus(a.original, b.original),
    }),
    column.accessor("paymentMethod", {
      header: "Payment method",
      cell: ({ getValue }) => <PaymentMethodCell method={getValue()} />,
      enableSorting: false,
    }),
    column.accessor("description", {
      header: "Description",
      enableSorting: false,
    }),
    column.accessor("customerEmail", {
      header: "Customer",
      enableSorting: false,
    }),
    column.accessor("id", {
      header: "Payment ID",
      cell: ({ getValue }) => <CopyableId id={getValue()} />,
      enableSorting: false,
    }),
    column.accessor("created", {
      header: "Date",
      cell: ({ getValue }) => <DateCell timestamp={getValue()} now={now} />,
      sortingFn: (a, b) => compareByCreated(a.original, b.original),
      sortDescFirst: true,
    }),
    column.accessor("refundedAt", {
      header: "Refunded date",
      cell: ({ getValue }) => {
        const refundedAt = getValue();
        return refundedAt ? formatPaymentDate(refundedAt, now) : <EmptyValue />;
      },
      enableSorting: false,
    }),
    column.accessor("declineReason", {
      header: "Decline reason",
      cell: ({ getValue }) => getValue() ?? <EmptyValue />,
      enableSorting: false,
    }),
    column.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <button
          type="button"
          aria-label={`More actions for payment ${row.original.id}`}
          className="grid size-6 cursor-pointer place-content-center rounded text-ink-subdued hover:bg-offset hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
        >
          <EllipsisHorizontalIcon className="size-4" aria-hidden />
        </button>
      ),
      meta: {
        className:
          "sticky right-0 w-12 bg-white px-3 shadow-[inset_1px_0_0_var(--color-line-subtle)] group-hover/row:bg-hover",
      },
    }),
  ];
}
