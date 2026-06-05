import type { AdminDirectoryRow } from "@/components/admin/data";

export type AdminDirectoryListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type AdminDirectoryPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminDirectoryApiRow = AdminDirectoryRow & {
  userId: string;
  code: string;
  approvalStatus: string;
  userStatus: string;
  updatedAt?: string | null;
  website?: string | null;
  phone?: string | null;
};

export type AdminProfileDetail = {
  entityType: "builder" | "supplier";
  summary: AdminDirectoryApiRow;
  profile: Record<string, unknown>;
  user: Record<string, unknown>;
};

export type AdminDirectoryListResponse = {
  pagination: AdminDirectoryPagination;
  rows: AdminDirectoryApiRow[];
};

export type BuilderDetailResponse = {
  builder: AdminProfileDetail;
};

export type SupplierDetailResponse = {
  supplier: AdminProfileDetail;
};

export type BuilderApprovalStatus = "pending" | "approved" | "rejected" | "suspended" | "blocked";

export type BuilderApprovalStatusResponse = {
  builder: AdminDirectoryApiRow;
};

export type SupplierApprovalStatusResponse = {
  supplier: AdminDirectoryApiRow;
};
