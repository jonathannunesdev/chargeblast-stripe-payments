"use client";

import { format } from "date-fns";
import { useState, type FormEvent } from "react";

import { Select, TextInput } from "@/components/ui/fields";

import {
  DATE_PRESET_LABELS,
  DATE_PRESETS,
  type DatePreset,
  type DateRangeFilter,
} from "../../domain/filters";
import { ApplyButton } from "./apply-button";

type Option = DatePreset | "custom";

interface DateFilterProps {
  value: DateRangeFilter | null;
  now: number;
  onApply: (range: DateRangeFilter) => void;
}

export function DateFilter({ value, now, onApply }: DateFilterProps) {
  const [option, setOption] = useState<Option>(
    value?.type === "preset" ? value.preset : value ? "custom" : "today",
  );
  const [from, setFrom] = useState(
    value?.type === "custom" ? (value.from ?? "") : "",
  );
  const [to, setTo] = useState(
    value?.type === "custom" ? (value.to ?? "") : "",
  );

  const today = format(now, "yyyy-MM-dd");
  const customInvalid =
    option === "custom" && from !== "" && to !== "" && from > to;
  const customEmpty = option === "custom" && from === "" && to === "";

  function submit(event: FormEvent) {
    event.preventDefault();
    if (customInvalid || customEmpty) return;
    onApply(
      option === "custom"
        ? { type: "custom", from: from || null, to: to || null }
        : { type: "preset", preset: option },
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <Select
        aria-label="Date range"
        value={option}
        onChange={(event) => setOption(event.target.value as Option)}
        autoFocus
      >
        {DATE_PRESETS.map((preset) => (
          <option key={preset} value={preset}>
            {DATE_PRESET_LABELS[preset]}
          </option>
        ))}
        <option value="custom">Custom</option>
      </Select>
      {option === "custom" && (
        <div className="mt-2 flex items-center gap-2">
          <TextInput
            type="date"
            aria-label="Start date"
            max={to || today}
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            aria-invalid={customInvalid}
          />
          <span className="text-ink-subdued" aria-hidden>
            →
          </span>
          <TextInput
            type="date"
            aria-label="End date"
            min={from || undefined}
            max={today}
            value={to}
            onChange={(event) => setTo(event.target.value)}
            aria-invalid={customInvalid}
          />
        </div>
      )}
      {customInvalid && (
        <p role="alert" className="mt-2 text-xs text-danger-ink">
          The start date must be before the end date.
        </p>
      )}
      <ApplyButton disabled={customInvalid || customEmpty} />
    </form>
  );
}
