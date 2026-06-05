import { apiClient } from "../client";
import { apiRoutes } from "../config";
import {
  getFirstAndLastName,
  requireText,
  splitCsv,
  validateEmail,
  validateOptionalEmail,
  validateOptionalUrl,
  validatePassword,
  type ValidationErrors,
} from "../validation";
import type {
  SupplierRegistrationForm,
  SupplierIndustryCategoriesResponse,
  SupplierRegistrationPayload,
  SupplierRegistrationResponse,
} from "./suppliers.types";

export const validateSupplierRegistration = (form: SupplierRegistrationForm) => {
  const errors: ValidationErrors<SupplierRegistrationForm> = {};

  const checks: Array<[keyof SupplierRegistrationForm, string]> = [
    ["companyName", requireText(form.companyName, "Company name")],
    ["businessIdentifier", requireText(form.businessIdentifier, "Business registration number")],
    ["industryCategory", requireText(form.industryCategory, "Industry category")],
    ["showroomLocations", requireText(form.showroomLocations, "Showroom locations")],
    ["serviceAreas", requireText(form.serviceAreas, "Service areas")],
    ["primaryContactName", requireText(form.primaryContactName, "Primary contact name")],
    ["primaryContactEmail", validateEmail(form.primaryContactEmail, "Primary contact email")],
    ["primaryContactPhone", requireText(form.primaryContactPhone, "Primary contact phone")],
    ["primaryWarehouseLocation", requireText(form.primaryWarehouseLocation, "Primary warehouse / dispatch location")],
    ["customerSupportPhone", requireText(form.customerSupportPhone, "Customer support phone")],
    ["generalEnquiriesEmail", validateEmail(form.generalEnquiriesEmail, "General enquiries email")],
    ["password", validatePassword(form.password)],
    ["website", validateOptionalUrl(form.website, "Website")],
    ["salesContactEmail", validateOptionalEmail(form.salesContactEmail, "Sales contact email")],
    ["marketingContactEmail", validateOptionalEmail(form.marketingContactEmail, "Marketing contact email")],
    [
      "productSupportContactEmail",
      validateOptionalEmail(form.productSupportContactEmail, "Product support contact email"),
    ],
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

export const toSupplierRegistrationPayload = (form: SupplierRegistrationForm): SupplierRegistrationPayload => {
  const { firstName, lastName } = getFirstAndLastName(form.primaryContactName);

  return {
    ...form,
    email: form.primaryContactEmail.trim(),
    firstName,
    lastName,
    phone: form.primaryContactPhone.trim(),
    companyName: form.companyName.trim(),
    tradingName: form.tradingName.trim(),
    businessIdentifier: form.businessIdentifier.trim(),
    website: form.website.trim(),
    showroomLocations: splitCsv(form.showroomLocations),
    serviceAreas: splitCsv(form.serviceAreas),
    primaryContactName: form.primaryContactName.trim(),
    primaryContactEmail: form.primaryContactEmail.trim(),
    primaryContactPhone: form.primaryContactPhone.trim(),
    generalEnquiriesEmail: form.generalEnquiriesEmail.trim(),
  };
};

export const suppliersApi = {
  listIndustryCategories: () =>
    apiClient<SupplierIndustryCategoriesResponse>(apiRoutes.suppliers.industryCategories),
  register: (form: SupplierRegistrationForm) =>
    apiClient<SupplierRegistrationResponse>(apiRoutes.suppliers.register, {
      method: "POST",
      body: toSupplierRegistrationPayload(form),
    }),
};
