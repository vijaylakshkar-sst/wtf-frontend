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
        <ToggleRow checked note="Auto capture visitor name, email & mobile" title="QR onboarding at entry" />
        <ToggleRow note="Guests can explore without submitting details" title="Allow anonymous browsing" />
        <ToggleRow checked title="Allow selection submissions" />
        <div className="create-home-approval-row">
          <strong>Lead approval mode</strong>
          <select defaultValue="Manual"><option>Manual</option><option>Automatic</option></select>
        </div>
      </SectionCard>
    </StepShell>
  );
}
