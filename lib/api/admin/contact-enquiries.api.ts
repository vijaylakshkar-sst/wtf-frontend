import { apiClient, refreshAuthSession } from "../client";
import { API_BASE_URL, apiRoutes } from "../config";
import type {
  ContactEnquiriesResponse,
  ContactEnquiryResponse,
  ContactEnquiryStatusPayload,
} from "./contact-enquiries.types";

type ContactEnquiriesQuery = {
  search?: string;
  page?: number;
  limit?: number;
  type?: "customer" | "supplier" | "builder" | "general";
  priority?: "low" | "medium" | "high";
  status?: "new" | "in_progress" | "closed";
};

const buildQueryString = (query?: ContactEnquiriesQuery) => {
  if (!query) {
    return "";
  }

  const searchParams = new URLSearchParams();

  if (query.search) searchParams.set("search", query.search);
  if (query.page) searchParams.set("page", String(query.page));
  if (query.limit) searchParams.set("limit", String(query.limit));
  if (query.type) searchParams.set("type", query.type);
  if (query.priority) searchParams.set("priority", query.priority);
  if (query.status) searchParams.set("status", query.status);

  const value = searchParams.toString();
  return value ? `?${value}` : "";
};

const readErrorMessage = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";
  const bodyText = await response.text();

  if (contentType.includes("application/json") && bodyText) {
    try {
      const payload = JSON.parse(bodyText) as { message?: string };
      return payload.message || response.statusText;
    } catch {
      return response.statusText;
    }
  }

  return bodyText || response.statusText;
};

export const adminContactEnquiriesApi = {
  listEnquiries: (query?: ContactEnquiriesQuery) =>
    apiClient<ContactEnquiriesResponse>(`${apiRoutes.admin.contactEnquiries}${buildQueryString(query)}`, {
    }),
  exportEnquiries: async (query?: ContactEnquiriesQuery) => {
    const path = `${apiRoutes.admin.contactEnquiries}/export${buildQueryString(query)}`;

    const performDownload = async () => {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      return response.blob();
    };

    try {
      return await performDownload();
    } catch (error) {
      if (!(error instanceof Error) || error.message !== "Unauthorized") {
        throw error;
      }
    }

    const nextAccessToken = await refreshAuthSession();

    if (!nextAccessToken) {
      throw new Error("Unable to export contact enquiries.");
    }

    return performDownload();
  },
  getEnquiry: (id: string) =>
    apiClient<ContactEnquiryResponse>(`${apiRoutes.admin.contactEnquiries}/${id}`, {
    }),
  deleteEnquiry: (id: string) =>
    apiClient<void>(`${apiRoutes.admin.contactEnquiries}/${id}`, {
      method: "DELETE",
    }),
  updateStatus: (id: string, payload: ContactEnquiryStatusPayload) =>
    apiClient<ContactEnquiryResponse>(`${apiRoutes.admin.contactEnquiries}/${id}/status`, {
      method: "PATCH",
      body: payload,
    }),
};
