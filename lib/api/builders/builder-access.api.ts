import { apiClient } from "../client";
import { apiRoutes } from "../config";
import { getStoredAccessToken } from "../auth/auth-session";
import type {
  BuilderPermissionsResponse,
  BuilderRolePayload,
  BuilderRoleResponse,
  BuilderRolesResponse,
  BuilderStaffAssignmentResponse,
  BuilderStaffMutationResponse,
  BuilderStaffPayload,
  BuilderStaffResponse,
  BuilderStaffRolePayload,
} from "./builder-access.types";

const withAuthHeaders = () => {
  const token = getStoredAccessToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;
};

export const builderAccessApi = {
  listPermissions: () =>
    apiClient<BuilderPermissionsResponse>(apiRoutes.builders.permissions, {
      headers: withAuthHeaders(),
    }),
  listRoles: () =>
    apiClient<BuilderRolesResponse>(apiRoutes.builders.roles, {
      headers: withAuthHeaders(),
    }),
  getRole: (roleId: string) =>
    apiClient<BuilderRoleResponse>(`${apiRoutes.builders.roles}/${roleId}`, {
      headers: withAuthHeaders(),
    }),
  createRole: (payload: BuilderRolePayload) =>
    apiClient<BuilderRoleResponse>(apiRoutes.builders.roles, {
      method: "POST",
      headers: withAuthHeaders(),
      body: payload,
    }),
  updateRole: (roleId: string, payload: BuilderRolePayload) =>
    apiClient<BuilderRoleResponse>(`${apiRoutes.builders.roles}/${roleId}`, {
      method: "PUT",
      headers: withAuthHeaders(),
      body: payload,
    }),
  deleteRole: (roleId: string) =>
    apiClient<BuilderRoleResponse>(`${apiRoutes.builders.roles}/${roleId}`, {
      method: "DELETE",
      headers: withAuthHeaders(),
    }),
  listStaff: () =>
    apiClient<BuilderStaffResponse>(apiRoutes.builders.staff, {
      headers: withAuthHeaders(),
    }),
  createStaff: (payload: BuilderStaffPayload) =>
    apiClient<BuilderStaffMutationResponse>(apiRoutes.builders.staff, {
      method: "POST",
      headers: withAuthHeaders(),
      body: payload,
    }),
  updateStaff: (userId: string, payload: BuilderStaffPayload) =>
    apiClient<BuilderStaffMutationResponse>(`${apiRoutes.builders.staff}/${userId}`, {
      method: "PUT",
      headers: withAuthHeaders(),
      body: payload,
    }),
  deleteStaff: (userId: string) =>
    apiClient<BuilderStaffMutationResponse>(`${apiRoutes.builders.staff}/${userId}`, {
      method: "DELETE",
      headers: withAuthHeaders(),
    }),
  assignStaffRole: (userId: string, payload: BuilderStaffRolePayload) =>
    apiClient<BuilderStaffAssignmentResponse>(`${apiRoutes.builders.staff}/${userId}/role`, {
      method: "PUT",
      headers: withAuthHeaders(),
      body: payload,
    }),
};
