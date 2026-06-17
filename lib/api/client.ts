import { API_BASE_URL } from "./config";
import {
  clearAuthSession,
  updateAuthSession,
} from "./auth/auth-session";
import { apiRoutes } from "./config";
import { ApiError } from "./errors";
import type { LoginResponse } from "./auth/auth.types";
import type { ApiRequestOptions, ApiResponse } from "./types";

const parseJson = async <TData>(response: Response): Promise<ApiResponse<TData>> => {
  const text = await response.text();

  if (!text) {
    return {
      status: response.ok ? "success" : "error",
      statusCode: response.status,
      message: response.statusText,
      data: null as TData,
    };
  }

  return JSON.parse(text) as ApiResponse<TData>;
};

const buildRequest = (options: ApiRequestOptions = {}) => {
  const headers = new Headers(options.headers);

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return {
    ...options,
    credentials: options.credentials ?? "include",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  };
};

let refreshPromise: Promise<string | null> | null = null;

const performRefresh = async () => {
  const response = await fetch(`${API_BASE_URL}${apiRoutes.auth.refresh}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const payload = await parseJson<LoginResponse>(response);

  if (!response.ok || payload.status === "error") {
    return null;
  }

  updateAuthSession(payload.data);
  return payload.data.accessToken;
};

export const refreshAuthSession = async () => {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const redirectToSignIn = () => {
  if (typeof window === "undefined" || window.location.pathname === "/sign-in") {
    return;
  }

  const nextPath = `${window.location.pathname}${window.location.search}`;
  window.location.replace(`/sign-in?next=${encodeURIComponent(nextPath)}`);
};

export const apiClient = async <TData>(path: string, options: ApiRequestOptions = {}) => {
  const request = buildRequest(options);
  const response = await fetch(`${API_BASE_URL}${path}`, request);

  const payload = await parseJson<TData>(response);

  if (response.status === 401 && path !== apiRoutes.auth.login && path !== apiRoutes.auth.refresh) {
    const nextAccessToken = await refreshAuthSession();

    if (nextAccessToken) {
      const retryOptions = buildRequest(options);

      const retryResponse = await fetch(`${API_BASE_URL}${path}`, retryOptions);
      const retryPayload = await parseJson<TData>(retryResponse);

      if (!retryResponse.ok || retryPayload.status === "error") {
        throw new ApiError(retryPayload.message || retryResponse.statusText, retryResponse.status, retryPayload.data);
      }

      return retryPayload;
    }

    clearAuthSession();
    redirectToSignIn();
    throw new ApiError("Your session has expired. Please sign in again.", 401, null);
  }

  if (!response.ok || payload.status === "error") {
    throw new ApiError(payload.message || response.statusText, response.status, payload.data);
  }

  return payload;
};
