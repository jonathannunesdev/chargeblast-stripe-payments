export const CURRENCIES = [
  "usd",
  "eur",
  "gbp",
  "brl",
  "cad",
  "aud",
  "jpy",
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number];

const ZERO_DECIMAL_CURRENCIES: ReadonlySet<CurrencyCode> = new Set(["jpy"]);

export function getCurrencyDecimals(currency: CurrencyCode): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency) ? 0 : 2;
}

export function toMajorUnits(amount: number, currency: CurrencyCode): number {
  return amount / 10 ** getCurrencyDecimals(currency);
}
