"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon, BoxIcon, ClockIcon, HomeIcon, ShieldIcon, UsersIcon } from "@/components/icons";

const Field = ({ label, placeholder, wide = false }: { label: string; placeholder: string; wide?: boolean }) => (
  <label className={wide ? "registration-field wide" : "registration-field"}>
    <span>{label}</span>
    <input placeholder={placeholder} />
  </label>
);

const SelectField = ({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) => (
  <label className={wide ? "registration-field wide" : "registration-field"}>
    <span>{label}</span>
    <select defaultValue=""><option value="" disabled>{children}</option><option>Yes</option><option>No</option></select>
  </label>
);

const FormSection = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="registration-section">
    <div className="registration-section-title"><span>{icon}</span><h2>{title}</h2><i /></div>
    <div className="registration-fields">{children}</div>
  </section>
);

export function BuilderRegistration() {
  const [step, setStep] = useState(1);

  return (
    <main className="registration-page">
      <header className="portal-header">
        <Link className="logo portal-logo" href="/" aria-label="WTF home">wtf?</Link>
        <div><span>Already have an account?</span><Link href="/sign-in">Sign in</Link></div>
      </header>
      <section className="registration-hero">
        <div className="registration-intro">
          <h1>Builder registration</h1>
          <p>Step {step} of 3 — {step === 1 ? "Company information" : step === 2 ? "Lead workflow & customer selection" : "Verification & approval"}</p>
          <div className="registration-steps">
            <button className={step === 1 ? "active" : "done"} onClick={() => setStep(1)}><b>{step > 1 ? "✓" : "1"}</b><span>Company info</span></button>
            <i />
            <button className={step === 2 ? "active" : step > 2 ? "done" : ""} onClick={() => setStep(2)}><b>{step > 2 ? "✓" : "2"}</b><span>Lead workflow</span></button>
            <i />
            <button className={step === 3 ? "active" : ""} onClick={() => step === 3 && setStep(3)}><b>3</b><span>Verification</span></button>
          </div>
        </div>
      </section>
      {step === 3 ? (
        <section className="registration-card verification-card">
          <div className="verification-heading">
            <div className="verification-shield"><ShieldIcon size={42} /></div>
            <h2>Application submitted</h2>
            <p>Our team will verify your details within <strong>1–2 business days.</strong></p>
          </div>
          <div className="verification-body">
            <h3>Admin verification checklist</h3>
            <div className="verification-list">
              <article><span className="status-icon success">✓</span><div><h4>Company details received</h4><p>Acme Homes Pty Ltd&nbsp; • &nbsp;ABN 12 345 678 901</p></div><b className="status success">Received</b></article>
              <article><span className="status-icon review"><ClockIcon size={18} /></span><div><h4>Builder licence check</h4><p>BL-00482901&nbsp; • &nbsp;VIC Building Authority</p></div><b className="status review">In review</b></article>
              <article><span className="status-icon review"><ClockIcon size={18} /></span><div><h4>Business details verified</h4><p>ABN Lookup&nbsp; • &nbsp;ASIC cross-reference</p></div><b className="status review">In review</b></article>
            </div>
            <div className="verification-next">
              <div><span className="info-icon">i</span><div><h4>What happens next?</h4><p>Our onboarding team reviews your information and verifies your credentials.</p></div></div>
              <ul><li>Email confirmation</li><li>Dashboard access</li><li>Display Home setup access</li><li>Lead management tools</li><li>Product selection portal</li></ul>
            </div>
          </div>
          <div className="verification-actions"><Link className="registration-back" href="/">← Back to homepage</Link><div><button disabled>Go to dashboard <ArrowIcon size={18} /></button><small>You will be able to access the dashboard<br />once your account is approved.</small></div></div>
        </section>
      ) : <form className="registration-card" onSubmit={(event) => event.preventDefault()}>
        {step === 1 ? (
          <>
            <FormSection icon={<HomeIcon />} title="Business details">
              <Field label="Company legal name" placeholder="Acme Constructions Pty Ltd" />
              <Field label="Trading name" placeholder="Acme Homes" />
              <Field label="ABN" placeholder="12 345 678 901" />
              <Field label="Builder licence number" placeholder="BL-XXXXXXXX" />
              <Field label="Years in operation" placeholder="12" />
              <Field label="Number of display homes" placeholder="4" />
              <Field label="Regions / suburbs serviced" placeholder="North Melbourne, Geelong, Ballarat..." wide />
              <Field label="Company website" placeholder="https://..." />
              <Field label="Social media" placeholder="Instagram, Facebook..." />
            </FormSection>
            <FormSection icon={<UsersIcon />} title="Primary contact">
              <Field label="Full name" placeholder="Jane Smith" />
              <Field label="Position / title" placeholder="Sales Director" />
              <Field label="Email" placeholder="jane@acmehomes.com.au" />
              <Field label="Mobile" placeholder="+61 4XX XXX XXX" />
              <SelectField label="Preferred contact method" wide>Email</SelectField>
            </FormSection>
            <FormSection icon={<BoxIcon />} title="Business structure">
              <SelectField label="Builder type">Volume builder</SelectField>
              <Field label="Homes built per year" placeholder="50" />
              <Field label="Sales consultants" placeholder="6" />
              <Field label="Colour consultants" placeholder="2" />
              <SelectField label="Internal marketing team?" wide>Yes</SelectField>
            </FormSection>
            <div className="registration-actions end"><button className="registration-primary" type="button" onClick={() => setStep(2)}>Continue to lead workflow <ArrowIcon size={18} /></button></div>
          </>
        ) : (
          <>
            <FormSection icon={<BoxIcon />} title="Customer selection process">
              <SelectField label="How are colour selections currently managed?" wide>Studio appointments</SelectField>
              <div className="registration-choice wide"><span>Clients receive</span><div><label><input defaultChecked type="checkbox" /> PDF selections</label><label><input type="checkbox" /> Physical folders</label><label><input defaultChecked type="checkbox" /> Studio appointments</label></div></div>
              <SelectField label="Export selections?">Yes — auto</SelectField>
              <Field label="Selections sent to" placeholder="selections@acme.com.au" />
            </FormSection>
            <FormSection icon={<UsersIcon />} title="Lead workflow">
              <Field label="New leads sent to" placeholder="sales@acmehomes.com.au" />
              <SelectField label="CRM integration">HubSpot</SelectField>
              <Field label="Qualification stages" placeholder="New → Contacted → Qualified → Appointed" wide />
              <div className="notification-box wide">
                <span>Notifications</span>
                {["New display home visits", "Saved products", "Selection submissions", "Repeat visits"].map((item, index) => <label key={item}>{item}<input defaultChecked={index < 2} type="checkbox" /></label>)}
              </div>
            </FormSection>
            <div className="registration-actions"><button className="registration-back" type="button" onClick={() => setStep(1)}>← Back</button><button className="registration-primary" type="button" onClick={() => setStep(3)}>Submit application <ArrowIcon size={18} /></button></div>
          </>
        )}
      </form>}
    </main>
  );
}
