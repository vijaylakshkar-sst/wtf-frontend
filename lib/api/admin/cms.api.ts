import { apiClient } from "../client";
import { apiRoutes } from "../config";
import type {
  CmsPageCreatePayload,
  CmsPagePayload,
  CmsPageResponse,
  CmsPagesResponse,
} from "./cms.types";

export const adminCmsApi = {
  listPages: () =>
    apiClient<CmsPagesResponse>(apiRoutes.admin.cmsPages, {
    }),
  getPage: (slug: string) =>
    apiClient<CmsPageResponse>(`${apiRoutes.admin.cmsPages}/${slug}`, {
    }),
  createPage: (payload: CmsPageCreatePayload) =>
    apiClient<CmsPageResponse>(apiRoutes.admin.cmsPages, {
      method: "POST",
      body: payload,
    }),
  updatePage: (slug: string, payload: CmsPagePayload) =>
    apiClient<CmsPageResponse>(`${apiRoutes.admin.cmsPages}/${slug}`, {
      method: "PUT",
      body: payload,
    }),
};
