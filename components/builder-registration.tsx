"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon, BoxIcon, ClockIcon, HomeIcon, ShieldIcon, UsersIcon } from "@/components/icons";
import {
  buildersApi,
  getErrorMessage,
  validateBuilderRegistrationStepOne,
  validateBuilderRegistrationStepTwo,
  type BuilderRegistrationForm,
} from "@/lib/api";

type BuilderFieldName = keyof BuilderRegistrationForm;
type BuilderErrors = Partial<Record<BuilderFieldName | "form", string>>;

const initialBuilderForm: BuilderRegistrationForm = {
  companyName: "",
  tradingName: "",
  abn: "",
  licenseNumber: "",
  yearsInOperation: "",
  displayHomesCount: "",
  regionsServiced: "",
  website: "",
  socialMediaLinks: "",
  primaryContactName: "",
  primaryContactPosition: "",
  primaryContactEmail: "",
  primaryContactMobile: "",
  preferredContactMethod: "",
  builderType: "",
  homesBuiltPerYear: "",
  salesConsultantsCount: "",
  colourConsultantsCount: "",
  hasInternalMarketingTeam: "",
  colourSelectionManagement: "",
  clientReceives: ["PDF selections", "Studio appointments"],
  exportSelections: "",
  selectionsSentTo: "",
  newLeadsSentTo: "",
  password: "",
  confirmPassword: "",
};

