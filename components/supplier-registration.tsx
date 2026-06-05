"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowIcon, BoxIcon, CheckIcon, MapPinIcon, PhoneIcon, ShieldIcon, UsersIcon } from "@/components/icons";
import {
  getErrorMessage,
  suppliersApi,
  validateSupplierRegistration,
  type SupplierIndustryCategory,
  type SupplierRegistrationForm,
} from "@/lib/api";

type SupplierFieldName = keyof SupplierRegistrationForm;
type SupplierErrors = Partial<Record<SupplierFieldName | "form", string>>;

const initialSupplierForm: SupplierRegistrationForm = {
  companyName: "",
  tradingName: "",
  businessIdentifier: "",
  website: "",
  industryCategory: "",
  showroomLocations: "",
  serviceAreas: "",
  primaryContactName: "",
  primaryContactEmail: "",
  primaryContactPhone: "",
  salesContactName: "",
  salesContactEmail: "",
  salesContactPhone: "",
  marketingContactName: "",
  marketingContactEmail: "",
  marketingContactPhone: "",
  productSupportContactName: "",
  productSupportContactEmail: "",
  productSupportContactPhone: "",
  primaryWarehouseLocation: "",
  customerSupportPhone: "",
  generalEnquiriesEmail: "",
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
  name: SupplierFieldName;
  placeholder: string;
  value: string;
  onChange: (name: SupplierFieldName, value: string) => void;
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
  name: SupplierFieldName;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (name: SupplierFieldName, value: string) => void;
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
  name: SupplierFieldName;
  onChange: (name: SupplierFieldName, value: string) => void;
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

const ContactRow = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="supplier-contact-card wide">
    <h3>{title}</h3>
    <div className="supplier-contact-row">{children}</div>
  </div>
);

