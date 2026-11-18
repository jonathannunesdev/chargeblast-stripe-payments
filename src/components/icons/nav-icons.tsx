import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Navigation icons, drawn on a 20px grid to match the reference. */
function Outline({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
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
      <path d="M3.6 18.2h12.6a.75.75 0 0 0 .75-.75V7.8L9.9 3.2 2.85 7.8v9.65c0 .41.34.75.75.75Z" />
      <path d="M7.4 18.2v-6.8a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v6.8" />
    </Outline>
  );
}

export function BalancesIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M3.75 3.9h6.75M5.1 8.2h6.8M3.75 12.1H8M5.1 16.3h3.3" />
      <circle cx="14.3" cy="13.6" r="2.65" />
    </Outline>
  );
}

export function TransactionsIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M3 9.4a3.1 3.1 0 0 1 3.1-3.1h9.5M12.1 2.7l3.6 3.6-3.6 3.6" />
      <path d="M17 11.1a3.1 3.1 0 0 1-3.1 3.1H4.4M7.9 10.6l-3.6 3.6 3.6 3.6" />
    </Outline>
  );
}

export function CustomersIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="10" cy="5.6" r="3.3" />
      <path d="M2.95 17v-1.8a4.4 3.6 0 0 1 4.4-3.6h5.3a4.4 3.6 0 0 1 4.4 3.6V17Z" />
    </Outline>
  );
}

export function ProductCatalogIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M10 2.6 16.8 6.2v7.6L10 17.4l-6.8-3.6V6.2L10 2.6Z" />
      <path d="M3.2 6.2 10 9.8l6.8-3.6M10 9.8v7.6M6.6 4.4l6.8 3.6" />
    </Outline>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <g transform="rotate(45 10 10)" strokeWidth={1.4}>
        <path d="m6.3 9.6.9-5.9A1.9 1.9 0 0 1 9.1 2h1.8a1.9 1.9 0 0 1 1.9 1.7l.9 5.9" />
        <rect x="4.2" y="9.6" width="11.6" height="3" rx="1.5" />
        <path d="M10 12.6v7.4" />
      </g>
    </Outline>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="10" cy="10.3" r="6.3" />
      <path d="M10 7v5.4h2.2" />
    </Outline>
  );
}

export function ConnectIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M10 3.6 17.6 8.2 10 12.7 2.4 8.2 10 3.6Z" />
      <path d="m2.4 12.5 7.6 4.5 7.6-4.5" />
    </Outline>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <rect x="2.3" y="7.2" width="14.9" height="10" rx="1.5" />
      <path d="M2.3 8.7V6.2c0-.6.43-1.1 1.02-1.2l8.9-1.5a.8.8 0 0 1 .93.8v2.9" />
      <circle cx="13.6" cy="12.9" r=".55" fill="currentColor" />
    </Outline>
  );
}

export function BillingIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M4.9 16.05H3.1a.75.75 0 0 1-.75-.75V3.6a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 .75.75V10" />
      <path d="M5.5 6.1h1.6M5.5 9.3h5.1" />
      <path d="M7.6 17.6v-4.5H12M7.9 13.4l.7.7a4.5 4.5 0 0 0 8.1-3.1" />
    </Outline>
  );
}

export function ReportingIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path
        d="M3.4 3.6v12.9h13M6.8 9.3V13M11 6.2V13M14.8 3.9V13"
        strokeWidth={1.7}
      />
    </Outline>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="4.2" cy="10.1" r="1.3" />
      <circle cx="9.8" cy="10.1" r="1.3" />
      <circle cx="15.4" cy="10.1" r="1.3" />
    </svg>
  );
}

export function DevelopersIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <rect x="2.1" y="3.95" width="15.65" height="12.4" rx="1.8" />
      <path d="m5.6 7.2 3.6 2.8-3.6 2.8M10.2 13.1h4.4" />
    </Outline>
  );
}
