import { Tooltip } from "@/components/ui/tooltip";

import { formatPaymentDate, formatRelativeTime } from "../../domain/format";

interface DateCellProps {
  timestamp: number;
  now: number;
}

export function DateCell({ timestamp, now }: DateCellProps) {
  const relative = formatRelativeTime(timestamp, now);

  return (
    <Tooltip content={relative}>
      <time
        dateTime={new Date(timestamp).toISOString()}
        tabIndex={0}
        aria-label={`${formatPaymentDate(timestamp, now)} (${relative})`}
        className="rounded-sm focus-visible:outline-2 focus-visible:outline-brand"
      >
        {formatPaymentDate(timestamp, now)}
      </time>
    </Tooltip>
  );
}
