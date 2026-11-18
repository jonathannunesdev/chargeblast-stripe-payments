"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarState | null>(null);

/** On small screens the sidebar is a drawer opened from the top bar. */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarState {
  const state = useContext(SidebarContext);
  if (!state) throw new Error("useSidebar must be used within SidebarProvider");
  return state;
}
