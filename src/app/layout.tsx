import type { Metadata } from "next";

import { Sidebar } from "@/components/layout/sidebar";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Payments",
  description: "Stripe Dashboard payments screen rebuilt with Next.js.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full font-sans">
        <Providers>
          <div className="flex h-dvh">
            <Sidebar />
            <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
