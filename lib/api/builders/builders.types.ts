import type { RegistrationAuthResponse } from "../types";

export type BuilderRegistrationForm = {
  companyName: string;
  tradingName: string;
  abn: string;
  licenseNumber: string;
  yearsInOperation: string;
  displayHomesCount: string;
  regionsServiced: string;
  website: string;
  socialMediaLinks: string;
  primaryContactName: string;
  primaryContactPosition: string;
  primaryContactEmail: string;
  primaryContactMobile: string;
  preferredContactMethod: string;
  builderType: string;
  homesBuiltPerYear: string;
  salesConsultantsCount: string;
  colourConsultantsCount: string;
  hasInternalMarketingTeam: string;
  colourSelectionManagement: string;
  clientReceives: string[];
  exportSelections: string;
  selectionsSentTo: string;
  newLeadsSentTo: string;
  password: string;
  confirmPassword: string;
};

export type BuilderRegistrationPayload = Omit<
  BuilderRegistrationForm,
  | "confirmPassword"
  | "regionsServiced"
  | "socialMediaLinks"
  | "yearsInOperation"
  | "displayHomesCount"
  | "homesBuiltPerYear"
  | "salesConsultantsCount"
  | "colourConsultantsCount"
> & {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  regionsServiced: string[];
  socialMediaLinks: string[];
  yearsInOperation: number | null;
  displayHomesCount: number | null;
  homesBuiltPerYear: number | null;
  salesConsultantsCount: number | null;
  colourConsultantsCount: number | null;
};

export type BuilderRegistrationResponse = RegistrationAuthResponse;
