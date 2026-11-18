/** Columns that stay at the edges of the table and cannot be dragged. */
const PINNED_START = new Set(["select"]);
const PINNED_END = new Set(["actions"]);

export function isPinnedColumn(id: string): boolean {
  return PINNED_START.has(id) || PINNED_END.has(id);
}

/** The currency code is shown as part of the amount, so it always follows it. */
const ATTACHED_TO: Record<string, string> = { currency: "amount" };

/** A column together with the columns attached to it, in table order. */
export function columnGroup(order: readonly string[], id: string): string[] {
  const anchor = ATTACHED_TO[id] ?? id;
  return order.filter(
    (columnId) => columnId === anchor || ATTACHED_TO[columnId] === anchor,
  );
}

function splitIntoGroups(order: readonly string[]): string[][] {
  const groups: string[][] = [];
  for (const id of order) {
    if (ATTACHED_TO[id] && groups.length > 0)
      groups[groups.length - 1]!.push(id);
    else groups.push([id]);
  }
  return groups;
}

interface DragPosition {
  order: string[];
  /** How far the dragged columns sit from their slot in the new order, in px. */
  offset: number;
}

/**
 * Reorders columns while one is dragged, like in the Stripe Dashboard: the
 * dragged column follows the pointer, and the others move aside as the pointer
 * passes their center. Positions are in px from the start of the table.
 */
export function reorderByPosition(
  order: readonly string[],
  widths: Readonly<Record<string, number>>,
  activeId: string,
  { pointer, left }: { pointer: number; left: number },
): DragPosition {
  const width = (ids: readonly string[]) =>
    ids.reduce((sum, id) => sum + (widths[id] ?? 0), 0);

  const moving = columnGroup(order, activeId);
  const groups = splitIntoGroups(order.filter((id) => !moving.includes(id)));

  const min = width(order.filter((id) => PINNED_START.has(id)));
  const max =
    width(order) -
    width(order.filter((id) => PINNED_END.has(id))) -
    width(moving);
  const clamped = Math.min(Math.max(left, min), max);

  let index = groups.findIndex((group) => PINNED_END.has(group[0]!));
  if (index === -1) index = groups.length;
  let x = 0;
  for (const [i, group] of groups.entries()) {
    const groupWidth = width(group);
    if (!PINNED_START.has(group[0]!) && pointer < x + groupWidth / 2) {
      index = Math.min(i, index);
      break;
    }
    x += groupWidth;
  }

  const next = [
    ...groups.slice(0, index),
    moving,
    ...groups.slice(index),
  ].flat();
  const slotLeft = width(next.slice(0, next.indexOf(moving[0]!)));
  return { order: next, offset: clamped - slotLeft };
}
