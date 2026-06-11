import { useState } from "react";
import { Field, SectionCard, ToggleRow } from "@/components/builder/display-homes/create/form-controls";
import { createDisplayHomeSteps, targetMarkets } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

export function ClassificationStep() {
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(["First home buyer", "Family"]);
  const [accessOptions, setAccessOptions] = useState({
    qrOnboarding: true,
    staffApproval: false,
    selectionSubmissions: true,
    anonymousBrowse: true,
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

  return (
    <StepShell step={createDisplayHomeSteps[1]}>
      <SectionCard title="Classification">
        <div className="create-home-form-grid two">
          <Field label="Storey type"><select defaultValue="Single storey"><option>Single storey</option><option>Double storey</option></select></Field>
          <Field label="Design style"><select defaultValue="Hamptons"><option>Hamptons</option><option>Contemporary</option><option>Scandinavian</option></select></Field>
        </div>
        <div className="create-home-check-group" aria-label="Target market">
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
        </div>
      </SectionCard>
      <SectionCard title="Access & lead capture">
        <ToggleRow checked={accessOptions.qrOnboarding} note="testing content" onToggle={() => toggleAccessOption("qrOnboarding")} title="Will this display home use QR onboarding?" />
        <ToggleRow checked={accessOptions.staffApproval} note="testing content" onToggle={() => toggleAccessOption("staffApproval")} title="Will staff manually approve leads?" />
        <ToggleRow checked={accessOptions.selectionSubmissions} note="testing content" onToggle={() => toggleAccessOption("selectionSubmissions")} title="Should customers be able to submit selections?" />
        <ToggleRow checked={accessOptions.anonymousBrowse} note="testing content" onToggle={() => toggleAccessOption("anonymousBrowse")} title="Should guests be able to browse anonymously?" />        
      </SectionCard>
    </StepShell>
  );
}
