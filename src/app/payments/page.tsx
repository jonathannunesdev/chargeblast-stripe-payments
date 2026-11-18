import type { Metadata } from "next";

import { PaymentsScreen } from "@/features/payments/components/payments-screen";

export const metadata: Metadata = {
  title: "Payments",
};

export default function PaymentsPage() {
  return (
    <main className="px-4 pb-10 lg:pr-[37px] lg:pl-[41px]">
      <PaymentsScreen />
    </main>
  );
}
