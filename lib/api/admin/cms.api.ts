import { getStoredAccessToken } from "../auth/auth-session";
import { apiClient } from "../client";
import { apiRoutes } from "../config";
import type { CmsPagePayload, CmsPageResponse, CmsPagesResponse } from "./cms.types";

const withAuthHeaders = () => {
  const token = getStoredAccessToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;
};

export const adminCmsApi = {
  listPages: () =>
    apiClient<CmsPagesResponse>(apiRoutes.admin.cmsPages, {
      headers: withAuthHeaders(),
    }),
  updatePage: (slug: string, payload: CmsPagePayload) =>
    apiClient<CmsPageResponse>(`${apiRoutes.admin.cmsPages}/${slug}`, {
      method: "PUT",
      headers: withAuthHeaders(),
      body: payload,
    }),
};
