import { ClockIcon, PhoneIcon } from "@/components/icons";
import { Field, SectionCard } from "@/components/builder/display-homes/create/form-controls";
import { homeUploads } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";

export function DetailsStep() {
  return (
    <StepShell step={createDisplayHomeSteps[0]}>
      <SectionCard title="Home details">
        <div className="create-home-form-grid">
          <Field label="Display home name"><input defaultValue="The Whitmore - Tarneit 42" /></Field>
          <Field label="Phone"><span className="create-home-input-icon"><PhoneIcon size={14} /><input defaultValue="+61 3 XXXX XXXX" /></span></Field>
          <Field className="wide" label="Street address"><input defaultValue="14 Harvest Drive, Tarneit VIC 3029" /></Field>
          <Field label="Mon - Fri"><span className="create-home-input-icon"><input defaultValue="10am - 5pm" /><ClockIcon size={14} /></span></Field>
          <Field label="Saturday"><span className="create-home-input-icon"><input defaultValue="10am - 4pm" /><ClockIcon size={14} /></span></Field>
          <Field label="Sunday"><span className="create-home-input-icon"><input defaultValue="11am - 3pm" /><ClockIcon size={14} /></span></Field>
          <Field label="Sales consultant"><select defaultValue="Jane Smith"><option>Jane Smith</option><option>Alex Warren</option></select></Field>
          <Field label="Colour consultant"><select defaultValue="Priya Nair"><option>Priya Nair</option><option>Olivia Tran</option></select></Field>
        </div>
        <div className="create-home-upload-tiles">
          {homeUploads.map((upload) => {
            const Icon = upload.icon;
            return <button key={upload.label} type="button"><Icon size={26} /><strong>{upload.label}</strong><small>{upload.note}</small></button>;
          })}
        </div>
      </SectionCard>
    </StepShell>
  );
}
