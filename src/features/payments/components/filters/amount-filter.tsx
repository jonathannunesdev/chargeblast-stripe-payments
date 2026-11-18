"use client";

import { useState, type FormEvent } from "react";

import { TextInput } from "@/components/ui/fields";

import { isAmountRangeValid, type AmountRange } from "../../domain/filters";
import { ApplyButton } from "./apply-button";

function parseAmount(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function rangeError(range: AmountRange): string | null {
  if ((range.min ?? 0) < 0 || (range.max ?? 0) < 0) {
    return "Amounts can’t be negative.";
  }
  if (!isAmountRangeValid(range)) {
    return "The minimum must be less than or equal to the maximum.";
  }
  return null;
}

interface AmountFilterProps {
  value: AmountRange;
  onApply: (range: AmountRange) => void;
}

export function AmountFilter({ value, onApply }: AmountFilterProps) {
  const [min, setMin] = useState(value.min?.toString() ?? "");
  const [max, setMax] = useState(value.max?.toString() ?? "");

  const range: AmountRange = { min: parseAmount(min), max: parseAmount(max) };
  const error = rangeError(range);
  const valid = error === null;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (valid) onApply(range);
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex items-center gap-2">
        <TextInput
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          placeholder="Min"
          aria-label="Minimum amount"
          value={min}
          onChange={(event) => setMin(event.target.value)}
          aria-invalid={!valid}
          autoFocus
        />
        <span className="text-ink-subdued" aria-hidden>
          –
        </span>
        <TextInput
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          placeholder="Max"
          aria-label="Maximum amount"
          value={max}
          onChange={(event) => setMax(event.target.value)}
          aria-invalid={!valid}
        />
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-danger-ink">
          {error}
        </p>
      )}
      <p className="mt-2 text-xs text-ink-subdued">
        Compared in each payment&apos;s own currency.
      </p>
      <ApplyButton disabled={!valid} />
    </form>
  );
}
