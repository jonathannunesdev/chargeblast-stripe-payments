"use client";

import { useEffect, useState } from "react";

import { listPayments } from "../data/payments-service";
import type { Payment } from "../domain/payment";

type PaymentsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; payments: Payment[] };

/**
 * Loads payments on the client only, so dates are formatted in the viewer's
 * time zone without hydration mismatches.
 */
export function usePayments(): PaymentsState {
  const [state, setState] = useState<PaymentsState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    listPayments()
      .then((payments) => {
        if (!cancelled) setState({ status: "ready", payments });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
