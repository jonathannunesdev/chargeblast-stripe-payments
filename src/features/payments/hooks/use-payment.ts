"use client";

import { useEffect, useState } from "react";

import { getPayment } from "../data/payments-service";
import type { Payment } from "../domain/payment";

type PaymentState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "not-found" }
  | { status: "ready"; payment: Payment };

/** Loads a single payment on the client, like the payments list. */
export function usePayment(id: string): PaymentState {
  const [state, setState] = useState<PaymentState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    getPayment(id)
      .then((payment) => {
        if (cancelled) return;
        setState(
          payment ? { status: "ready", payment } : { status: "not-found" },
        );
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}
