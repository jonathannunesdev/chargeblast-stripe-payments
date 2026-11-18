"use client";

import type { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo, useState } from "react";

import { TopBar } from "@/components/layout/top-bar";
import { downloadFile } from "@/lib/download";

import { paymentsToCsv } from "../domain/csv";
import { DATASET_NOW } from "../data/payments-service";
import { hasActiveFilters } from "../domain/filter-summary";
import { filterPayments } from "../domain/filters";
import type { Payment } from "../domain/payment";
import { isPaymentSortKey, sortPayments } from "../domain/sorting";
import { usePaymentFilters } from "../hooks/use-payment-filters";
import { usePayments } from "../hooks/use-payments";
import { FilterBar } from "./filters/filter-bar";
import { NoticeBanner } from "./notice-banner";
import { PageHeader } from "./page-header";
import { DEFAULT_SORTING, PaymentsTable } from "./payments-table";
import { StatusTabs } from "./status-tabs";
import { TableSkeleton } from "./table-skeleton";

function exportPayments(
  payments: Payment[],
  sorting: SortingState,
  now: number,
) {
  const [current] = sorting;
  const rows =
    current && isPaymentSortKey(current.id)
      ? sortPayments(payments, { key: current.id, desc: current.desc })
      : payments;
  downloadFile(
    `payments-${format(now, "yyyy-MM-dd")}.csv`,
    paymentsToCsv(rows),
    "text/csv;charset=utf-8",
  );
}

export function PaymentsScreen() {
  const state = usePayments();
  const { filters, setFilter, resetFilters } = usePaymentFilters();
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);

  const now = DATASET_NOW;
  const payments = state.status === "ready" ? state.payments : null;
  const visiblePayments = useMemo(
    () => (payments ? filterPayments(payments, filters, now) : []),
    [payments, filters, now],
  );

  return (
    <>
      <TopBar
        search={filters.query}
        onSearchChange={(query) => setFilter("query", query)}
      />
      <div className="mt-5 flex flex-col">
        <PageHeader />
        <div className="mt-6">
          <NoticeBanner />
        </div>
        <div className="mt-4">
          <StatusTabs
            selected={filters.statuses}
            onSelect={(statuses) => setFilter("statuses", statuses)}
          />
        </div>
        <div className="mt-[19px] mb-3">
          <FilterBar
            filters={filters}
            now={now}
            onChange={setFilter}
            canExport={visiblePayments.length > 0}
            onExport={() => exportPayments(visiblePayments, sorting, now)}
          />
        </div>
        {state.status === "loading" && <TableSkeleton />}
        {state.status === "error" && (
          <p
            role="alert"
            className="py-10 text-center text-sm text-ink-subdued"
          >
            Payments could not be loaded. Refresh the page to try again.
          </p>
        )}
        {state.status === "ready" && (
          <PaymentsTable
            payments={visiblePayments}
            now={now}
            sorting={sorting}
            onSortingChange={setSorting}
            hasActiveFilters={hasActiveFilters(filters)}
            onClearFilters={resetFilters}
          />
        )}
      </div>
    </>
  );
}
