import type { CurrencyCode } from "../domain/currency";
import type {
  CardBrand,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Wallet,
} from "../domain/payment";
import { createRandom, type Random } from "./random";

const DAY_MS = 24 * 60 * 60 * 1000;
const HISTORY_DAYS = 90;

const FIRST_NAMES = [
  "james",
  "maria",
  "lucas",
  "emma",
  "noah",
  "olivia",
  "liam",
  "sophia",
  "mateus",
  "ana",
  "ethan",
  "isabella",
  "daniel",
  "camila",
  "henry",
  "julia",
  "samuel",
  "grace",
  "gabriel",
  "chloe",
  "rafael",
  "nora",
  "oliver",
  "laura",
  "leo",
  "alice",
  "thomas",
  "beatriz",
  "jack",
  "mia",
  "pedro",
  "zoe",
];

const LAST_NAMES = [
  "smith",
  "silva",
  "johnson",
  "santos",
  "brown",
  "oliveira",
  "miller",
  "costa",
  "davis",
  "pereira",
  "wilson",
  "almeida",
  "taylor",
  "ribeiro",
  "anderson",
  "carvalho",
  "thomas",
  "martins",
  "moore",
  "rocha",
  "clark",
  "gomes",
  "walker",
  "barbosa",
  "hall",
  "lima",
];

const EMAIL_DOMAINS = {
  "gmail.com": 50,
  "yahoo.com": 10,
  "outlook.com": 10,
  "hotmail.com": 8,
  "icloud.com": 10,
  "hotmail.co.uk": 3,
  "proton.me": 4,
} as const;

const DESCRIPTIONS = {
  "Subscription update": 60,
  "Subscription creation": 25,
  "Payment for Invoice": 15,
} as const;

const DECLINE_REASONS = [
  "Insufficient funds",
  "Do not honor",
  "Transaction not allowed",
  "Generic decline",
  "Incorrect CVC",
  "Expired card",
];

const BANK_NAMES = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Citibank",
  "Capital One",
];

const STATUS_WEIGHTS: Record<PaymentStatus, number> = {
  succeeded: 58,
  failed: 14,
  pending: 6,
  refunded: 7,
  canceled: 5,
  blocked: 3,
  disputed: 3,
  uncaptured: 4,
};

const CURRENCY_WEIGHTS: Record<CurrencyCode, number> = {
  usd: 60,
  gbp: 10,
  eur: 10,
  brl: 8,
  cad: 5,
  aud: 4,
  jpy: 3,
};

const CARD_BRAND_WEIGHTS: Record<CardBrand, number> = {
  visa: 55,
  mastercard: 27,
  amex: 11,
  discover: 7,
};

const WALLET_WEIGHTS: Record<Wallet, number> = {
  link: 50,
  apple_pay: 35,
  google_pay: 15,
};

/** Common subscription price points, in minor units. */
const PRICE_POINTS = [
  407, 899, 988, 1099, 1199, 1318, 1538, 1599, 1999, 2093, 2198, 2499, 2999,
  3499, 4900, 4999, 9900, 9999, 18999, 24900,
];

const JPY_PRICE_POINTS = [500, 980, 1200, 1500, 2980, 4800, 9800];

function generateEmail(random: Random): string {
  const first = random.pick(FIRST_NAMES);
  const last = random.pick(LAST_NAMES);
  const separator = random.pick(["", ".", "_"]);
  const suffix = random.chance(0.6) ? String(random.int(1, 9999)) : "";
  return `${first}${separator}${last}${suffix}@${random.weighted(EMAIL_DOMAINS)}`;
}

function generateAmount(random: Random, currency: CurrencyCode): number {
  if (currency === "jpy") return random.pick(JPY_PRICE_POINTS);
  if (random.chance(0.8)) return random.pick(PRICE_POINTS);
  return random.int(300, 50000);
}

function generatePaymentMethod(
  random: Random,
  currency: CurrencyCode,
): PaymentMethod {
  if (currency === "usd" && random.chance(0.12)) {
    return {
      type: "us_bank_account",
      bankName: random.pick(BANK_NAMES),
      last4: random.digits(4),
    };
  }

  return {
    type: "card",
    brand: random.weighted(CARD_BRAND_WEIGHTS),
    last4: random.digits(4),
    wallet: random.chance(0.35) ? random.weighted(WALLET_WEIGHTS) : null,
  };
}

/** Skews timestamps towards the recent past, like a real payments feed. */
function generateCreated(random: Random, now: number): number {
  const offset = random.next() ** 1.6 * HISTORY_DAYS * DAY_MS;
  return Math.floor(now - offset);
}

interface GenerateOptions {
  count: number;
  seed: number;
  now: number;
}

export function generatePayments({
  count,
  seed,
  now,
}: GenerateOptions): Payment[] {
  const random = createRandom(seed);

  const payments = Array.from({ length: count }, (): Payment => {
    const currency = random.weighted(CURRENCY_WEIGHTS);
    const status = random.weighted(STATUS_WEIGHTS);
    const created = generateCreated(random, now);

    return {
      id: `pi_3${random.alphanumeric(23)}`,
      amount: generateAmount(random, currency),
      currency,
      status,
      paymentMethod: generatePaymentMethod(random, currency),
      description: random.weighted(DESCRIPTIONS),
      customerEmail: generateEmail(random),
      created,
      refundedAt:
        status === "refunded"
          ? Math.min(now, created + random.int(1, 72) * 60 * 60 * 1000)
          : null,
      declineReason: status === "failed" ? random.pick(DECLINE_REASONS) : null,
    };
  });

  return payments.sort((a, b) => b.created - a.created);
}
