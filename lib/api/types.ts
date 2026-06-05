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

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  status: string;
  roles?: AuthUserRole[];
};

export type RegistrationAuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};
