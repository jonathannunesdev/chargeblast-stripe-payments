"use client";

import { useState, type FormEvent } from "react";

import { Checkbox } from "@/components/ui/checkbox";

import { ApplyButton } from "./apply-button";

interface CheckboxListFilterProps<T extends string> {
  options: readonly { value: T; label: string }[];
  selected: T[];
  onApply: (values: T[]) => void;
}

export function CheckboxListFilter<T extends string>({
  options,
  selected,
  onApply,
}: CheckboxListFilterProps<T>) {
  const [draft, setDraft] = useState<T[]>(selected);

  function toggle(value: T) {
    setDraft((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onApply(options.map((o) => o.value).filter((v) => draft.includes(v)));
  }

  return (
    <form onSubmit={submit}>
      <fieldset className="flex flex-col gap-0.5">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex h-7 cursor-pointer items-center gap-2 rounded px-1 hover:bg-offset"
          >
            <Checkbox
              checked={draft.includes(option.value)}
              onChange={() => toggle(option.value)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
      <ApplyButton />
    </form>
  );
}
