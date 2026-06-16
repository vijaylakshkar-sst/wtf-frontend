import { useEffect, useMemo, useState } from "react";
import { Field, SectionCard, ToggleRow } from "@/components/builder/display-homes/create/form-controls";
import { createDisplayHomeSteps, targetMarkets } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

type ClassificationStepProps = {
  onValidityChange?: (isValid: boolean) => void;
  validationAttempt?: number;
};

export function ClassificationStep({ onValidityChange, validationAttempt = 0 }: ClassificationStepProps) {
  const [storeyType, setStoreyType] = useState("");
  const [designStyle, setDesignStyle] = useState("");
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [accessOptions, setAccessOptions] = useState({
    qrOnboarding: false,
    staffApproval: false,
    selectionSubmissions: false,
    anonymousBrowse: false,
  });

  const toggleMarket = (market: string) => {
    setSelectedMarkets((current) =>
      current.includes(market) ? current.filter((item) => item !== market) : [...current, market],
    );
  };

  const toggleAccessOption = (key: keyof typeof accessOptions) => {
    setAccessOptions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const shouldShowValidation = validationAttempt > 0;

  const validationErrors = useMemo(() => ({
    storeyType: storeyType ? "" : "Storey type is required.",
    designStyle: designStyle ? "" : "Design style is required.",
    targetMarket: selectedMarkets.length > 0 ? "" : "Select at least one target market.",
    access: Object.values(accessOptions).some(Boolean) ? "" : "Enable at least one lead and capture option.",
  }), [accessOptions, designStyle, selectedMarkets.length, storeyType]);

  const isValid = !Object.values(validationErrors).some(Boolean);

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <StepShell step={createDisplayHomeSteps[1]}>
      <SectionCard title="Classification">
        <div className="create-home-form-grid two">
          <Field className={shouldShowValidation && validationErrors.storeyType ? "invalid" : ""} label="Storey type">
            <select value={storeyType} onChange={(event) => setStoreyType(event.target.value)}>
              <option value="" disabled>Select storey type</option>
              <option value="Single storey">Single storey</option>
              <option value="Double storey">Double storey</option>
            </select>
            <p className="create-home-field-error" aria-hidden={!shouldShowValidation || !validationErrors.storeyType}>{shouldShowValidation ? validationErrors.storeyType || "\u00A0" : "\u00A0"}</p>
          </Field>
          <Field className={shouldShowValidation && validationErrors.designStyle ? "invalid" : ""} label="Design style">
            <select value={designStyle} onChange={(event) => setDesignStyle(event.target.value)}>
              <option value="" disabled>Select design style</option>
              <option value="Hamptons">Hamptons</option>
              <option value="Contemporary">Contemporary</option>
              <option value="Scandinavian">Scandinavian</option>
            </select>
            <p className="create-home-field-error" aria-hidden={!shouldShowValidation || !validationErrors.designStyle}>{shouldShowValidation ? validationErrors.designStyle || "\u00A0" : "\u00A0"}</p>
          </Field>
        </div>
        <div className={`create-home-check-group${shouldShowValidation && validationErrors.targetMarket ? " invalid" : ""}`} aria-label="Target market">
          <span>Target market</span>
          <div>
            {targetMarkets.map((market) => {
              const isChecked = selectedMarkets.includes(market);

              return (
                <div className={`create-home-radio-chip ${isChecked ? "checked" : ""}`} key={market}>
                  <button
                    aria-pressed={isChecked}
                    aria-label={market}
                    className="create-home-radio-control"
                    onClick={() => toggleMarket(market)}
                    type="button"
                  >
                    <span aria-hidden="true" />
                  </button>
                  <span className="create-home-radio-label">{market}</span>
                </div>
              );
            })}
          </div>
          <p className="create-home-field-error" aria-hidden={!shouldShowValidation || !validationErrors.targetMarket}>{shouldShowValidation ? validationErrors.targetMarket || "\u00A0" : "\u00A0"}</p>
        </div>
      </SectionCard>
      <SectionCard title="Access & lead capture">
        <ToggleRow checked={accessOptions.qrOnboarding} note="testing content" onToggle={() => toggleAccessOption("qrOnboarding")} title="Will this display home use QR onboarding?" />
        <ToggleRow checked={accessOptions.staffApproval} note="testing content" onToggle={() => toggleAccessOption("staffApproval")} title="Will staff manually approve leads?" />
        <ToggleRow checked={accessOptions.selectionSubmissions} note="testing content" onToggle={() => toggleAccessOption("selectionSubmissions")} title="Should customers be able to submit selections?" />
        <ToggleRow checked={accessOptions.anonymousBrowse} note="testing content" onToggle={() => toggleAccessOption("anonymousBrowse")} title="Should guests be able to browse anonymously?" />
        <p className="create-home-field-error" aria-hidden={!shouldShowValidation || !validationErrors.access}>{shouldShowValidation ? validationErrors.access || "\u00A0" : "\u00A0"}</p>
      </SectionCard>
    </StepShell>
  );
}
