import {
  ArrowsRightLeftIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  CommandLineIcon,
  CubeIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  HomeIcon,
  RocketLaunchIcon,
  Square3Stack3DIcon,
  UserIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { clsx } from "clsx";
import type { ComponentType, SVGProps } from "react";

import { AccountMenu } from "./account-menu";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

interface NavItem {
  label: string;
  icon: Icon;
  href?: string;
  expandable?: boolean;
}

const MAIN_ITEMS: NavItem[] = [
  { label: "Home", icon: HomeIcon },
  { label: "Balances", icon: BanknotesIcon },
  { label: "Transactions", icon: ArrowsRightLeftIcon, href: "/payments" },
  { label: "Customers", icon: UserIcon },
  { label: "Product catalog", icon: CubeIcon },
];

const SHORTCUT_ITEMS: NavItem[] = [
  { label: "Payments analytics", icon: RocketLaunchIcon },
  { label: "Reports", icon: ClockIcon },
  { label: "Sigma", icon: ClockIcon },
  { label: "Radar", icon: ClockIcon },
];

const PRODUCT_ITEMS: NavItem[] = [
  { label: "Connect", icon: Square3Stack3DIcon, expandable: true },
  { label: "Payments", icon: WalletIcon, expandable: true },
  { label: "Billing", icon: DocumentTextIcon, expandable: true },
  { label: "Reporting", icon: ChartBarIcon, expandable: true },
  { label: "More", icon: EllipsisHorizontalIcon, expandable: true },
];

const ACTIVE_HREF = "/payments";

function NavLink({ item }: { item: NavItem }) {
  const active = item.href === ACTIVE_HREF;
  const Icon = item.icon;

  return (
    <li>
      <a
        href={item.href ?? "#"}
        aria-current={active ? "page" : undefined}
        className={clsx(
          "flex h-7.5 items-center gap-3 rounded-md px-1 text-sm",
          "hover:bg-offset focus-visible:outline-2 focus-visible:outline-brand",
          active ? "font-semibold text-brand" : "text-ink",
        )}
      >
        <Icon
          className={clsx("size-4", active ? "text-brand" : "text-ink-subdued")}
          aria-hidden
        />
        <span className="flex-1 truncate">{item.label}</span>
        {item.expandable && (
          <ChevronDownIcon
            className="mr-1 size-3 text-ink-subdued"
            aria-hidden
          />
        )}
      </a>
    </li>
  );
}

function NavSection({ title, items }: { title?: string; items: NavItem[] }) {
  return (
    <div className={title ? "mt-7" : undefined}>
      {title && (
        <p className="flex h-6.5 items-center text-xs text-ink-subdued">
          {title}
        </p>
      )}
      <ul>
        {items.map((item) => (
          <NavLink key={item.label} item={item} />
        ))}
      </ul>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-line-subtle bg-white">
      <div className="px-5 pt-3">
        <AccountMenu />
      </div>
      <nav aria-label="Main" className="mt-5 flex-1 overflow-y-auto px-5">
        <NavSection items={MAIN_ITEMS} />
        <NavSection title="Shortcuts" items={SHORTCUT_ITEMS} />
        <NavSection title="Products" items={PRODUCT_ITEMS} />
      </nav>
      <div className="border-t border-line-subtle px-5 py-2">
        <a
          href="#"
          className="flex h-7.5 items-center gap-3 rounded-md px-1 text-sm hover:bg-offset focus-visible:outline-2 focus-visible:outline-brand"
        >
          <CommandLineIcon className="size-4 text-ink-subdued" aria-hidden />
          Developers
        </a>
      </div>
    </aside>
  );
}
