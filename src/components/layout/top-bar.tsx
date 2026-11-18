"use client";

import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/16/solid";
import {
  BellIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import type { ComponentType, ReactNode, SVGProps } from "react";

interface TopBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const APP_TILES = [
  {
    label: "Data app",
    className: "bg-white text-[#111] ring-1 ring-line",
    glyph: "D",
  },
  { label: "Support app", className: "bg-[#3d9be9] text-white", glyph: "S" },
  { label: "Notes app", className: "bg-[#111] text-[#5ad37c]", glyph: "N" },
];

function IconButton({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative grid size-8 cursor-pointer place-content-center rounded-md hover:bg-offset hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
    >
      <Icon className="size-5 stroke-2 text-ink-body" aria-hidden />
      {children}
    </button>
  );
}

export function TopBar({ search, onSearchChange }: TopBarProps) {
  return (
    <div className="flex h-14 items-center justify-between gap-6">
      <label className="relative block w-[577px] min-w-0 shrink">
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
      <div className="flex shrink-0 items-center pr-2.5">
        <p className="text-sm text-ink-body">
          Test mode has moved.{" "}
          <a href="#" className="ml-2 underline underline-offset-2">
            Show me
          </a>
        </p>
        <div className="ml-6 flex h-9 items-center gap-3 rounded-full px-3.5 shadow-[inset_0_0_0_1px_var(--color-line-subtle)]">
          {APP_TILES.map((tile) => (
            <span
              key={tile.label}
              role="img"
              aria-label={tile.label}
              className={`grid size-[18px] place-content-center rounded text-[10px] font-bold ${tile.className}`}
            >
              {tile.glyph}
            </span>
          ))}
          <Squares2X2Icon
            className="size-5 stroke-2 text-ink-body"
            aria-label="Apps"
          />
        </div>
        <div className="ml-4 flex items-center gap-2">
          <IconButton label="Help" icon={QuestionMarkCircleIcon} />
          <IconButton label="Notifications" icon={BellIcon}>
            <span
              className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#0072e9] ring-2 ring-white"
              aria-hidden
            />
          </IconButton>
          <IconButton label="Settings" icon={Cog6ToothIcon} />
          <button
            type="button"
            aria-label="Create"
            className="ml-1 grid size-5 cursor-pointer place-content-center rounded-full bg-brand-solid text-white hover:bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <PlusIcon className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
