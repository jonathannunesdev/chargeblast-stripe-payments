"use client";

import { useCallback, useState } from "react";

import { EMPTY_FILTERS, type PaymentFilters } from "../domain/filters";

export function usePaymentFilters() {
  const [filters, setFilters] = useState<PaymentFilters>(EMPTY_FILTERS);

  const setFilter = useCallback(
    <K extends keyof PaymentFilters>(key: K, value: PaymentFilters[K]) => {
      setFilters((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  return { filters, setFilter, resetFilters };
}
