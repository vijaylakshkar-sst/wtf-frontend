import { apiClient } from "../client";
import { apiRoutes } from "../config";
import type { CmsPagePayload, CmsPageResponse, CmsPagesResponse } from "./cms.types";

export const adminCmsApi = {
  listPages: () =>
    apiClient<CmsPagesResponse>(apiRoutes.admin.cmsPages, {
    }),
  updatePage: (slug: string, payload: CmsPagePayload) =>
    apiClient<CmsPageResponse>(`${apiRoutes.admin.cmsPages}/${slug}`, {
      method: "PUT",
      body: payload,
    }),
};
