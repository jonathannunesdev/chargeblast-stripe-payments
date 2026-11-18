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

import { STATUS_LABELS, type PaymentStatus } from "../../domain/payment";

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

export function StatusBadge({ status }: { status: PaymentStatus }) {
  const { variant, Icon, iconClassName } = STATUS_APPEARANCE[status];
  return (
    <Badge
      variant={variant}
      icon={<Icon className={iconClassName} aria-hidden />}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
