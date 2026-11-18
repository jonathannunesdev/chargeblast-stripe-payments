/** Small seeded PRNG (mulberry32) so the mock data is the same on every load. */
export function createRandom(seed: number) {
  let state = seed >>> 0;

  function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function int(min: number, max: number): number {
    return min + Math.floor(next() * (max - min + 1));
  }

  function pick<T>(items: readonly T[]): T {
    const item = items[Math.floor(next() * items.length)];
    if (item === undefined) throw new Error("Cannot pick from an empty list");
    return item;
  }

  function weighted<T extends string>(weights: Readonly<Record<T, number>>): T {
    const entries = Object.entries(weights) as [T, number][];
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = next() * total;
    for (const [value, weight] of entries) {
      roll -= weight;
      if (roll < 0) return value;
    }
    return entries[entries.length - 1]![0];
  }

  function chance(probability: number): boolean {
    return next() < probability;
  }

  function digits(length: number): string {
    return Array.from({ length }, () => int(0, 9)).join("");
  }

  function alphanumeric(length: number): string {
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array.from({ length }, () => pick([...chars])).join("");
  }

  return { next, int, pick, weighted, chance, digits, alphanumeric };
}

export type Random = ReturnType<typeof createRandom>;
