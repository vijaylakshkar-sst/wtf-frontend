"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ClockIcon, PhoneIcon } from "@/components/icons";
import { Field, SectionCard } from "@/components/builder/display-homes/create/form-controls";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";

type DetailsStepProps = {
  onValidityChange?: (isValid: boolean) => void;
  validationAttempt?: number;
};

function formatTime(value: string) {
  if (!value) {
    return "";
  }
  const [hours = "0", minutes = "0"] = value.split(":");
  const hourNumber = Number(hours);
  const minuteNumber = Number(minutes);
  const period = hourNumber >= 12 ? "PM" : "AM";
  const displayHour = ((hourNumber + 11) % 12) + 1;
  return `${displayHour}:${String(minuteNumber).padStart(2, "0")} ${period}`;
}

function toMinutes(value: string) {
  if (!value) {
    return Number.NaN;
  }
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function getRangeError(start: string, end: string) {
  if (!start || !end) {
    return "Select both opening and closing times.";
  }

  return toMinutes(end) <= toMinutes(start) ? "Closing time must be later than opening time." : "";
}

function TimePickerTrigger({
  label,
  value,
  onChange,
  invalid = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [hours, minutes] = useMemo(() => value.split(":"), [value]);
  const normalizedHours = hours || "00";
  const normalizedMinutes = minutes || "00";
  const hourOptions = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
  const minuteOptions = ["00", "15", "30", "45"];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="create-home-time-picker" ref={rootRef}>
      <div className={`create-home-time-picker-trigger${invalid ? " is-invalid" : ""}`}>
        <input
          aria-expanded={isOpen}
          aria-label={`${label} time picker`}
          className={value ? "" : "is-placeholder"}
          onClick={() => setIsOpen((open) => !open)}
          readOnly
          value={value ? formatTime(value) : "Select time"}
        />
        <ClockIcon size={14} />
      </div>
      {isOpen ? (
        <div className="create-home-time-picker-popover" role="dialog">
          <div className="create-home-time-picker-grid">
            <label>
              <span>Hour</span>
              <select
                aria-label={`${label} hour`}
                onChange={(event) => onChange(`${event.target.value}:${normalizedMinutes}`)}
                value={normalizedHours}
              >
                {hourOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Minute</span>
              <select
                aria-label={`${label} minute`}
                onChange={(event) => onChange(`${normalizedHours}:${event.target.value}`)}
                value={normalizedMinutes}
              >
                {minuteOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function DetailsStep({ onValidityChange, validationAttempt = 0 }: DetailsStepProps) {
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [salesConsultant, setSalesConsultant] = useState("");
  const [monFri, setMonFri] = useState("09:00");
  const [monFriClose, setMonFriClose] = useState("18:00");
  const [saturday, setSaturday] = useState("09:00");
  const [saturdayClose, setSaturdayClose] = useState("18:00");
  const [sunday, setSunday] = useState("09:00");
  const [sundayClose, setSundayClose] = useState("18:00");

  const shouldShowValidation = validationAttempt > 0;

  const fieldErrors = useMemo(() => ({
    displayName: displayName.trim() ? "" : "Display home name is required.",
    phone: phone.trim() ? "" : "Phone number is required.",
    address: address.trim() ? "" : "Street address is required.",
    salesConsultant: salesConsultant ? "" : "Please select a sales consultant.",
  }), [address, displayName, phone, salesConsultant]);

  const rangeErrors = useMemo(() => ({
    monFri: getRangeError(monFri, monFriClose),
    saturday: getRangeError(saturday, saturdayClose),
    sunday: getRangeError(sunday, sundayClose),
  }), [monFri, monFriClose, saturday, saturdayClose, sunday, sundayClose]);

  const isValid = !Object.values(fieldErrors).some(Boolean) && !Object.values(rangeErrors).some(Boolean);

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <StepShell step={createDisplayHomeSteps[0]}>
      <SectionCard title="Home details">
        <div className="create-home-form-grid">
          <Field className={shouldShowValidation && fieldErrors.displayName ? "invalid" : ""} label="Display home name">
            <input placeholder="Enter display home name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
            <p className="create-home-field-error" aria-hidden={!shouldShowValidation || !fieldErrors.displayName}>{shouldShowValidation ? fieldErrors.displayName || "\u00A0" : "\u00A0"}</p>
          </Field>
          <Field className={shouldShowValidation && fieldErrors.phone ? "invalid" : ""} label="Phone">
            <span className="create-home-input-icon">
              <PhoneIcon size={14} />
              <input placeholder="+61 3 XXXX XXXX" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </span>
            <p className="create-home-field-error" aria-hidden={!shouldShowValidation || !fieldErrors.phone}>{shouldShowValidation ? fieldErrors.phone || "\u00A0" : "\u00A0"}</p>
          </Field>
          <Field className={`wide${shouldShowValidation && fieldErrors.address ? " invalid" : ""}`} label="Street address">
            <input placeholder="Enter street address" value={address} onChange={(event) => setAddress(event.target.value)} />
            <p className="create-home-field-error" aria-hidden={!shouldShowValidation || !fieldErrors.address}>{shouldShowValidation ? fieldErrors.address || "\u00A0" : "\u00A0"}</p>
          </Field>
          <div className="create-home-field wide">
            <span className="create-home-opening-hours-title">Opening hours</span>
            <div className="create-home-opening-hours">
              <div className={`create-home-opening-day${shouldShowValidation && rangeErrors.monFri ? " invalid" : ""}`}>
                <span className="create-home-opening-day-label">Mon - Fri</span>
                <div className="create-home-time-range">
                  <TimePickerTrigger invalid={shouldShowValidation && Boolean(rangeErrors.monFri)} label="Mon - Fri opening time" value={monFri} onChange={setMonFri} />
                  <span className="create-home-time-range-sep">to</span>
                  <TimePickerTrigger invalid={shouldShowValidation && Boolean(rangeErrors.monFri)} label="Mon - Fri closing time" value={monFriClose} onChange={setMonFriClose} />
                </div>
                <p className="create-home-field-error" aria-hidden={!shouldShowValidation || !rangeErrors.monFri}>{shouldShowValidation ? rangeErrors.monFri || "\u00A0" : "\u00A0"}</p>
              </div>
              <div className={`create-home-opening-day${shouldShowValidation && rangeErrors.saturday ? " invalid" : ""}`}>
                <span className="create-home-opening-day-label">Saturday</span>
                <div className="create-home-time-range">
                  <TimePickerTrigger invalid={shouldShowValidation && Boolean(rangeErrors.saturday)} label="Saturday opening time" value={saturday} onChange={setSaturday} />
                  <span className="create-home-time-range-sep">to</span>
                  <TimePickerTrigger invalid={shouldShowValidation && Boolean(rangeErrors.saturday)} label="Saturday closing time" value={saturdayClose} onChange={setSaturdayClose} />
                </div>
                <p className="create-home-field-error" aria-hidden={!shouldShowValidation || !rangeErrors.saturday}>{shouldShowValidation ? rangeErrors.saturday || "\u00A0" : "\u00A0"}</p>
              </div>
              <div className={`create-home-opening-day${shouldShowValidation && rangeErrors.sunday ? " invalid" : ""}`}>
                <span className="create-home-opening-day-label">Sunday</span>
                <div className="create-home-time-range">
                  <TimePickerTrigger invalid={shouldShowValidation && Boolean(rangeErrors.sunday)} label="Sunday opening time" value={sunday} onChange={setSunday} />
                  <span className="create-home-time-range-sep">to</span>
                  <TimePickerTrigger invalid={shouldShowValidation && Boolean(rangeErrors.sunday)} label="Sunday closing time" value={sundayClose} onChange={setSundayClose} />
                </div>
                <p className="create-home-field-error" aria-hidden={!shouldShowValidation || !rangeErrors.sunday}>{shouldShowValidation ? rangeErrors.sunday || "\u00A0" : "\u00A0"}</p>
              </div>
            </div>
          </div>
          <Field className={shouldShowValidation && fieldErrors.salesConsultant ? "invalid" : ""} label="Sales consultant">
            <select value={salesConsultant} onChange={(event) => setSalesConsultant(event.target.value)}>
              <option value="">Select sales consultant</option>
              <option value="Jane Smith">Jane Smith</option>
              <option value="Alex Warren">Alex Warren</option>
            </select>
            <p className="create-home-field-error" aria-hidden={!shouldShowValidation || !fieldErrors.salesConsultant}>{shouldShowValidation ? fieldErrors.salesConsultant || "\u00A0" : "\u00A0"}</p>
          </Field>
        </div>
        {/* <div className="create-home-upload-tiles">
          {homeUploads.map((upload) => {
            const Icon = upload.icon;
            return <button key={upload.label} type="button"><Icon size={26} /><strong>{upload.label}</strong><small>{upload.note}</small></button>;
          })}
        </div> */}
      </SectionCard>
    </StepShell>
  );
}
