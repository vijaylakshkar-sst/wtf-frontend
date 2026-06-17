export type ApiResponse<TData> = {
  status: "success" | "error";
  statusCode: number;
  message: string;
  data: TData;
};

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export type AuthUserRole = {
  id: string;
  name: string;
};

export type AuthPermission = {
  id: string;
  key: string;
  moduleKey: string;
  action: "view" | "create" | "edit" | "delete";
};

export type BuilderAccountSummary = {
  id: string;
  userId?: string | null;
  companyName: string;
  tradingName?: string | null;
};

export type BuilderRoleSummary = {
  id: string;
  name: string;
  displayName?: string;
  permissions?: AuthPermission[];
};

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  status: string;
  roles?: AuthUserRole[];
  builderProfile?: BuilderAccountSummary | null;
  builderMembership?: BuilderAccountSummary | null;
  builderRole?: BuilderRoleSummary | null;
};

export type RegistrationAuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};
