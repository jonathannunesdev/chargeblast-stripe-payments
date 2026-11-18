"use client";

import {
  BellIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/16/solid";
import type { ComponentType, SVGProps } from "react";

interface TopBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const APP_TILES = [
  { label: "Analytics app", className: "bg-[#2c6ecb]" },
  { label: "Support app", className: "bg-[#0fb5ae]" },
  { label: "Notes app", className: "bg-[#1a1a1a]" },
];

function IconButton({
  label,
  icon: Icon,
}: {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-8 cursor-pointer place-content-center rounded-md text-ink-subdued hover:bg-offset hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}

export function TopBar({ search, onSearchChange }: TopBarProps) {
  return (
    <div className="flex h-15 items-center justify-between gap-6">
      <label className="relative block w-90 min-w-0">
        <span className="sr-only">
          Search payments by ID, email or last 4 digits
        </span>
        <MagnifyingGlassIcon
          className="pointer-events-none absolute top-1/2 left-3 size-3 -translate-y-1/2 text-ink-subdued"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search"
          className="h-9 w-full rounded-md bg-offset pr-3 pl-8 text-sm text-ink placeholder:text-ink-subdued focus:bg-white focus:shadow-[0_0_0_1px_var(--color-brand),0_0_0_4px_rgba(83,58,253,0.18)] focus:outline-none [&::-webkit-search-cancel-button]:cursor-pointer"
        />
      </label>
      <div className="flex shrink-0 items-center gap-4">
        <p className="text-xs text-ink">
          Test mode has moved.{" "}
          <a href="#" className="font-semibold underline underline-offset-2">
            Show me
          </a>
        </p>
        <div className="flex items-center gap-2">
          {APP_TILES.map((tile) => (
            <span
              key={tile.label}
              role="img"
              aria-label={tile.label}
              className={`size-4 rounded ${tile.className}`}
            />
          ))}
          <Squares2X2Icon
            className="size-4 text-ink-subdued"
            aria-label="Apps"
          />
        </div>
        <div className="flex items-center gap-1">
          <IconButton label="Help" icon={QuestionMarkCircleIcon} />
          <IconButton label="Notifications" icon={BellIcon} />
          <IconButton label="Settings" icon={Cog6ToothIcon} />
          <button
            type="button"
            aria-label="Create"
            className="ml-1 grid size-5 cursor-pointer place-content-center rounded-full bg-brand text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <PlusIcon className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
