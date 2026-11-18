import {
  ArrowUturnLeftIcon,
  CheckIcon,
  ClockIcon,
  ExclamationCircleIcon,
  MinusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";

import {
  STATUS_LABELS,
  type Payment,
  type PaymentStatus,
} from "../../domain/payment";
import {
  getStatusDetails,
  type StatusDetails,
} from "../../domain/status-details";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const STATUS_APPEARANCE: Record<
  PaymentStatus,
  { variant: BadgeVariant; Icon: Icon; iconClassName: string }
> = {
  succeeded: {
    variant: "success",
    Icon: CheckIcon,
    iconClassName: "size-4 stroke-[2.6] text-success-icon",
  },
  pending: {
    variant: "neutral",
    Icon: ClockIcon,
    iconClassName: "size-3.5 stroke-2",
  },
  failed: {
    variant: "danger",
    Icon: XMarkIcon,
    iconClassName: "size-4 stroke-[2.6] text-danger-icon",
  },
  refunded: {
    variant: "neutral",
    Icon: ArrowUturnLeftIcon,
    iconClassName: "size-3.5 stroke-2",
  },
  canceled: {
    variant: "neutral",
    Icon: XMarkIcon,
    iconClassName: "size-4 stroke-[2.6] text-ink-muted",
  },
  blocked: {
    variant: "danger",
    Icon: MinusCircleIcon,
    iconClassName: "ml-0.5 size-3.5 stroke-2 text-danger-icon",
  },
  disputed: {
    variant: "warning",
    Icon: ExclamationCircleIcon,
    iconClassName: "size-3.5 stroke-2",
  },
  uncaptured: {
    variant: "neutral",
    Icon: ClockIcon,
    iconClassName: "size-3.5 stroke-2",
  },
};

export function StatusBadge({ payment }: { payment: Payment }) {
  const { variant, Icon, iconClassName } = STATUS_APPEARANCE[payment.status];
  const badge = (
    <Badge
      variant={variant}
      icon={<Icon className={iconClassName} aria-hidden />}
    >
      {STATUS_LABELS[payment.status]}
    </Badge>
  );

  const details = getStatusDetails(payment);
  if (!details) return badge;

  return (
    <Tooltip
      side="bottom"
      size="lg"
      content={<StatusDetailsText details={details} />}
    >
      <span
        tabIndex={0}
        className="inline-flex cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-brand"
      >
        {badge}
      </span>
    </Tooltip>
  );
}

function StatusDetailsText({ details }: { details: StatusDetails }) {
  return (
    <>
      {details.title && <p className="font-semibold">{details.title}</p>}
      <p>
        {details.body}
        {details.mentionsTimeline && (
          <>
            {" "}
            Find more details on the{" "}
            <span className="text-brand">payment timeline</span>.
          </>
        )}
        {details.learnMoreHref && (
          <>
            {" "}
            <a
              href={details.learnMoreHref}
              target="_blank"
              rel="noreferrer"
              className="text-brand hover:underline"
            >
              Learn more
            </a>
          </>
        )}
      </p>
    </>
  );
}
