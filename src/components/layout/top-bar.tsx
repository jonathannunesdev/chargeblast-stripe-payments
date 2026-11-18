"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import type { ReactNode } from "react";

import {
  AppLogoArrow,
  AppLogoGeo,
  AppLogoLd,
  AppsAddIcon,
  CreateIcon,
  HelpIcon,
} from "@/components/icons/top-bar-icons";
import { GearIcon } from "@/components/icons/ui-icons";
import { Tooltip } from "@/components/ui/tooltip";

import { useSidebar } from "./sidebar-context";

interface TopBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  /** Called on Enter; pages without a list use it to open the search results. */
  onSearchSubmit?: () => void;
}

const APPS = [
  { label: "LD app", Logo: AppLogoLd },
  { label: "Geo app", Logo: AppLogoGeo },
  { label: "Arrow app", Logo: AppLogoArrow },
];

function IconButton({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tooltip content={label} side="bottom">
      <button
        type="button"
        aria-label={label}
        className={clsx(
          "relative grid size-8 cursor-pointer place-content-center rounded-md text-icon hover:bg-offset hover:text-ink focus-visible:outline-2 focus-visible:outline-brand",
          className,
        )}
      >
        {children}
      </button>
    </Tooltip>
  );
}

export function TopBar({
  search,
  onSearchChange,
  onSearchSubmit,
}: TopBarProps) {
  const { setOpen } = useSidebar();

  return (
    <div className="flex h-14 items-center justify-between gap-3 lg:gap-6">
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="-ml-1.5 grid size-8 shrink-0 cursor-pointer place-content-center rounded-md text-icon hover:bg-offset focus-visible:outline-2 focus-visible:outline-brand lg:hidden"
      >
        <Bars3Icon className="size-5 stroke-2" aria-hidden />
      </button>
      <form
        role="search"
        className="min-w-0 flex-1 lg:w-[577px] lg:flex-initial"
        onSubmit={(event) => {
          event.preventDefault();
          onSearchSubmit?.();
        }}
      >
        <label className="relative block">
          <span className="sr-only">
            Search payments by ID, email or last 4 digits
          </span>
          <MagnifyingGlassIcon
            className="pointer-events-none absolute top-1/2 left-3 size-[13px] -translate-y-1/2 text-ink-subdued"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search"
            className="h-[36.5px] w-full rounded-md bg-offset pr-3 pl-8 text-sm text-ink placeholder:text-ink-subdued focus:bg-white focus:shadow-[0_0_0_1px_var(--color-brand),0_0_0_4px_rgba(83,58,253,0.18)] focus:outline-none [&::-webkit-search-cancel-button]:cursor-pointer"
          />
        </label>
      </form>
      <div className="flex shrink-0 items-center pr-[3px]">
        <p className="hidden text-sm whitespace-nowrap text-ink-body xl:block">
          Test mode has moved.{" "}
          <a href="#" className="ml-2 underline underline-offset-2">
            Show me
          </a>
        </p>
        <div className="ml-6 hidden h-9 items-center gap-[16.75px] rounded-full px-2.5 shadow-[inset_0_0_0_1px_var(--color-line-subtle)] lg:flex">
          {APPS.map(({ label, Logo }) => (
            <span key={label} role="img" aria-label={label}>
              <Logo className="size-4" />
            </span>
          ))}
          <span role="img" aria-label="Apps" className="-mx-0.5 text-icon">
            <AppsAddIcon className="size-5" />
          </span>
        </div>
        <div className="ml-[17.5px] flex items-center gap-[9px]">
          <IconButton label="Help" className="max-sm:hidden">
            <HelpIcon className="size-5" />
          </IconButton>
          <IconButton label="Notifications">
            <BellIcon className="size-5 stroke-2" aria-hidden />
            <span
              className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#0072e9] ring-2 ring-white"
              aria-hidden
            />
          </IconButton>
          <IconButton label="Settings" className="max-sm:hidden">
            <GearIcon className="size-4" />
          </IconButton>
          <Tooltip content="Create" side="bottom">
            <button
              type="button"
              aria-label="Create"
              className="ml-2 grid size-5 cursor-pointer place-content-center rounded-full bg-brand-solid text-white hover:bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <CreateIcon className="size-5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
