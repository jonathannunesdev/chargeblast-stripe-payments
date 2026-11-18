"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
  filtersFromSearchParams,
  filtersToSearchParams,
} from "../domain/filter-params";
import { EMPTY_FILTERS, type PaymentFilters } from "../domain/filters";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

const getSearch = () => window.location.search;
const getServerSearch = () => "";

function currentFilters(): PaymentFilters {
  return filtersFromSearchParams(new URLSearchParams(getSearch()));
}

function writeFilters(filters: PaymentFilters) {
  const query = filtersToSearchParams(filters).toString();
  const { pathname } = window.location;
  window.history.replaceState(
    window.history.state,
    "",
    query ? `${pathname}?${query}` : pathname,
  );
  for (const listener of listeners) listener();
}

/** Filter state lives in the URL, so the current view can be shared as a link. */
export function usePaymentFilters() {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const filters = useMemo(
    () => filtersFromSearchParams(new URLSearchParams(search)),
    [search],
  );

  const setFilter = useCallback(
    <K extends keyof PaymentFilters>(key: K, value: PaymentFilters[K]) => {
      writeFilters({ ...currentFilters(), [key]: value });
    },
    [],
  );

  const resetFilters = useCallback(() => writeFilters(EMPTY_FILTERS), []);

  return { filters, setFilter, resetFilters };
}
