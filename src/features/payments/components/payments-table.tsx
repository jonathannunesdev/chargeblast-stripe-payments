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

export const DEFAULT_SORTING: SortingState = [{ id: "created", desc: true }];

interface PaymentsTableProps {
  payments: Payment[];
  now: number;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function PaymentsTable({
  payments,
  now,
  sorting,
  onSortingChange,
  hasActiveFilters,
  onClearFilters,
}: PaymentsTableProps) {
  const columns = useMemo(() => createPaymentColumns(now), [now]);
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
      onSortingChange(
        typeof updater === "function" ? updater(sorting) : updater,
      );
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

  const columnCount = table.getVisibleLeafColumns().length;

  return (
    <div>
      <div className="relative">
        <div className="overflow-x-auto">
          <table className="w-max min-w-full table-fixed border-separate border-spacing-0 text-sm">
            <colgroup>
              {table.getVisibleLeafColumns().map((column) => (
                <col
                  key={column.id}
                  style={{ width: column.columnDef.meta?.width }}
                />
              ))}
            </colgroup>
            <thead className="group/head">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => {
                    const meta = header.column.columnDef.meta;
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
                          "h-[38px] border-y border-t-line border-b-line-subtle bg-white px-1.5 text-xs font-bold whitespace-nowrap text-ink",
                          ALIGN_CLASSES[meta?.align ?? "left"],
                          meta?.className,
                        )}
                      >
                        {header.column.getCanSort() ? (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className={clsx(
                              "group/sort inline-flex cursor-pointer items-center gap-0.5 rounded-sm focus-visible:outline-2 focus-visible:outline-brand",
                              meta?.align === "right" && "flex-row-reverse",
                              meta?.revealHeaderOnHover &&
                                !sorted &&
                                "opacity-0 group-hover/head:opacity-100 focus-visible:opacity-100",
                            )}
                          >
                            {label}
                            <SortIndicator
                              direction={
                                isDefaultSort(sorting) ? false : sorted
                              }
                            />
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
                    colSpan={columnCount}
                    className="sticky left-0 border-b border-line-subtle py-16 text-center"
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
                <tr
                  key={row.id}
                  data-selected={row.getIsSelected() || undefined}
                  className="group/row hover:bg-hover"
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;
                    return (
                      <td
                        key={cell.id}
                        className={clsx(
                          "h-[37.3px] overflow-hidden border-b border-line-subtle px-1.5 whitespace-nowrap group-data-selected/row:bg-selected! first:rounded-l-md last:rounded-r-md",
                          ALIGN_CLASSES[meta?.align ?? "left"],
                          meta?.className,
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
        {/* Rows scroll under the pinned actions column, which casts a soft shadow. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-[41px] w-2 bg-linear-to-r from-black/0 to-black/[0.04]"
        />
      </div>
      <TableFooter table={table} pageSizes={PAGE_SIZES} />
    </div>
  );
}

/** The reference shows no arrow while the list is in its default order. */
function isDefaultSort(sorting: SortingState): boolean {
  const [current] = sorting;
  return (
    sorting.length === 1 &&
    current?.id === DEFAULT_SORTING[0]!.id &&
    current.desc === DEFAULT_SORTING[0]!.desc
  );
}

const ALIGN_CLASSES = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

function SortIndicator({ direction }: { direction: false | "asc" | "desc" }) {
  if (!direction) {
    return (
      <ChevronDownIcon
        className="size-3 text-ink-muted opacity-0 group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100"
        aria-hidden
      />
    );
  }
  const Icon = direction === "asc" ? ChevronUpIcon : ChevronDownIcon;
  return <Icon className="size-3" aria-hidden />;
}
