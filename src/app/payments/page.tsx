import type { Metadata } from "next";

import { PaymentsScreen } from "@/features/payments/components/payments-screen";

export const metadata: Metadata = {
  title: "Payments",
};

export default function PaymentsPage() {
  return (
    <main className="pr-[37px] pb-10 pl-[41px]">
      <PaymentsScreen />
    </main>
  );
}
