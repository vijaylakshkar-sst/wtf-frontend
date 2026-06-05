import { apiClient } from "../client";
import { apiRoutes } from "../config";
import {
  getFirstAndLastName,
  requireText,
  splitCsv,
  validateEmail,
  validateNonNegativeInteger,
  validateOptionalUrl,
  validatePassword,
  type ValidationErrors,
} from "../validation";
import type {
  BuilderRegistrationForm,
  BuilderRegistrationPayload,
  BuilderRegistrationResponse,
} from "./builders.types";

const optionalNumber = (value: string) => (value.trim() ? Number(value) : null);

export const validateBuilderRegistration = (form: BuilderRegistrationForm) => {
  return {
    ...validateBuilderRegistrationStepOne(form),
    ...validateBuilderRegistrationStepTwo(form),
  };
};

export const validateBuilderRegistrationStepOne = (form: BuilderRegistrationForm) => {
  const errors: ValidationErrors<BuilderRegistrationForm> = {};

  const checks: Array<[keyof BuilderRegistrationForm, string]> = [
    ["companyName", requireText(form.companyName, "Company legal name")],
    ["abn", requireText(form.abn, "ABN")],
    ["licenseNumber", requireText(form.licenseNumber, "Builder licence number")],
    ["regionsServiced", requireText(form.regionsServiced, "Regions / suburbs serviced")],
    ["primaryContactName", requireText(form.primaryContactName, "Primary contact full name")],
    ["primaryContactEmail", validateEmail(form.primaryContactEmail, "Primary contact email")],
    ["primaryContactMobile", requireText(form.primaryContactMobile, "Primary contact mobile")],
    ["preferredContactMethod", requireText(form.preferredContactMethod, "Preferred contact method")],
    ["builderType", requireText(form.builderType, "Builder type")],
    ["password", validatePassword(form.password)],
    ["website", validateOptionalUrl(form.website, "Company website")],
    ["yearsInOperation", validateNonNegativeInteger(form.yearsInOperation, "Years in operation")],
    ["displayHomesCount", validateNonNegativeInteger(form.displayHomesCount, "Number of display homes")],
    ["homesBuiltPerYear", validateNonNegativeInteger(form.homesBuiltPerYear, "Homes built per year")],
    ["salesConsultantsCount", validateNonNegativeInteger(form.salesConsultantsCount, "Sales consultants")],
    ["colourConsultantsCount", validateNonNegativeInteger(form.colourConsultantsCount, "Colour consultants")],
  ];

  checks.forEach(([field, message]) => {
    if (message) {
      errors[field] = message;
    }
  });

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

export const validateBuilderRegistrationStepTwo = (form: BuilderRegistrationForm) => {
  const errors: ValidationErrors<BuilderRegistrationForm> = {};

  if (form.clientReceives.length === 0) {
    errors.clientReceives = "Select at least one client receive option.";
  }

  return errors;
};

export const toBuilderRegistrationPayload = (form: BuilderRegistrationForm): BuilderRegistrationPayload => {
  const { firstName, lastName } = getFirstAndLastName(form.primaryContactName);

  return {
    ...form,
    email: form.primaryContactEmail.trim(),
    firstName,
    lastName,
    phone: form.primaryContactMobile.trim(),
    companyName: form.companyName.trim(),
    tradingName: form.tradingName.trim(),
    abn: form.abn.trim(),
    licenseNumber: form.licenseNumber.trim(),
    regionsServiced: splitCsv(form.regionsServiced),
    website: form.website.trim(),
    socialMediaLinks: splitCsv(form.socialMediaLinks),
    primaryContactName: form.primaryContactName.trim(),
    primaryContactPosition: form.primaryContactPosition.trim(),
    primaryContactEmail: form.primaryContactEmail.trim(),
    primaryContactMobile: form.primaryContactMobile.trim(),
    yearsInOperation: optionalNumber(form.yearsInOperation),
    displayHomesCount: optionalNumber(form.displayHomesCount),
    homesBuiltPerYear: optionalNumber(form.homesBuiltPerYear),
    salesConsultantsCount: optionalNumber(form.salesConsultantsCount),
    colourConsultantsCount: optionalNumber(form.colourConsultantsCount),
  };
};

export const buildersApi = {
  register: (form: BuilderRegistrationForm) =>
    apiClient<BuilderRegistrationResponse>(apiRoutes.builders.register, {
      method: "POST",
      body: toBuilderRegistrationPayload(form),
    }),
};
