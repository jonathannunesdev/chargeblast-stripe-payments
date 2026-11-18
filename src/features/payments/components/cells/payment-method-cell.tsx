import {
  BankIcon,
  CARD_BRAND_ICONS,
  WALLET_ICONS,
} from "@/components/icons/payment-icons";

import type { PaymentMethod } from "../../domain/payment";

const BRAND_NAMES = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  unknown: "Card",
} as const;

const WALLET_NAMES = {
  link: "Link",
  apple_pay: "Apple Pay",
  google_pay: "Google Pay",
} as const;

function describe(method: PaymentMethod): string {
  if (method.type === "us_bank_account") {
    return `${method.bankName} account ending in ${method.last4}`;
  }
  const brand = BRAND_NAMES[method.brand];
  const wallet = method.wallet ? `${WALLET_NAMES[method.wallet]}, ` : "";
  return `${wallet}${brand} ending in ${method.last4}`;
}

export function PaymentMethodCell({ method }: { method: PaymentMethod }) {
  const WalletIcon =
    method.type === "card" && method.wallet
      ? WALLET_ICONS[method.wallet]
      : null;
  const MethodIcon =
    method.type === "card" ? CARD_BRAND_ICONS[method.brand] : BankIcon;

  return (
    <span className="flex items-center" title={describe(method)}>
      {/* The wallet slot is always reserved so card icons line up across rows. */}
      <span className="flex w-[21px] shrink-0">
        {WalletIcon && <WalletIcon width={21} height={21} />}
      </span>
      <span className="ml-1 flex shrink-0">
        <MethodIcon width={21} height={21} />
      </span>
      <span className="ml-2 text-ink-body">
        <span className="text-ink-muted" aria-hidden>
          ••••{" "}
        </span>
        <span className="sr-only">{describe(method)}</span>
        <span aria-hidden>{method.last4}</span>
      </span>
    </span>
  );
}
