import { apiClient } from "../client";
import { apiRoutes } from "../config";
import type {
  AdminDirectoryListParams,
  AdminDirectoryListResponse,
  BuilderApprovalStatus,
  BuilderApprovalStatusResponse,
  BuilderDetailResponse,
  SupplierDetailResponse,
  SupplierApprovalStatusResponse,
} from "./admin.types";

const buildQueryString = (params: AdminDirectoryListParams = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

const listDirectory = (path: string, params?: AdminDirectoryListParams) =>
  apiClient<AdminDirectoryListResponse>(`${path}${buildQueryString(params)}`, {
  });

export const adminApi = {
  getBuilderDetail: (builderId: string) =>
    apiClient<BuilderDetailResponse>(`${apiRoutes.admin.builders}/${builderId}`, {
    }),
  listBuilders: (params?: AdminDirectoryListParams) => listDirectory(apiRoutes.admin.builders, params),
  updateBuilderApprovalStatus: (builderId: string, approvalStatus: BuilderApprovalStatus) =>
    apiClient<BuilderApprovalStatusResponse>(`${apiRoutes.admin.builders}/${builderId}/approval-status`, {
      method: "PATCH",
      body: { approvalStatus },
    }),
  listSuppliers: (params?: AdminDirectoryListParams) => listDirectory(apiRoutes.admin.suppliers, params),
  getSupplierDetail: (supplierId: string) =>
    apiClient<SupplierDetailResponse>(`${apiRoutes.admin.suppliers}/${supplierId}`, {
    }),
  updateSupplierApprovalStatus: (supplierId: string, approvalStatus: BuilderApprovalStatus) =>
    apiClient<SupplierApprovalStatusResponse>(`${apiRoutes.admin.suppliers}/${supplierId}/approval-status`, {
      method: "PATCH",
      body: { approvalStatus },
    }),
};
