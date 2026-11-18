import type { CurrencyCode } from "../../domain/currency";
import { formatAmount, formatCurrencyCode } from "../../domain/format";

interface AmountCellProps {
  amount: number;
  currency: CurrencyCode;
}

export function AmountCell({ amount, currency }: AmountCellProps) {
  return (
    <span className="flex items-center justify-end gap-1">
      <span className="font-semibold">{formatAmount(amount, currency)}</span>
      <span className="w-8 text-ink-subdued">
        {formatCurrencyCode(currency)}
      </span>
    </span>
  );
}
