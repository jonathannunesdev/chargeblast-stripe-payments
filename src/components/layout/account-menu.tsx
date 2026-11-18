"use client";

import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from "@heroicons/react/16/solid";
import * as RadixPopover from "@radix-ui/react-popover";

const ACCOUNT_NAME = "cramly.ai";

const MENU_ITEMS = [
  { label: "Profile", icon: UserCircleIcon },
  { label: "Settings", icon: Cog6ToothIcon },
  { label: "Sign out", icon: ArrowRightStartOnRectangleIcon },
];

function AccountAvatar() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#d6c3fb" />
      <text
        x="12"
        y="13.6"
        textAnchor="middle"
        fill="#1f1c2e"
        fontSize="5.6"
        fontWeight="700"
        fontFamily="'Brush Script MT', 'Snell Roundhand', cursive"
      >
        Cramly
      </text>
    </svg>
  );
}

export function AccountMenu() {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>
        <button
          type="button"
          className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-md px-1.5 text-left text-sm font-semibold hover:bg-offset focus-visible:outline-2 focus-visible:outline-brand"
        >
          <AccountAvatar />
          <span className="flex-1 truncate">{ACCOUNT_NAME}</span>
          <ChevronDownIcon
            className="mr-1 size-3 text-ink-subdued"
            aria-hidden
          />
        </button>
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align="start"
          sideOffset={4}
          aria-label="Account menu"
          className="z-50 w-56 rounded-lg bg-white p-1 text-sm text-ink shadow-[0_0_0_1px_rgba(64,68,82,0.08),0_3px_9px_rgba(64,68,82,0.12),0_10px_30px_rgba(0,0,0,0.1)] focus:outline-none"
        >
          <div className="flex items-center gap-2 border-b border-line-subtle px-2 pt-1 pb-2">
            <AccountAvatar />
            <div className="min-w-0">
              <p className="truncate font-semibold">{ACCOUNT_NAME}</p>
              <p className="truncate text-xs text-ink-subdued">Test mode</p>
            </div>
          </div>
          <ul className="pt-1">
            {MENU_ITEMS.map(({ label, icon: Icon }) => (
              <li key={label}>
                <a
                  href="#"
                  className="flex h-8 items-center gap-2 rounded-md px-2 hover:bg-offset focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <Icon className="size-4 text-ink-subdued" aria-hidden />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