const Field = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  wide = false,
  type = "text",
}: {
  label: string;
  name: BuilderFieldName;
  placeholder: string;
  value: string;
  onChange: (name: BuilderFieldName, value: string) => void;
  error?: string;
  wide?: boolean;
  type?: string;
}) => (
  <label className={wide ? "registration-field wide" : "registration-field"}>
    <span>{label}</span>
    <input
      aria-invalid={Boolean(error)}
      name={name}
      onChange={(event) => onChange(name, event.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
    <small className="registration-error">{error}</small>
  </label>
);

const SelectField = ({
  label,
  name,
  placeholder,
  options,
  value,
  onChange,
  error,
  wide = false,
}: {
  label: string;
  name: BuilderFieldName;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (name: BuilderFieldName, value: string) => void;
  error?: string;
  wide?: boolean;
}) => (
  <label className={wide ? "registration-field wide" : "registration-field"}>
    <span>{label}</span>
    <CustomSelect
      error={error}
      name={name}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      value={value}
    />
    <small className="registration-error">{error}</small>
  </label>
);

const CustomSelect = ({
  error,
  name,
  onChange,
  options,
  placeholder,
  value,
}: {
  error?: string;
  name: BuilderFieldName;
  onChange: (name: BuilderFieldName, value: string) => void;
  options: string[];
  placeholder: string;
  value: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="registration-select-wrap">
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="registration-select-trigger"
        data-invalid={Boolean(error)}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className={value ? "" : "placeholder"}>{value || placeholder}</span>
        <i />
      </button>
      {isOpen ? (
        <div className="registration-select-menu" role="listbox">
          {options.map((option) => (
            <button
              aria-selected={option === value}
              className={option === value ? "selected" : ""}
              key={option}
              onClick={() => {
                onChange(name, option);
                setIsOpen(false);
              }}
              role="option"
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const FormSection = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="registration-section">
    <div className="registration-section-title"><span>{icon}</span><h2>{title}</h2><i /></div>
    <div className="registration-fields">{children}</div>
  </section>
);

export function BuilderRegistration() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BuilderRegistrationForm>(initialBuilderForm);
  const [errors, setErrors] = useState<BuilderErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (name: BuilderFieldName, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
  };

  const updateClientReceives = (option: string, checked: boolean) => {
    setForm((current) => ({
      ...current,
      clientReceives: checked
        ? Array.from(new Set([...current.clientReceives, option]))
        : current.clientReceives.filter((item) => item !== option),
    }));
    setErrors((current) => ({ ...current, clientReceives: undefined, form: undefined }));
  };

  const continueToLeadWorkflow = () => {
    const validationErrors = validateBuilderRegistrationStepOne(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  const submitRegistration = async () => {
    const validationErrors = validateBuilderRegistrationStepTwo(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await buildersApi.register(form);
      setStep(3);
    } catch (error) {
      setErrors({ form: getErrorMessage(error, "Builder registration failed. Please try again.") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="registration-page">
      <header className="portal-header">
        <Link className="logo portal-logo" href="/" aria-label="WTF home">wtf?</Link>
        <div><span>Already have an account?</span><Link href="/sign-in">Sign in</Link></div>
      </header>
      <section className="registration-hero">
        <div className="registration-intro">
          <h1>Builder registration</h1>
          <p>Step {step} of 3 - {step === 1 ? "Company information" : step === 2 ? "Lead workflow & customer selection" : "Verification & approval"}</p>
          <div className="registration-steps">
            <button className={step === 1 ? "active" : "done"} disabled type="button"><b>{step > 1 ? "✓" : "1"}</b><span>Company info</span></button>
            <i />
            <button className={step === 2 ? "active" : step > 2 ? "done" : ""} disabled type="button"><b>{step > 2 ? "✓" : "2"}</b><span>Lead workflow</span></button>
            <i />
            <button className={step === 3 ? "active" : ""} disabled type="button"><b>3</b><span>Verification</span></button>
          </div>
        </div>
      </section>
      {step === 3 ? (
        <section className="registration-card verification-card">
          <div className="verification-heading">
            <div className="verification-shield"><ShieldIcon size={42} /></div>
            <h2>Application submitted</h2>
            <p>Our team will verify your details within <strong>1-2 business days.</strong></p>
          </div>
          <div className="verification-body">
            <h3>Admin verification checklist</h3>
            <div className="verification-list">
              <article><span className="status-icon success">✓</span><div><h4>Company details received</h4><p>{form.companyName} &nbsp; ABN {form.abn}</p></div><b className="status success">Received</b></article>
              <article><span className="status-icon review"><ClockIcon size={18} /></span><div><h4>Builder licence check</h4><p>{form.licenseNumber}</p></div><b className="status review">In review</b></article>
              <article><span className="status-icon success">✓</span><div><h4>Business details verified</h4><p>ABN Lookup and business record review</p></div><b className="status success">Received</b></article>
            </div>
            <div className="verification-next">
              <div><span className="info-icon">i</span><div><h4>What happens next?</h4><p>Our onboarding team reviews your information and verifies your credentials.</p></div></div>
              <ul><li>Email confirmation</li><li>Dashboard access</li><li>Display Home setup access</li><li>Lead management tools</li><li>Product selection portal</li></ul>
            </div>
          </div>
          <div className="verification-actions"><Link className="registration-back" href="/">← Back to homepage</Link><div><button disabled>Go to dashboard <ArrowIcon size={18} /></button><small>You will be able to access the dashboard<br />once your account is approved.</small></div></div>
        </section>
      ) : (
        <form className="registration-card" onSubmit={(event) => event.preventDefault()}>
          {errors.form ? <p className="registration-form-error">{errors.form}</p> : null}
          {step === 1 ? (
            <>
              <FormSection icon={<HomeIcon />} title="Business details">
                <Field label="Company legal name" name="companyName" placeholder="Acme Constructions Pty Ltd" value={form.companyName} onChange={updateField} error={errors.companyName} />
                <Field label="Trading name" name="tradingName" placeholder="Acme Homes" value={form.tradingName} onChange={updateField} error={errors.tradingName} />
                <Field label="ABN" name="abn" placeholder="12 345 678 901" value={form.abn} onChange={updateField} error={errors.abn} />
                <Field label="Builder licence number" name="licenseNumber" placeholder="BL-XXXXXXXX" value={form.licenseNumber} onChange={updateField} error={errors.licenseNumber} />
                <Field label="Years in operation" name="yearsInOperation" placeholder="12" value={form.yearsInOperation} onChange={updateField} error={errors.yearsInOperation} />
                <Field label="Number of display homes" name="displayHomesCount" placeholder="4" value={form.displayHomesCount} onChange={updateField} error={errors.displayHomesCount} />
                <Field label="Regions / suburbs serviced" name="regionsServiced" placeholder="North Melbourne, Geelong, Ballarat..." value={form.regionsServiced} onChange={updateField} error={errors.regionsServiced} wide />
                <Field label="Company website" name="website" placeholder="https://..." value={form.website} onChange={updateField} error={errors.website} />
                <Field label="Social media" name="socialMediaLinks" placeholder="Instagram, Facebook..." value={form.socialMediaLinks} onChange={updateField} error={errors.socialMediaLinks} />
              </FormSection>
              <FormSection icon={<UsersIcon />} title="Primary contact">
                <Field label="Full name" name="primaryContactName" placeholder="Jane Smith" value={form.primaryContactName} onChange={updateField} error={errors.primaryContactName} />
                <Field label="Position / title" name="primaryContactPosition" placeholder="Sales Director" value={form.primaryContactPosition} onChange={updateField} error={errors.primaryContactPosition} />
                <Field label="Email" name="primaryContactEmail" placeholder="jane@acmehomes.com.au" value={form.primaryContactEmail} onChange={updateField} error={errors.primaryContactEmail} />
                <Field label="Mobile" name="primaryContactMobile" placeholder="+61 4XX XXX XXX" value={form.primaryContactMobile} onChange={updateField} error={errors.primaryContactMobile} />
                <SelectField label="Preferred contact method" name="preferredContactMethod" placeholder="Select preferred contact method" options={["Email", "Mobile", "Phone"]} value={form.preferredContactMethod} onChange={updateField} error={errors.preferredContactMethod} wide />
              </FormSection>
              <FormSection icon={<BoxIcon />} title="Business structure">
                <SelectField label="Builder type" name="builderType" placeholder="Select builder type" options={["Volume builder", "Custom builder", "Knockdown rebuild", "Renovation builder"]} value={form.builderType} onChange={updateField} error={errors.builderType} />
                <Field label="Homes built per year" name="homesBuiltPerYear" placeholder="50" value={form.homesBuiltPerYear} onChange={updateField} error={errors.homesBuiltPerYear} />
                <Field label="Sales consultants" name="salesConsultantsCount" placeholder="6" value={form.salesConsultantsCount} onChange={updateField} error={errors.salesConsultantsCount} />
                <Field label="Colour consultants" name="colourConsultantsCount" placeholder="2" value={form.colourConsultantsCount} onChange={updateField} error={errors.colourConsultantsCount} />
                <SelectField label="Internal marketing team?" name="hasInternalMarketingTeam" placeholder="Select an option" options={["Yes", "No"]} value={form.hasInternalMarketingTeam} onChange={updateField} error={errors.hasInternalMarketingTeam} wide />
              </FormSection>
              <FormSection icon={<ShieldIcon />} title="Account security">
                <Field label="Password" name="password" placeholder="Minimum 8 characters" value={form.password} onChange={updateField} error={errors.password} type="password" />
                <Field label="Confirm password" name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={updateField} error={errors.confirmPassword} type="password" />
              </FormSection>
              <div className="registration-actions end"><button className="registration-primary" type="button" onClick={continueToLeadWorkflow}>Continue to lead workflow <ArrowIcon size={18} /></button></div>
            </>
          ) : (
            <>
              <FormSection icon={<BoxIcon />} title="Customer selection process">
                <SelectField label="How are colour selections currently managed?" name="colourSelectionManagement" placeholder="Select current workflow" options={["Studio appointments", "Online forms", "Manual spreadsheets", "Mixed workflow"]} value={form.colourSelectionManagement} onChange={updateField} error={errors.colourSelectionManagement} wide />
                <div className="registration-choice wide"><span>Clients receive</span><div>{["PDF selections", "Physical folders", "Studio appointments"].map((option) => <label key={option}><input checked={form.clientReceives.includes(option)} onChange={(event) => updateClientReceives(option, event.target.checked)} type="checkbox" /> {option}</label>)}</div><small className="registration-error">{errors.clientReceives}</small></div>
                <SelectField label="Export selections?" name="exportSelections" placeholder="Select export option" options={["Yes - auto", "Yes - manual", "No"]} value={form.exportSelections} onChange={updateField} error={errors.exportSelections} />
                <Field label="Selections sent to" name="selectionsSentTo" placeholder="selections@acme.com.au" value={form.selectionsSentTo} onChange={updateField} error={errors.selectionsSentTo} />
              </FormSection>
              <FormSection icon={<UsersIcon />} title="Lead workflow">
                <Field label="New leads sent to" name="newLeadsSentTo" placeholder="sales@acmehomes.com.au" value={form.newLeadsSentTo} onChange={updateField} error={errors.newLeadsSentTo} />
              </FormSection>
              <div className="registration-actions"><button className="registration-back" type="button" disabled>← Back</button><button className="registration-primary" disabled={isSubmitting} type="button" onClick={submitRegistration}>{isSubmitting ? "Submitting..." : "Submit application"} <ArrowIcon size={18} /></button></div>
            </>
          )}
        </form>
      )}
    </main>
  );
}

