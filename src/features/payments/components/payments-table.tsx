"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { clsx } from "clsx";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import type { Payment } from "../domain/payment";
import { createPaymentColumns } from "./columns";
import { TableFooter } from "./table-footer";

export const PAGE_SIZES = [25, 50, 100] as const;

interface PaymentsTableProps {
  payments: Payment[];
  now: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function PaymentsTable({
  payments,
  now,
  hasActiveFilters,
  onClearFilters,
}: PaymentsTableProps) {
  const columns = useMemo(() => createPaymentColumns(now), [now]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created", desc: true },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZES[0],
  });
  const [rowSelection, setRowSelection] = useState({});

  // TanStack Table returns non-memoizable functions; the React Compiler is off.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: payments,
    columns,
    state: { sorting, pagination, rowSelection },
    onSortingChange: (updater) => {
      setSorting(updater);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getRowId: (payment) => payment.id,
    enableRowSelection: (row) => row.original.status === "succeeded",
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const { align, className } =
                    header.column.columnDef.meta ?? {};
                  const sorted = header.column.getIsSorted();
                  const label = flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  );

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                      className={clsx(
                        "h-10 border-b border-line-subtle bg-white px-4 text-xs font-semibold whitespace-nowrap text-ink-subdued",
                        align === "right" ? "text-right" : "text-left",
                        className,
                      )}
                    >
                      {header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={clsx(
                            "group/sort inline-flex cursor-pointer items-center gap-1 rounded-sm hover:text-ink focus-visible:outline-2 focus-visible:outline-brand",
                            align === "right" && "flex-row-reverse",
                            sorted && "text-ink",
                          )}
                        >
                          {label}
                          <SortIndicator direction={sorted} />
                        </button>
                      ) : (
                        label
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="border-b border-line-subtle py-16 text-center"
                >
                  <p className="font-semibold">No results</p>
                  <p className="mt-1 text-ink-subdued">
                    {hasActiveFilters
                      ? "No payments match the current filters."
                      : "There are no payments yet."}
                  </p>
                  {hasActiveFilters && (
                    <Button className="mt-3" onClick={onClearFilters}>
                      Clear filters
                    </Button>
                  )}
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="group/row hover:bg-hover">
                {row.getVisibleCells().map((cell) => {
                  const { align, className } = cell.column.columnDef.meta ?? {};
                  return (
                    <td
                      key={cell.id}
                      className={clsx(
                        "h-11 border-b border-line-subtle px-4 whitespace-nowrap",
                        align === "right" && "text-right",
                        className,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TableFooter table={table} pageSizes={PAGE_SIZES} />
    </div>
  );
}

function SortIndicator({ direction }: { direction: false | "asc" | "desc" }) {
  if (!direction) {
    return (
      <ChevronDownIcon
        className="size-3 opacity-0 group-hover/sort:opacity-60"
        aria-hidden
      />
    );
  }
  const Icon = direction === "asc" ? ChevronUpIcon : ChevronDownIcon;
  return <Icon className="size-3" aria-hidden />;
}
