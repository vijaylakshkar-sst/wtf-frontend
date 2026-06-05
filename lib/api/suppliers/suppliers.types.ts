import type { RegistrationAuthResponse } from "../types";

export type SupplierRegistrationForm = {
  companyName: string;
  tradingName: string;
  businessIdentifier: string;
  website: string;
  industryCategory: string;
  showroomLocations: string;
  serviceAreas: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  salesContactName: string;
  salesContactEmail: string;
  salesContactPhone: string;
  marketingContactName: string;
  marketingContactEmail: string;
  marketingContactPhone: string;
  productSupportContactName: string;
  productSupportContactEmail: string;
  productSupportContactPhone: string;
  primaryWarehouseLocation: string;
  customerSupportPhone: string;
  generalEnquiriesEmail: string;
  password: string;
  confirmPassword: string;
};

export type SupplierRegistrationPayload = Omit<
  SupplierRegistrationForm,
  "confirmPassword" | "showroomLocations" | "serviceAreas"
> & {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  showroomLocations: string[];
  serviceAreas: string[];
};

export type SupplierRegistrationResponse = RegistrationAuthResponse;

export type SupplierIndustryCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive?: boolean;
  sortOrder?: number;
};

export type SupplierIndustryCategoriesResponse = {
  categories: SupplierIndustryCategory[];
};
