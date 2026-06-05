import type { RegistrationAuthResponse } from "../types";

export type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = RegistrationAuthResponse;

export type LogoutPayload = {
  refreshToken: string | null;
};

export type MeResponse = {
  user: RegistrationAuthResponse["user"];
};

export type UpdateProfilePayload = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ForgotPasswordResponse = {
  resetUrl?: string;
} | null;

export type ResetPasswordPayload = {
  token: string;
  password: string;
};
