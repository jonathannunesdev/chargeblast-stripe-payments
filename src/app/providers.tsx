"use client";

import type { ReactNode } from "react";

import { SidebarProvider } from "@/components/layout/sidebar-context";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={300}>
      <SidebarProvider>{children}</SidebarProvider>
    </TooltipProvider>
  );
}
