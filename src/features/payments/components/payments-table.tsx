"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnOrderState,
  type ColumnSizingState,
  type Header,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import {
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { Button } from "@/components/ui/button";

import type { Payment } from "../domain/payment";
import { columnGroup, isPinnedColumn, reorderByPosition } from "./column-order";
import { createPaymentColumns } from "./columns";
import { TableFooter } from "./table-footer";

const PAGE_SIZES = [25, 50, 100] as const;

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
  const router = useRouter();
  const columns = useMemo(() => createPaymentColumns(now), [now]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZES[0],
  });
  const [rowSelection, setRowSelection] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [dragged, setDragged] = useState<{
    ids: string[];
    offset: number;
    /** The card that floats under the dragged column, in px from the wrapper. */
    card: { left: number; width: number; height: number };
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const suppressClick = useRef(false);

  // TanStack Table returns non-memoizable functions; the React Compiler is off.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: payments,
    columns,
    state: { sorting, pagination, rowSelection, columnOrder, columnSizing },
    onSortingChange: (updater) => {
      onSortingChange(
        typeof updater === "function" ? updater(sorting) : updater,
      );
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    defaultColumn: { minSize: 40 },
    getRowId: (payment) => payment.id,
    enableRowSelection: (row) => row.original.status === "succeeded",
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const columnCount = table.getVisibleLeafColumns().length;
  const currentOrder = table.getAllLeafColumns().map((column) => column.id);

  /** Drags a header: the column follows the pointer and the others move aside. */
  function startColumnDrag(event: ReactPointerEvent, columnId: string) {
    const target = event.target as HTMLElement;
    if (event.button !== 0 || target.closest("[data-resize-handle]")) return;
    const tableElement = tableRef.current;
    if (!tableElement) return;

    const widths: Record<string, number> = {};
    const lefts: Record<string, number> = {};
    const tableLeft = tableElement.getBoundingClientRect().left;
    for (const th of tableElement.querySelectorAll<HTMLElement>(
      "th[data-column-id]",
    )) {
      const rect = th.getBoundingClientRect();
      widths[th.dataset.columnId!] = rect.width;
      lefts[th.dataset.columnId!] = rect.left - tableLeft;
    }

    let order = currentOrder;
    const groupLeft = lefts[columnGroup(order, columnId)[0]!] ?? 0;
    const grabOffset = event.clientX - tableLeft - groupLeft;
    const startX = event.clientX;
    let active = false;

    function onMove(moveEvent: PointerEvent) {
      if (!active && Math.abs(moveEvent.clientX - startX) < 4) return;
      active = true;
      document.body.style.cursor = "grabbing";
      const tableRect = tableElement!.getBoundingClientRect();
      const pointer = moveEvent.clientX - tableRect.left;
      const next = reorderByPosition(order, widths, columnId, {
        pointer,
        left: pointer - grabOffset,
      });
      order = next.order;
      const ids = columnGroup(next.order, columnId);
      const sum = (columnIds: string[]) =>
        columnIds.reduce((total, id) => total + (widths[id] ?? 0), 0);
      const slotLeft = sum(next.order.slice(0, next.order.indexOf(ids[0]!)));
      const wrapperLeft = wrapperRef.current?.getBoundingClientRect().left ?? 0;
      setColumnOrder(next.order);
      setDragged({
        ids,
        offset: next.offset,
        card: {
          left: tableRect.left - wrapperLeft + slotLeft + next.offset,
          width: sum(ids),
          height: tableElement!.offsetHeight,
        },
      });
    }

    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.cursor = "";
      if (!active) return;
      suppressClick.current = true;
      setTimeout(() => {
        suppressClick.current = false;
      });
      setDragged(null);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function draggedStyle(columnId: string) {
    return dragged?.ids.includes(columnId)
      ? { transform: `translateX(${dragged.offset}px)` }
      : undefined;
  }

  return (
    <div>
      <div ref={wrapperRef} className="relative">
        {/* Like in the Stripe Dashboard, the dragged column sits on a floating card. */}
        {dragged && (
          <div
            aria-hidden
            className="pointer-events-none absolute -top-2 z-10 rounded-lg bg-white shadow-[0_3px_6px_rgba(0,0,0,0.12),0_7px_14px_rgba(48,49,61,0.08)]"
            style={{
              left: dragged.card.left - 8,
              width: dragged.card.width + 16,
              height: dragged.card.height + 16,
            }}
          />
        )}
        <div className="relative overflow-x-auto">
          <table
            ref={tableRef}
            className={clsx(
              "w-max min-w-full table-fixed border-separate border-spacing-0 text-sm",
              dragged && "[&_*]:cursor-grabbing!",
            )}
          >
            <colgroup>
              {table.getVisibleLeafColumns().map((column) => (
                <col key={column.id} style={{ width: column.getSize() }} />
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
                        data-column-id={header.column.id}
                        style={draggedStyle(header.column.id)}
                        onPointerDown={
                          isPinnedColumn(header.column.id)
                            ? undefined
                            : (event) =>
                                startColumnDrag(event, header.column.id)
                        }
                        onClickCapture={(event) => {
                          if (!suppressClick.current) return;
                          event.preventDefault();
                          event.stopPropagation();
                        }}
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
                          !isPinnedColumn(header.column.id) &&
                            "relative cursor-grab touch-none select-none",
                          dragged?.ids.includes(header.column.id) &&
                            "z-20 bg-transparent!",
                          meta?.className,
                        )}
                      >
                        {header.column.getCanResize() && (
                          <ResizeHandle header={header} />
                        )}
                        {header.column.getCanSort() ? (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className={clsx(
                              "group/sort inline-flex cursor-[inherit] items-center gap-0.5 rounded-sm focus-visible:outline-2 focus-visible:outline-brand",
                              meta?.align === "right" && "flex-row-reverse",
                              meta?.revealHeaderOnHover &&
                                !sorted &&
                                !dragged?.ids.includes(header.column.id) &&
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
                  className="group/row cursor-pointer"
                  onClick={(event) => {
                    const target = event.target as HTMLElement;
                    if (target.closest("a, button, input, label")) return;
                    router.push(`/payments/${row.original.id}`);
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;
                    return (
                      <td
                        key={cell.id}
                        style={draggedStyle(cell.column.id)}
                        className={clsx(
                          "h-[37.38px] overflow-hidden border-b border-line-subtle px-1.5 whitespace-nowrap group-hover/row:bg-hover group-data-selected/row:bg-selected! first:rounded-l-md last:rounded-r-md",
                          ALIGN_CLASSES[meta?.align ?? "left"],
                          dragged?.ids.includes(cell.column.id) &&
                            "relative z-20 bg-transparent!",
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

function ResizeHandle({ header }: { header: Header<Payment, unknown> }) {
  const resize = header.getResizeHandler();
  return (
    <span
      aria-hidden
      data-resize-handle
      onMouseDown={resize}
      onTouchStart={resize}
      onDoubleClick={() => header.column.resetSize()}
      className={clsx(
        "absolute inset-y-2 -right-0.5 z-10 w-1 cursor-col-resize touch-none rounded-full select-none hover:bg-line",
        header.column.getIsResizing() && "bg-brand-solid hover:bg-brand-solid",
      )}
    />
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
