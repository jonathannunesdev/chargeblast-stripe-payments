import type { ReactNode, SVGProps } from "react";

import type { CardBrand, Wallet } from "@/features/payments/domain/payment";

type IconProps = SVGProps<SVGSVGElement>;

function Tile({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={20}
      height={20}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

function Wordmark({ children, fill }: { children: string; fill: string }) {
  return (
    <text
      x="16"
      y="19.5"
      textAnchor="middle"
      fill={fill}
      fontSize="9.5"
      fontWeight="800"
      fontStyle="italic"
      fontFamily="Arial, Helvetica, sans-serif"
    >
      {children}
    </text>
  );
}

export function VisaIcon(props: IconProps) {
  return (
    <Tile {...props}>
      <rect width="32" height="32" rx="4" fill="#1a1f71" />
      <Wordmark fill="#ffffff">VISA</Wordmark>
    </Tile>
  );
}

export function MastercardIcon(props: IconProps) {
  return (
    <Tile {...props}>
      <rect width="32" height="32" rx="4" fill="#141414" />
      <circle cx="12.5" cy="16" r="6.5" fill="#eb001b" />
      <circle cx="19.5" cy="16" r="6.5" fill="#f79e1b" />
      <path
        d="M16 10.6a6.5 6.5 0 0 1 0 10.8 6.5 6.5 0 0 1 0-10.8Z"
        fill="#ff5f00"
      />
    </Tile>
  );
}

export function AmexIcon(props: IconProps) {
  return (
    <Tile {...props}>
      <rect width="32" height="32" rx="4" fill="#2e77bc" />
      <Wordmark fill="#ffffff">AMEX</Wordmark>
    </Tile>
  );
}

export function DiscoverIcon(props: IconProps) {
  return (
    <Tile {...props}>
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="3.5"
        fill="#ffffff"
        stroke="#d4dee9"
      />
      <circle cx="16" cy="16" r="6" fill="#f48120" />
    </Tile>
  );
}

export function UnknownCardIcon(props: IconProps) {
  return (
    <Tile {...props}>
      <path d="M5 14h22" stroke="#50617a" strokeWidth="2" />
      <path d="M5 18h22" stroke="#50617a" strokeWidth="2" />
    </Tile>
  );
}

export function LinkWalletIcon(props: IconProps) {
  return (
    <Tile {...props}>
      <rect width="32" height="32" rx="4" fill="#00d66f" />
      <path
        d="m12 9 8 7-8 7"
        fill="none"
        stroke="#011e0f"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    </Tile>
  );
}

export function ApplePayIcon(props: IconProps) {
  return (
    <Tile {...props}>
      <rect width="32" height="32" rx="4" fill="#000000" />
      <text
        x="16"
        y="19.5"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="10"
        fontWeight="600"
        fontFamily="-apple-system, system-ui, sans-serif"
      >
        Pay
      </text>
    </Tile>
  );
}

export function GooglePayIcon(props: IconProps) {
  return (
    <Tile {...props}>
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="3.5"
        fill="#ffffff"
        stroke="#d4dee9"
      />
      <text
        x="16"
        y="20.5"
        textAnchor="middle"
        fill="#4285f4"
        fontSize="13"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        G
      </text>
    </Tile>
  );
}

export function BankIcon(props: IconProps) {
  return (
    <Tile {...props}>
      <rect width="32" height="32" rx="4" fill="#ecf1f6" />
      <path
        d="M16 7.5 7.5 12v2h17v-2L16 7.5ZM9.5 15.5v6m4.3-6v6m4.4-6v6m4.3-6v6M7.5 23.5h17"
        fill="none"
        stroke="#50617a"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </Tile>
  );
}

export const CARD_BRAND_ICONS: Record<
  CardBrand,
  (props: IconProps) => ReactNode
> = {
  visa: VisaIcon,
  mastercard: MastercardIcon,
  amex: AmexIcon,
  discover: DiscoverIcon,
  unknown: UnknownCardIcon,
};

export const WALLET_ICONS: Record<Wallet, (props: IconProps) => ReactNode> = {
  link: LinkWalletIcon,
  apple_pay: ApplePayIcon,
  google_pay: GooglePayIcon,
};
