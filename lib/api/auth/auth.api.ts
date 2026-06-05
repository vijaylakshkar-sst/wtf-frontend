import { apiClient } from "../client";
import { apiRoutes } from "../config";
import { getStoredAccessToken } from "./auth-session";
import { validateEmail, type ValidationErrors } from "../validation";
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LogoutPayload,
  LoginForm,
  LoginPayload,
  LoginResponse,
  MeResponse,
  ResetPasswordPayload,
  UpdateProfilePayload,
} from "./auth.types";

const withAuthHeaders = () => {
  const token = getStoredAccessToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;
};

export const validateLogin = (form: LoginForm) => {
  const errors: ValidationErrors<LoginForm> = {};
  const emailError = validateEmail(form.email, "Email address");

  if (emailError) {
    errors.email = emailError;
  }

  if (!form.password) {
    errors.password = "Password is required.";
  }

  return errors;
};

export const toLoginPayload = (form: LoginForm): LoginPayload => ({
  email: form.email.trim(),
  password: form.password,
});

export const authApi = {
  me: () =>
    apiClient<MeResponse>(apiRoutes.auth.me, {
      headers: withAuthHeaders(),
    }),
  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient<MeResponse>(apiRoutes.auth.me, {
      method: "PUT",
      headers: withAuthHeaders(),
      body: payload,
    }),
  changePassword: (payload: ChangePasswordPayload) =>
    apiClient<null>(apiRoutes.auth.changePassword, {
      method: "PUT",
      headers: withAuthHeaders(),
      body: payload,
    }),
  login: (form: LoginForm) =>
    apiClient<LoginResponse>(apiRoutes.auth.login, {
      method: "POST",
      body: toLoginPayload(form),
    }),
  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient<ForgotPasswordResponse>(apiRoutes.auth.forgotPassword, {
      method: "POST",
      body: payload,
    }),
  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient<null>(apiRoutes.auth.resetPassword, {
      method: "POST",
      body: payload,
    }),
  logout: (payload: LogoutPayload) =>
    apiClient<null>(apiRoutes.auth.logout, {
      method: "POST",
      body: payload,
    }),
};
