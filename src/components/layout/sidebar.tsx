"use client";

import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { clsx } from "clsx";
import { useEffect, type ComponentType, type SVGProps } from "react";

import {
  BalancesIcon,
  BillingIcon,
  ClockIcon,
  ConnectIcon,
  CustomersIcon,
  DevelopersIcon,
  HomeIcon,
  MoreIcon,
  PinIcon,
  ProductCatalogIcon,
  ReportingIcon,
  TransactionsIcon,
  WalletIcon,
} from "@/components/icons/nav-icons";

import { AccountMenu } from "./account-menu";
import { useSidebar } from "./sidebar-context";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

interface NavItem {
  label: string;
  icon: Icon;
  href?: string;
  expandable?: boolean;
}

const MAIN_ITEMS: NavItem[] = [
  { label: "Home", icon: HomeIcon },
  { label: "Balances", icon: BalancesIcon },
  { label: "Transactions", icon: TransactionsIcon, href: "/payments" },
  { label: "Customers", icon: CustomersIcon },
  { label: "Product catalog", icon: ProductCatalogIcon },
];

const SHORTCUT_ITEMS: NavItem[] = [
  { label: "Payments analytics", icon: PinIcon },
  { label: "Reports", icon: ClockIcon },
  { label: "Sigma", icon: ClockIcon },
  { label: "Radar", icon: ClockIcon },
];

const PRODUCT_ITEMS: NavItem[] = [
  { label: "Connect", icon: ConnectIcon, expandable: true },
  { label: "Payments", icon: WalletIcon, expandable: true },
  { label: "Billing", icon: BillingIcon, expandable: true },
  { label: "Reporting", icon: ReportingIcon, expandable: true },
  { label: "More", icon: MoreIcon, expandable: true },
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
          "flex h-[30.75px] items-center gap-2.5 rounded-md px-2 text-sm",
          "hover:bg-offset focus-visible:outline-2 focus-visible:outline-brand",
          active ? "font-semibold text-brand" : "font-[430] text-ink",
        )}
      >
        <Icon
          className={clsx("size-5", active ? "text-brand" : "text-ink-muted")}
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
    <div className={title ? "mt-[28.5px]" : undefined}>
      {title && (
        <p className="flex h-[26.5px] items-center px-1.5 text-xs text-ink-subdued">
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
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  return (
    <>
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}
      <aside
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) setOpen(false);
        }}
        className={clsx(
          "flex h-full w-[241px] shrink-0 flex-col border-r border-line-subtle bg-white",
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:transition-[transform,visibility] max-lg:duration-200 lg:relative",
          !open && "max-lg:invisible max-lg:-translate-x-full",
        )}
      >
        <span
          aria-hidden
          className="absolute top-[583.5px] -right-[10px] hidden h-3.5 w-0.5 rounded-full bg-[#b5c0cd] lg:block"
        />
        <div className="pt-2.5 pr-4 pl-2.5">
          <AccountMenu />
        </div>
        <nav
          aria-label="Main"
          className="mt-[33px] flex-1 overflow-y-auto pr-4 pl-2.5"
        >
          <NavSection items={MAIN_ITEMS} />
          <NavSection title="Shortcuts" items={SHORTCUT_ITEMS} />
          <NavSection title="Products" items={PRODUCT_ITEMS} />
        </nav>
        <div className="pr-4 pl-2.5">
          <a
            href="#"
            className="flex h-7.5 items-center gap-2.5 rounded-md px-2 text-sm font-[430] hover:bg-offset focus-visible:outline-2 focus-visible:outline-brand"
          >
            <DevelopersIcon className="size-5 text-ink-muted" />
            Developers
          </a>
        </div>
      </aside>
    </>
  );
}
