import type { CurrencyCode } from "../../domain/currency";
import { formatAmount } from "../../domain/format";

interface AmountCellProps {
  amount: number;
  currency: CurrencyCode;
}

export function AmountCell({ amount, currency }: AmountCellProps) {
  return (
    <span className="font-semibold">{formatAmount(amount, currency)}</span>
  );
}
