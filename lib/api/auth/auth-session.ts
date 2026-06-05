import type { LoginResponse } from "./auth.types";
import type { AuthUser } from "../types";

const storageKeys = {
  accessToken: "wtf_access_token",
  refreshToken: "wtf_refresh_token",
  user: "wtf_user",
} as const;

export const saveAuthSession = (session: LoginResponse, rememberMe: boolean) => {
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  const otherStorage = rememberMe ? window.sessionStorage : window.localStorage;

  otherStorage.removeItem(storageKeys.accessToken);
  otherStorage.removeItem(storageKeys.refreshToken);
  otherStorage.removeItem(storageKeys.user);

  storage.setItem(storageKeys.accessToken, session.accessToken);
  storage.setItem(storageKeys.refreshToken, session.refreshToken);
  storage.setItem(storageKeys.user, JSON.stringify(session.user));
};

export const updateAuthSession = (session: LoginResponse) => {
  if (typeof window === "undefined") {
    return;
  }

  const storage =
    window.sessionStorage.getItem(storageKeys.refreshToken) !== null
      ? window.sessionStorage
      : window.localStorage;

  storage.setItem(storageKeys.accessToken, session.accessToken);
  storage.setItem(storageKeys.refreshToken, session.refreshToken);
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

export const getStoredAccessToken = () => getStoredValue(storageKeys.accessToken);

export const getStoredRefreshToken = () => getStoredValue(storageKeys.refreshToken);

export const clearAuthSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  Object.values(storageKeys).forEach((key) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  });
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
