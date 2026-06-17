import type { LoginResponse } from "./auth.types";
import type { AuthUser } from "../types";

const storageKeys = {
  user: "wtf_user",
} as const;

const getPreferredStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (window.sessionStorage.getItem(storageKeys.user) !== null) {
    return window.sessionStorage;
  }

  if (window.localStorage.getItem(storageKeys.user) !== null) {
    return window.localStorage;
  }

  return window.sessionStorage;
};

export const clearLegacyAuthTokens = () => {
  window.localStorage.removeItem("wtf_access_token");
  window.sessionStorage.removeItem("wtf_access_token");
  window.localStorage.removeItem("wtf_refresh_token");
  window.sessionStorage.removeItem("wtf_refresh_token");
};

export const saveAuthSession = (session: LoginResponse, rememberMe: boolean) => {
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  const otherStorage = rememberMe ? window.sessionStorage : window.localStorage;

  clearLegacyAuthTokens();
  otherStorage.removeItem(storageKeys.user);

  storage.setItem(storageKeys.user, JSON.stringify(session.user));
};

export const updateAuthSession = (session: LoginResponse) => {
  if (typeof window === "undefined") {
    return;
  }

  const storage = getPreferredStorage();

  clearLegacyAuthTokens();

  if (!storage) {
    return;
  }

  storage.setItem(storageKeys.user, JSON.stringify(session.user));
};

export const updateStoredAuthUser = (user: AuthUser) => {
  if (typeof window === "undefined") {
    return;
  }

  const storage =
    window.sessionStorage.getItem(storageKeys.user) !== null
      ? window.sessionStorage
      : window.localStorage;

  storage.setItem(storageKeys.user, JSON.stringify(user));
};

const getStoredValue = (key: string) => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(key) || window.localStorage.getItem(key);
};

export const getStoredAuthUser = (): AuthUser | null => {
  const storedUser = getStoredValue(storageKeys.user);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  clearLegacyAuthTokens();
  window.localStorage.removeItem(storageKeys.user);
  window.sessionStorage.removeItem(storageKeys.user);
};

export const getRedirectPathForRoles = (roles: string[]) => {
  if (roles.includes("admin")) {
    return "/admin";
  }

  if (roles.includes("supplier")) {
    return "/supplier/dashboard";
  }

  if (roles.includes("builder")) {
    return "/builder";
  }

  return "/";
};

export const getInactiveAccountMessage = (status?: string) => {
  if (status === "pending") {
    return "Your account is pending approval. Please wait for admin verification before signing in.";
  }

  if (status === "suspended") {
    return "Your account has been suspended. Please contact support.";
  }

  if (status === "deleted") {
    return "This account is no longer active. Please contact support.";
  }

  return "Your account is not active yet. Please contact support.";
};