export function SupplierRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState<SupplierRegistrationForm>(initialSupplierForm);
  const [errors, setErrors] = useState<SupplierErrors>({});
  const [industryCategories, setIndustryCategories] = useState<SupplierIndustryCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadIndustryCategories = async () => {
      try {
        const response = await suppliersApi.listIndustryCategories();
        if (isActive) {
          setIndustryCategories(Array.isArray(response.data.categories) ? response.data.categories : []);
        }
      } catch (error) {
        if (isActive) {
          setErrors((current) => ({
            ...current,
            form: getErrorMessage(error, "Industry categories could not be loaded. Please refresh and try again."),
          }));
        }
      } finally {
        if (isActive) {
          setIsLoadingCategories(false);
        }
      }
    };

    void loadIndustryCategories();

    return () => {
      isActive = false;
    };
  }, []);

  const updateField = (name: SupplierFieldName, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
  };

  const submitRegistration = async () => {
    const validationErrors = validateSupplierRegistration(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await suppliersApi.register(form);
      setIsSubmitted(true);
    } catch (error) {
      setErrors({ form: getErrorMessage(error, "Supplier registration failed. Please try again.") });
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
          <h1>Supplier registration</h1>
          <p>Step {isSubmitted ? "2" : "1"} of 2 - {isSubmitted ? "Verification" : "Supplier business information"}</p>
          <div className="registration-steps">
            <button className={isSubmitted ? "done" : "active"} disabled type="button"><b>{isSubmitted ? <CheckIcon size={16} /> : "1"}</b><span>Business info</span></button>
            <i />
            <button className={isSubmitted ? "active" : ""} disabled type="button"><b>2</b><span>Verification</span></button>
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
              <article><span className="status-icon success"><CheckIcon size={18} /></span><div><h4>Supplier details captured</h4><p>{form.companyName} business and contact information submitted.</p></div><b className="status success">Received</b></article>
              <article><span className="status-icon review"><ShieldIcon size={18} /></span><div><h4>Supplier verification</h4><p>Our team reviews business details before portal access.</p></div><b className="status review">Pending</b></article>
            </div>
          </div>
          <div className="verification-actions end"><div><button disabled>Go to dashboard <ArrowIcon size={18} /></button><small>Dashboard access will be enabled<br />after verification is approved.</small></div></div>
        </section>
      ) : (
        <form className="registration-card" onSubmit={(event) => { event.preventDefault(); void submitRegistration(); }}>
          {errors.form ? <p className="registration-form-error">{errors.form}</p> : null}
          <FormSection icon={<BoxIcon />} title="Business details">
            <Field label="Company name" name="companyName" placeholder="Acme Supplies Pty Ltd" value={form.companyName} onChange={updateField} error={errors.companyName} />
            <Field label="Trading name" name="tradingName" placeholder="Acme Surfaces" value={form.tradingName} onChange={updateField} error={errors.tradingName} />
            <Field label="Business registration number" name="businessIdentifier" placeholder="ABN / ACN" value={form.businessIdentifier} onChange={updateField} error={errors.businessIdentifier} />
            <Field label="Website" name="website" placeholder="https://..." value={form.website} onChange={updateField} error={errors.website} />
            <SelectField label="Industry category" name="industryCategory" placeholder={isLoadingCategories ? "Loading categories..." : "Select industry category"} options={industryCategories.map((category) => category.name)} value={form.industryCategory} onChange={updateField} error={errors.industryCategory} />
            <Field label="Showroom locations" name="showroomLocations" placeholder="Melbourne, Geelong, Sydney..." value={form.showroomLocations} onChange={updateField} error={errors.showroomLocations} wide />
            <Field label="Service areas" name="serviceAreas" placeholder="VIC, NSW, QLD or specific suburbs..." value={form.serviceAreas} onChange={updateField} error={errors.serviceAreas} wide />
          </FormSection>

          <FormSection icon={<UsersIcon />} title="Contact information">
            <ContactRow title="Primary contact">
              <Field label="Name" name="primaryContactName" placeholder="Jane Smith" value={form.primaryContactName} onChange={updateField} error={errors.primaryContactName} />
              <Field label="Email" name="primaryContactEmail" placeholder="jane@company.com.au" value={form.primaryContactEmail} onChange={updateField} error={errors.primaryContactEmail} />
              <Field label="Phone" name="primaryContactPhone" placeholder="+61 4XX XXX XXX" value={form.primaryContactPhone} onChange={updateField} error={errors.primaryContactPhone} />
            </ContactRow>
            <ContactRow title="Sales contact">
              <Field label="Name" name="salesContactName" placeholder="Alex Lee" value={form.salesContactName} onChange={updateField} error={errors.salesContactName} />
              <Field label="Email" name="salesContactEmail" placeholder="sales@company.com.au" value={form.salesContactEmail} onChange={updateField} error={errors.salesContactEmail} />
              <Field label="Phone" name="salesContactPhone" placeholder="+61 4XX XXX XXX" value={form.salesContactPhone} onChange={updateField} error={errors.salesContactPhone} />
            </ContactRow>
            <ContactRow title="Marketing contact">
              <Field label="Name" name="marketingContactName" placeholder="Sam Taylor" value={form.marketingContactName} onChange={updateField} error={errors.marketingContactName} />
              <Field label="Email" name="marketingContactEmail" placeholder="marketing@company.com.au" value={form.marketingContactEmail} onChange={updateField} error={errors.marketingContactEmail} />
              <Field label="Phone" name="marketingContactPhone" placeholder="+61 4XX XXX XXX" value={form.marketingContactPhone} onChange={updateField} error={errors.marketingContactPhone} />
            </ContactRow>
            <ContactRow title="Product support contact">
              <Field label="Name" name="productSupportContactName" placeholder="Chris Morgan" value={form.productSupportContactName} onChange={updateField} error={errors.productSupportContactName} />
              <Field label="Email" name="productSupportContactEmail" placeholder="support@company.com.au" value={form.productSupportContactEmail} onChange={updateField} error={errors.productSupportContactEmail} />
              <Field label="Phone" name="productSupportContactPhone" placeholder="+61 4XX XXX XXX" value={form.productSupportContactPhone} onChange={updateField} error={errors.productSupportContactPhone} />
            </ContactRow>
          </FormSection>

          <FormSection icon={<MapPinIcon />} title="Supplier coverage">
            <Field label="Primary warehouse / dispatch location" name="primaryWarehouseLocation" placeholder="Suburb, state" value={form.primaryWarehouseLocation} onChange={updateField} error={errors.primaryWarehouseLocation} />
            <Field label="Customer support phone" name="customerSupportPhone" placeholder="+61 4XX XXX XXX" value={form.customerSupportPhone} onChange={updateField} error={errors.customerSupportPhone} />
            <Field label="General enquiries email" name="generalEnquiriesEmail" placeholder="hello@company.com.au" value={form.generalEnquiriesEmail} onChange={updateField} error={errors.generalEnquiriesEmail} wide />
          </FormSection>

          <FormSection icon={<ShieldIcon />} title="Account security">
            <Field label="Password" name="password" placeholder="Minimum 8 characters" value={form.password} onChange={updateField} error={errors.password} type="password" />
            <Field label="Confirm password" name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={updateField} error={errors.confirmPassword} type="password" />
          </FormSection>

          <div className="registration-actions">
            <Link className="registration-back" href="/">Back to homepage</Link>
            <button className="registration-primary" disabled={isSubmitting} type="submit"><PhoneIcon size={18} /> {isSubmitting ? "Submitting..." : "Submit supplier details"} <ArrowIcon size={18} /></button>
          </div>
        </form>
      )}
    </main>
  );
}
