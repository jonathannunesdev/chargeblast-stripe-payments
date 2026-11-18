import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Outline icons drawn for this project; rendered at 20px they keep a 1.5px stroke. */
function Outline({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M2.75 6.9 8 2.5l5.25 4.4v5.85a1 1 0 0 1-1 1H9.6v-3.5H6.4v3.5H3.75a1 1 0 0 1-1-1V6.9Z" />
    </Outline>
  );
}

export function BalancesIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M2.5 3.25h11M2.5 6.75h8M2.5 10.25h4.5M2.5 13.25h4.5" />
      <circle cx="11.5" cy="11.75" r="2" />
    </Outline>
  );
}

export function TransactionsIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M2.75 5.5h10.5M10.25 2.5l3 3-3 3M13.25 10.5H2.75M5.75 7.5l-3 3 3 3" />
    </Outline>
  );
}

export function CustomersIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="8" cy="5.25" r="2.75" />
      <path d="M2.75 13.75c.45-2.45 2.6-4 5.25-4s4.8 1.55 5.25 4" />
    </Outline>
  );
}

export function ProductCatalogIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M8 1.75 13.75 4.6v6.8L8 14.25 2.25 11.4V4.6L8 1.75Z" />
      <path d="M2.25 4.6 8 7.5l5.75-2.9M8 7.5v6.75M5.1 3.2l5.75 2.9" />
    </Outline>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M9.6 2.25 13.75 6.4l-1.6.55-2.6 2.6.2 2.45-1.05 1.05-5.75-5.75L4 6.25l2.45.2 2.6-2.6.55-1.6Z" />
      <path d="m5.25 10.75-3 3" />
    </Outline>
  );
}

export function HistoryIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M2.9 6.1A5.25 5.25 0 1 1 2.75 8" />
      <path d="M2.6 2.9v3.2h3.2M8 5.25V8l1.9 1.25" />
    </Outline>
  );
}

export function ConnectIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M8 2.25 14 5.5 8 8.75 2 5.5 8 2.25Z" />
      <path d="m2 9.25 6 3.25 6-3.25" />
    </Outline>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M2.25 5.25v7a1.5 1.5 0 0 0 1.5 1.5h8.5a1.5 1.5 0 0 0 1.5-1.5v-5a1.5 1.5 0 0 0-1.5-1.5H3.5a1.25 1.25 0 0 1 0-2.5h7.75" />
      <path d="M10.75 9.75h.5" strokeWidth={1.8} />
    </Outline>
  );
}

export function BillingIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M12.75 7.5V2.75a1 1 0 0 0-1-1h-7.5a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1H7.5" />
      <path d="M5.75 4.75h4.5M5.75 7.5h2.5M10 11.75a2 2 0 1 1 2 2h-1.5M11.25 12.5l-.75 1.25.75 1" />
    </Outline>
  );
}

export function ReportingIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M2.25 2.25v11.5h11.5M5.25 11V7.25M8 11V4M10.75 11V6.25M13.25 11V8.75" />
    </Outline>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M3.25 8h.01M8 8h.01M12.75 8h.01" strokeWidth={1.9} />
    </Outline>
  );
}

export function DevelopersIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.5" />
      <path d="m4.75 6.25 2 1.75-2 1.75M8.5 10h3" />
    </Outline>
  );
}

export function ExportIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M2.75 9.25v3a1 1 0 0 0 1 1h8.5a1 1 0 0 0 1-1v-3M6.5 9.5l6-6M8.75 3.25h4v4" />
    </Outline>
  );
}
