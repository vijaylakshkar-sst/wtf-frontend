import { Field, SectionCard, ToggleRow } from "@/components/builder/display-homes/create/form-controls";
import { createDisplayHomeSteps, targetMarkets } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

export function ClassificationStep() {
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
            {targetMarkets.map((market, index) => (
              <label key={market} className={index < 2 ? "checked" : ""}>
                <input defaultChecked={index < 2} type="checkbox" />
                <span aria-hidden="true" />
                {market}
              </label>
            ))}
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Access & lead capture">
        <ToggleRow checked title="Will this display home use QR onboarding?" />
        <ToggleRow title="Will staff manually approve leads?" />
        <ToggleRow checked title="Should customers be able to submit selections?" />
        <ToggleRow checked title="Should guests be able to browse anonymously?" />
        
      </SectionCard>
    </StepShell>
  );
}
