"use client";

import { useMemo } from "react";

import { TopBar } from "@/components/layout/top-bar";

import { DATASET_NOW } from "../data/payments-service";
import { hasActiveFilters } from "../domain/filter-summary";
import { filterPayments } from "../domain/filters";
import { usePaymentFilters } from "../hooks/use-payment-filters";
import { usePayments } from "../hooks/use-payments";
import { FilterBar } from "./filters/filter-bar";
import { NoticeBanner } from "./notice-banner";
import { PageHeader } from "./page-header";
import { PaymentsTable } from "./payments-table";
import { StatusTabs } from "./status-tabs";
import { TableSkeleton } from "./table-skeleton";

export function PaymentsScreen() {
  const state = usePayments();
  const { filters, setFilter, resetFilters } = usePaymentFilters();

  const payments = state.status === "ready" ? state.payments : null;
  const visiblePayments = useMemo(
    () => (payments ? filterPayments(payments, filters, DATASET_NOW) : []),
    [payments, filters],
  );

  return (
    <>
      <TopBar
        search={filters.query}
        onSearchChange={(query) => setFilter("query", query)}
      />
      <div className="mt-4 flex flex-col gap-4">
        <PageHeader />
        <NoticeBanner />
        <StatusTabs
          selected={filters.statuses}
          onSelect={(statuses) => setFilter("statuses", statuses)}
        />
        <FilterBar filters={filters} now={DATASET_NOW} onChange={setFilter} />
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
            now={state.now}
            hasActiveFilters={hasActiveFilters(filters)}
            onClearFilters={resetFilters}
          />
        )}
      </div>
    </>
  );
}
