import {
  ArrowUturnLeftIcon,
  CheckIcon,
  ClockIcon,
  ExclamationCircleIcon,
  NoSymbolIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import type { ComponentType, SVGProps } from "react";

import { Badge, type BadgeVariant } from "@/components/ui/badge";

import { STATUS_LABELS, type PaymentStatus } from "../../domain/payment";

const STATUS_APPEARANCE: Record<
  PaymentStatus,
  { variant: BadgeVariant; Icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  succeeded: { variant: "success", Icon: CheckIcon },
  pending: { variant: "neutral", Icon: ClockIcon },
  failed: { variant: "danger", Icon: XMarkIcon },
  refunded: { variant: "neutral", Icon: ArrowUturnLeftIcon },
  canceled: { variant: "neutral", Icon: XMarkIcon },
  blocked: { variant: "danger", Icon: NoSymbolIcon },
  disputed: { variant: "warning", Icon: ExclamationCircleIcon },
  uncaptured: { variant: "neutral", Icon: ClockIcon },
};

export function StatusBadge({ status }: { status: PaymentStatus }) {
  const { variant, Icon } = STATUS_APPEARANCE[status];
  return (
    <Badge variant={variant} icon={<Icon className="size-3" aria-hidden />}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
