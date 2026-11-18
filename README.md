# Chargeblast – Stripe Payments Screen

A rebuild of the Payments screen from the Stripe Dashboard (Transactions → Payments), built with Next.js and TypeScript.

- **Live:** https://chargeblast-stripe-payments-lemon.vercel.app
- **Reference:** the screenshot in the project brief

## Features

**Payments table**

- Columns: amount and currency, status badge, payment method (card brand, wallet and last 4 digits), description, customer, date, refunded date, decline reason and payment ID
- Payment ID is shortened and can be copied to the clipboard
- Date shows the relative time in a tooltip
- Sorting by date, amount and status
- Client-side pagination with 25, 50 or 100 rows per page (click the range in "Viewing 1–25 of …")
- Row selection for refundable (succeeded) payments
- Status tooltips with the reason behind each status, and row actions on hover (refund, send receipt, copy payment ID)
- Columns can be reordered by dragging their header and resized from the header edge (double-click to reset)

**Filters** (all combinable)

- Date and time: Today, Last 7 days, Last 30 days or a custom range
- Status and payment method (Card, ACH Direct Debit, Wallet), multi-select
- Amount range and currency
- Search by payment ID, customer email or last 4 digits, from the top bar
- Quick status filters (All, Succeeded, Refunded, Disputed, Failed, Uncaptured)

**Export:** CSV of the current view (every payment matching the filters, in the current sort order).

**Layout:** sidebar, top bar with account menu, loading and empty states.

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `npm run dev`       | Start the development server      |
| `npm run build`     | Production build                  |
| `npm run lint`      | Run ESLint                        |
| `npm run typecheck` | Run the TypeScript compiler       |
| `npm test`          | Run the test suite                |
| `npm run format`    | Format the codebase with Prettier |

## Tech stack

Next.js (App Router), TypeScript (strict), Tailwind CSS, TanStack Table, Radix UI primitives (popover, tooltip), date-fns, Vitest and Testing Library.

## Project structure

```
src/
├── app/                      # Routes, root layout and design tokens (globals.css)
├── components/
│   ├── icons/                # Payment method, navigation and UI icons
│   ├── layout/               # Sidebar, top bar, account menu
│   └── ui/                   # Badge, button, checkbox, popover, tooltip, fields
└── features/payments/
    ├── domain/               # Types, filtering, sorting and formatting (pure, tested)
    ├── data/                 # Mock data generator and service
    ├── hooks/                # Data loading and filter state
    └── components/           # Table, cells, filters, footer
```

Filtering, sorting and formatting live in plain functions under `domain/`, independent of React and of the table library. The UI only wires them together.

## Decisions

- **Mock data.** 500 payments served by an in-memory service. The 20 most recent rows mirror the reference screenshot (amounts, statuses, payment methods, customer emails, dates and decline reasons). The remaining 480 rows come from a seeded generator, so the data is the same on every load.
- **Fixed clock.** The reference shows dates on Aug 16, so the app treats Aug 16, 2026, 5:05 PM as "now". Date presets and relative times work against that date.
- **Amounts.** Stored in the currency's smallest unit, as in the Stripe API, with zero-decimal currencies (JPY) handled. The amount filter and sorting compare face values across currencies, without exchange rates.
- **Reference vs. brief.** The brief requires a payment ID column, status sorting and 25/50/100 rows per page, which the screenshot does not show. The payment ID column sits after Decline reason, the status header appears on hover, and the page size is chosen from the results range in the footer. This keeps the visible screen identical to the reference.
- **Hover details.** Status tooltips, row actions and column dragging follow the current Stripe Dashboard. Actions that need a backend (refund, send receipt, view customer, view payment details) are shown but not available in this demo.
- **Icons.** Most sidebar icons and the settings gear come from the [Stripe Dashboard Starter Kit](https://github.com/khoi-stripe/stripe-dash-starter) (MIT). The remaining navigation, button and top bar icons are redrawn from the reference at the size they are shown, matching its stroke weight and color. The Visa, Mastercard, Discover, Link and Apple Pay marks come from the [Stripe iOS SDK](https://github.com/stripe/stripe-ios) (MIT), placed on square tiles sized to the reference.

## Tests

Unit tests cover filtering, sorting, formatting, status details, column ordering, CSV export and the data generator. Integration tests render the full screen and cover filters, search, sorting, pagination, column reorder and resize, status tooltips, row actions, CSV export and the empty state.

```bash
npm test
```

## Disclaimer

This is a technical assessment. It is not affiliated with or endorsed by Stripe.
