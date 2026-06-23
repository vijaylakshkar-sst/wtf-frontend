"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon } from "@/components/icons";

export type ThemedMultiSelectOption = {
  label: string;
  value: string;
};

type ThemedMultiSelectProps = {
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  menuPlacement?: "down" | "up";
  onChange: (values: string[]) => void;
  options: ThemedMultiSelectOption[];
  placeholder: string;
  value: string[];
};

function getSelectedSummary(options: ThemedMultiSelectOption[], value: string[]) {
  const selectedOptions = options.filter((option) => value.includes(option.value));

  if (selectedOptions.length === 0) {
    return "";
  }

  if (selectedOptions.length <= 2) {
    return selectedOptions.map((option) => option.label).join(", ");
  }

  return `${selectedOptions[0]?.label}, ${selectedOptions[1]?.label}`;
}

export function ThemedMultiSelect({
  ariaLabel,
  className,
  disabled = false,
  menuPlacement = "down",
  onChange,
  options,
  placeholder,
  value,
}: ThemedMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const selectedSummary = useMemo(() => getSelectedSummary(options, value), [options, value]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function toggleValue(nextValue: string) {
    if (value.includes(nextValue)) {
      onChange(value.filter((current) => current !== nextValue));
      return;
    }

    onChange([...value, nextValue]);
  }

  const selectedCount = value.length;

  return (
    <div
      className={`themed-select-wrap${className ? ` ${className}` : ""}${menuPlacement === "up" ? " themed-select-up" : ""}`}
      data-open={isOpen}
      ref={wrapRef}
    >
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="themed-select-trigger themed-multi-select-trigger"
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className={selectedSummary ? "themed-multi-select-value" : "placeholder"}>
          {selectedSummary ? (
            <>
              <span>{selectedSummary}</span>
              {selectedCount > 2 ? <small>+{selectedCount - 2} more</small> : null}
            </>
          ) : (
            placeholder
          )}
        </span>
        {selectedCount > 0 ? <span className="themed-multi-select-count">{selectedCount}</span> : null}
        <i />
      </button>
      {isOpen ? (
        <div aria-multiselectable="true" className="themed-select-menu themed-multi-select-menu" role="listbox">
          {options.map((option) => {
            const selected = value.includes(option.value);

            return (
              <button
                aria-selected={selected}
                className={`themed-multi-select-option${selected ? " selected" : ""}`}
                key={option.value}
                onClick={() => toggleValue(option.value)}
                role="option"
                type="button"
              >
                <span>{option.label}</span>
                <span aria-hidden="true" className={`themed-multi-select-mark${selected ? " selected" : ""}`}>
                  {selected ? <CheckIcon size={11} /> : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
