"use client";

import { useEffect, useRef, useState } from "react";

export type ThemedSelectOption = {
  label: string;
  value: string;
};

type ThemedSelectProps = {
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  menuPlacement?: "down" | "up";
  onChange: (value: string) => void;
  options: ThemedSelectOption[];
  placeholder: string;
  value: string;
};

export function ThemedSelect({
  ariaLabel,
  className,
  disabled = false,
  menuPlacement = "down",
  onChange,
  options,
  placeholder,
  value,
}: ThemedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label || "";

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

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
        className="themed-select-trigger"
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className={value ? "" : "placeholder"}>{selectedLabel || placeholder}</span>
        <i />
      </button>
      {isOpen ? (
        <div className="themed-select-menu" role="listbox">
          {options.map((option) => (
            <button
              aria-selected={option.value === value}
              className={option.value === value ? "selected" : ""}
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              role="option"
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
