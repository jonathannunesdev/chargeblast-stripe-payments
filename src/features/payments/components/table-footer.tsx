"use client";

import { CheckIcon } from "@heroicons/react/16/solid";
import * as RadixPopover from "@radix-ui/react-popover";
import type { Table } from "@tanstack/react-table";
import { clsx } from "clsx";
import { useState } from "react";

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
    <div className="sticky bottom-0 z-20 flex items-center justify-between bg-white pt-2 text-sm text-ink-body">
      <p aria-live="polite">
        {total === 0 ? (
          "0 results"
        ) : (
          <>
            Viewing{" "}
            <PageSizeMenu
              label={`${numberFormat.format(first)}–${numberFormat.format(last)}`}
              pageSize={pageSize}
              pageSizes={pageSizes}
              onChange={(size) => table.setPageSize(size)}
            />{" "}
            of{" "}
            <span className="font-semibold text-ink">
              {numberFormat.format(total)}
            </span>{" "}
            results
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        <Button
          className="text-[13px]"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <Button
          className="text-[13px]"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

interface PageSizeMenuProps {
  label: string;
  pageSize: number;
  pageSizes: readonly number[];
  onChange: (size: number) => void;
}

/** The visible range doubles as the rows-per-page control, keeping the footer copy intact. */
function PageSizeMenu({
  label,
  pageSize,
  pageSizes,
  onChange,
}: PageSizeMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen}>
      <RadixPopover.Trigger asChild>
        <button
          type="button"
          aria-label={`Rows per page: ${pageSize}`}
          className="cursor-pointer rounded-sm font-semibold text-ink decoration-ink-disabled decoration-dotted underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-brand"
        >
          {label}
        </button>
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          side="top"
          align="start"
          sideOffset={6}
          aria-label="Rows per page"
          className="z-50 w-40 rounded-lg bg-white p-1 text-sm text-ink shadow-[0_0_0_1px_rgba(64,68,82,0.08),0_3px_9px_rgba(64,68,82,0.12),0_10px_30px_rgba(0,0,0,0.1)] focus:outline-none"
        >
          <p className="px-2 pt-1 pb-1.5 text-xs font-semibold text-ink-subdued">
            Rows per page
          </p>
          <ul role="listbox" aria-label="Rows per page">
            {pageSizes.map((size) => {
              const selected = size === pageSize;
              return (
                <li key={size} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(size);
                      setOpen(false);
                    }}
                    className={clsx(
                      "flex h-8 w-full cursor-pointer items-center justify-between rounded-md px-2 text-left hover:bg-offset focus-visible:outline-2 focus-visible:outline-brand",
                      selected && "font-semibold",
                    )}
                  >
                    {size} rows
                    {selected && (
                      <CheckIcon className="size-4 text-brand" aria-hidden />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
