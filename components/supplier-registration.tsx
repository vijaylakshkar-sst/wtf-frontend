"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon, BoxIcon, CheckIcon, MapPinIcon, PhoneIcon, ShieldIcon, UsersIcon } from "@/components/icons";

const Field = ({ label, placeholder, wide = false }: { label: string; placeholder: string; wide?: boolean }) => (
  <label className={wide ? "registration-field wide" : "registration-field"}>
    <span>{label}</span>
    <input placeholder={placeholder} />
  </label>
);

const SelectField = ({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) => (
  <label className={wide ? "registration-field wide" : "registration-field"}>
    <span>{label}</span>
    <select defaultValue="">
      <option value="" disabled>{children}</option>
      <option>Appliances</option>
      <option>Flooring</option>
      <option>Kitchen and bathroom</option>
      <option>Lighting</option>
      <option>Tiles and surfaces</option>
      <option>Other</option>
    </select>
  </label>
);

const FormSection = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="registration-section">
    <div className="registration-section-title"><span>{icon}</span><h2>{title}</h2><i /></div>
    <div className="registration-fields">{children}</div>
  </section>
);

const ContactRow = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="supplier-contact-card wide">
    <h3>{title}</h3>
    <div className="supplier-contact-row">{children}</div>
  </div>
);

export function SupplierRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <main className="registration-page">
      <header className="portal-header">
        <Link className="logo portal-logo" href="/" aria-label="WTF home">wtf?</Link>
        <div><span>Already have an account?</span><Link href="/sign-in">Sign in</Link></div>
      </header>
      <section className="registration-hero">
        <div className="registration-intro">
          <h1>Supplier registration</h1>
          <p>Step 1 of 2 - Supplier business information</p>
          <div className="registration-steps">
            <button className={isSubmitted ? "done" : "active"} onClick={() => setIsSubmitted(false)} type="button"><b>{isSubmitted ? <CheckIcon size={16} /> : "1"}</b><span>Business info</span></button>
            <i />
            <button className={isSubmitted ? "active" : ""} type="button"><b>2</b><span>Verification</span></button>
          </div>
        </div>
      </section>

      {isSubmitted ? (
        <section className="registration-card verification-card">
          <div className="verification-heading">
            <div className="verification-shield"><ShieldIcon size={42} /></div>
            <h2>Business information received</h2>
            <p>Your supplier profile is ready for approval review.</p>
          </div>
          <div className="verification-body">
            <h3>Next onboarding steps</h3>
            <div className="verification-list">
              <article><span className="status-icon success"><CheckIcon size={18} /></span><div><h4>Supplier details captured</h4><p>Business and contact information submitted.</p></div><b className="status success">Received</b></article>
              <article><span className="status-icon review"><ShieldIcon size={18} /></span><div><h4>Supplier verification</h4><p>Our team reviews business details before portal access.</p></div><b className="status review">Pending</b></article>
            </div>
          </div>
          <div className="verification-actions end"><div><button disabled>Go to dashboard <ArrowIcon size={18} /></button><small>Dashboard access will be enabled<br />after verification is approved.</small></div></div>
        </section>
      ) : (
        <form className="registration-card" onSubmit={(event) => { event.preventDefault(); setIsSubmitted(true); }}>
          <FormSection icon={<BoxIcon />} title="Business details">
            <Field label="Company name" placeholder="Acme Supplies Pty Ltd" />
            <Field label="Trading name" placeholder="Acme Surfaces" />
            <Field label="Business registration number" placeholder="ABN / ACN" />
            <Field label="Website" placeholder="https://..." />
            <SelectField label="Industry category">Select industry category</SelectField>
            <Field label="Showroom locations" placeholder="Melbourne, Geelong, Sydney..." wide />
            <Field label="Service areas" placeholder="VIC, NSW, QLD or specific suburbs..." wide />
          </FormSection>

          <FormSection icon={<UsersIcon />} title="Contact information">
            <ContactRow title="Primary contact">
              <Field label="Name" placeholder="Jane Smith" />
              <Field label="Email" placeholder="jane@company.com.au" />
              <Field label="Phone" placeholder="+61 4XX XXX XXX" />
            </ContactRow>
            <ContactRow title="Sales contact">
              <Field label="Name" placeholder="Alex Lee" />
              <Field label="Email" placeholder="sales@company.com.au" />
              <Field label="Phone" placeholder="+61 4XX XXX XXX" />
            </ContactRow>
            <ContactRow title="Marketing contact">
              <Field label="Name" placeholder="Sam Taylor" />
              <Field label="Email" placeholder="marketing@company.com.au" />
              <Field label="Phone" placeholder="+61 4XX XXX XXX" />
            </ContactRow>
            <ContactRow title="Product support contact">
              <Field label="Name" placeholder="Chris Morgan" />
              <Field label="Email" placeholder="support@company.com.au" />
              <Field label="Phone" placeholder="+61 4XX XXX XXX" />
            </ContactRow>
          </FormSection>

          <FormSection icon={<MapPinIcon />} title="Supplier coverage">
            <Field label="Primary warehouse / dispatch location" placeholder="Suburb, state" />
            <Field label="Customer support phone" placeholder="+61 4XX XXX XXX" />
            <Field label="General enquiries email" placeholder="hello@company.com.au" wide />
          </FormSection>

          <div className="registration-actions">
            <Link className="registration-back" href="/">Back to homepage</Link>
            <button className="registration-primary" type="submit"><PhoneIcon size={18} /> Submit supplier details <ArrowIcon size={18} /></button>
          </div>
        </form>
      )}
    </main>
  );
}
