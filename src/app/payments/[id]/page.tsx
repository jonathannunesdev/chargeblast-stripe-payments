import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DetailsSkeleton,
  PaymentDetailsScreen,
} from "@/features/payments/components/details/payment-details-screen";

export const metadata: Metadata = {
  title: "Payment",
};

export default function PaymentPage() {
  return (
    <main className="pr-[37px] pb-10 pl-[41px]">
      {/* The payment ID comes from the URL, so this part renders on request. */}
      <Suspense fallback={<DetailsSkeleton />}>
        <PaymentDetailsScreen />
      </Suspense>
    </main>
  );
}
