"use client";

import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import {
  BankIcon,
  CARD_BRAND_ICONS,
  WALLET_ICONS,
} from "@/components/icons/payment-icons";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { NOT_AVAILABLE_IN_DEMO } from "@/lib/demo";

import { getPaymentDetails } from "../../data/payment-details";
import { DATASET_NOW } from "../../data/payments-service";
import {
  formatAmount,
  formatCurrencyCode,
  formatPaymentDate,
} from "../../domain/format";
import type { Payment } from "../../domain/payment";
import { getPaymentTimeline } from "../../domain/payment-timeline";
import { usePayment } from "../../hooks/use-payment";
import { CopyableId } from "../cells/copyable-id";
import { PaymentMethodCell } from "../cells/payment-method-cell";
import { StatusBadge } from "../cells/status-badge";
import { ActivityTimeline } from "./activity-timeline";

export function PaymentDetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const state = usePayment(id);
  const [search, setSearch] = useState("");

  return (
    <>
      <TopBar
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={() =>
          router.push(`/payments?q=${encodeURIComponent(search)}`)
        }
      />
      <div className="mt-5">
        <Link
          href="/payments"
          className="text-sm font-semibold text-brand hover:underline"
        >
          Transactions
        </Link>
        {state.status === "loading" && <DetailsSkeleton />}
        {state.status === "error" && (
          <Message>
            The payment could not be loaded. Refresh the page to try again.
          </Message>
        )}
        {state.status === "not-found" && (
          <Message>
            No payment matches <span className="font-semibold">{id}</span>.
          </Message>
        )}
        {state.status === "ready" && <PaymentDetails payment={state.payment} />}
      </div>
    </>
  );
}

function PaymentDetails({ payment }: { payment: Payment }) {
  const details = getPaymentDetails(payment);
  const timeline = getPaymentTimeline(payment);
  const lastUpdated = timeline[0]!.timestamp;

  return (
    <>
      <header className="mt-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3">
            <span className="text-[28px] leading-9 font-bold text-ink-strong">
              {formatAmount(payment.amount, payment.currency)}{" "}
              <span className="font-normal text-ink-subdued">
                {formatCurrencyCode(payment.currency)}
              </span>
            </span>
            <StatusBadge payment={payment} />
          </h1>
          <p className="mt-1 text-sm text-ink-body">
            Charged to{" "}
            <Link
              href={`/payments?q=${encodeURIComponent(payment.customerEmail)}`}
              className="text-brand hover:underline"
            >
              {payment.customerEmail}
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {payment.status === "succeeded" && (
            <Button aria-disabled="true" title={NOT_AVAILABLE_IN_DEMO}>
              <ArrowUturnLeftIcon className="size-3.5 stroke-2" aria-hidden />
              Refund
            </Button>
          )}
          <Button
            aria-label="More actions"
            aria-disabled="true"
            title={NOT_AVAILABLE_IN_DEMO}
            className="w-7 justify-center px-0"
          >
            <EllipsisHorizontalIcon className="size-4" aria-hidden />
          </Button>
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <div className="min-w-0 flex-1 space-y-10">
          <Section title="Recent activity">
            <ActivityTimeline events={timeline} now={DATASET_NOW} />
          </Section>

          {details.fee !== null && (
            <Section title="Payment breakdown">
              <dl className="text-sm">
                <BreakdownRow label="Payment amount">
                  {formatAmount(payment.amount, payment.currency)}
                </BreakdownRow>
                <BreakdownRow label="Fees">
                  − {formatAmount(details.fee, payment.currency)}
                </BreakdownRow>
                {payment.status === "refunded" && (
                  <BreakdownRow label="Refunds">
                    − {formatAmount(payment.amount, payment.currency)}
                  </BreakdownRow>
                )}
                <BreakdownRow label="Net amount" strong>
                  {formatAmount(
                    payment.amount -
                      details.fee -
                      (payment.status === "refunded" ? payment.amount : 0),
                    payment.currency,
                  )}
                </BreakdownRow>
              </dl>
            </Section>
          )}

          <Section title="Payment method">
            <div className="flex items-center justify-between border-b border-line-subtle pb-3 text-sm">
              <PaymentMethodSummary payment={payment} />
              {details.cardExpiry && (
                <span className="text-ink-subdued">
                  Expires{" "}
                  {new Date(
                    details.cardExpiry.year,
                    details.cardExpiry.month - 1,
                  ).toLocaleString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </Section>
        </div>

        <aside className="space-y-10 lg:w-[240px] lg:shrink-0">
          <Section title="Details">
            <dl className="space-y-4 text-sm">
              <Field label="Payment ID">
                <CopyableId id={payment.id} full />
              </Field>
              <Field label="Payment method">
                <PaymentMethodCell method={payment.paymentMethod} />
              </Field>
              <Field label="Description">{payment.description}</Field>
              <Field label="Statement descriptor">
                {details.statementDescriptor}
              </Field>
              <Field label="Customer">
                <Link
                  href={`/payments?q=${encodeURIComponent(payment.customerEmail)}`}
                  className="break-all text-brand hover:underline"
                >
                  {payment.customerEmail}
                </Link>
              </Field>
              <Field label="Last updated">
                {formatPaymentDate(lastUpdated, DATASET_NOW)}
              </Field>
            </dl>
          </Section>

          <Section title="Metadata">
            {Object.keys(details.metadata).length > 0 ? (
              <dl className="space-y-4 text-sm">
                {Object.entries(details.metadata).map(([key, value]) => (
                  <Field key={key} label={key}>
                    {value}
                  </Field>
                ))}
              </dl>
            ) : (
              <p className="rounded-lg border border-dashed border-line py-6 text-center text-sm text-ink-subdued">
                No metadata
              </p>
            )}
          </Section>
        </aside>
      </div>
    </>
  );
}

function PaymentMethodSummary({ payment }: { payment: Payment }) {
  const method = payment.paymentMethod;
  if (method.type === "us_bank_account") {
    return (
      <span className="flex items-center gap-2">
        <BankIcon width={21} height={21} />
        {method.bankName}
        <span className="text-ink-muted">••••</span> {method.last4}
      </span>
    );
  }
  const BrandIcon = CARD_BRAND_ICONS[method.brand];
  const WalletIcon = method.wallet ? WALLET_ICONS[method.wallet] : null;
  return (
    <span className="flex items-center gap-1">
      {WalletIcon && <WalletIcon width={21} height={21} />}
      <BrandIcon width={21} height={21} />
      <span className="ml-1">
        <span className="text-ink-muted">••••</span> {method.last4}
      </span>
    </span>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-ink-strong">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-semibold text-ink">{label}</dt>
      <dd className="mt-1 text-ink-body">{children}</dd>
    </div>
  );
}

function BreakdownRow({
  label,
  strong = false,
  children,
}: {
  label: string;
  strong?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        strong
          ? "flex justify-between py-2 font-semibold text-ink"
          : "flex justify-between py-2 text-ink-body"
      }
    >
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Message({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="py-16 text-center text-sm text-ink-subdued">
      {children}
    </p>
  );
}

export function DetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading payment" className="mt-3 space-y-4">
      <div className="h-8 w-56 animate-pulse rounded bg-offset" />
      <div className="h-4 w-72 animate-pulse rounded bg-offset" />
      <div className="mt-8 h-40 animate-pulse rounded bg-offset" />
    </div>
  );
}
