import { clsx } from "clsx";

import { formatPaymentDate } from "../../domain/format";
import type { PaymentEvent } from "../../domain/payment-timeline";

interface ActivityTimelineProps {
  events: PaymentEvent[];
  now: number;
}

export function ActivityTimeline({ events, now }: ActivityTimelineProps) {
  return (
    <ol>
      {events.map((event, index) => (
        <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
          {index < events.length - 1 && (
            <span
              aria-hidden
              className="absolute top-3.5 bottom-0 left-[4.5px] w-px bg-line"
            />
          )}
          <span
            aria-hidden
            className={clsx(
              "relative mt-1 size-2.5 shrink-0 rounded-full",
              event.current
                ? "bg-brand-solid ring-3 ring-brand-solid/20"
                : "border border-ink-disabled bg-white",
            )}
          />
          <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">{event.title}</p>
              {event.detail && (
                <p className="mt-0.5 text-sm text-ink-subdued">
                  {event.detail}
                </p>
              )}
            </div>
            <time
              dateTime={new Date(event.timestamp).toISOString()}
              className="shrink-0 text-sm text-ink-subdued underline decoration-dotted underline-offset-4"
            >
              {formatPaymentDate(event.timestamp, now)}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}
