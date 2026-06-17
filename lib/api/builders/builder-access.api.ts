import { apiClient } from "../client";
import { apiRoutes } from "../config";
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

export const builderAccessApi = {
  listPermissions: () =>
    apiClient<BuilderPermissionsResponse>(apiRoutes.builders.permissions, {
    }),
  listRoles: () =>
    apiClient<BuilderRolesResponse>(apiRoutes.builders.roles, {
    }),
  getRole: (roleId: string) =>
    apiClient<BuilderRoleResponse>(`${apiRoutes.builders.roles}/${roleId}`, {
    }),
  createRole: (payload: BuilderRolePayload) =>
    apiClient<BuilderRoleResponse>(apiRoutes.builders.roles, {
      method: "POST",
      body: payload,
    }),
  updateRole: (roleId: string, payload: BuilderRolePayload) =>
    apiClient<BuilderRoleResponse>(`${apiRoutes.builders.roles}/${roleId}`, {
      method: "PUT",
      body: payload,
    }),
  deleteRole: (roleId: string) =>
    apiClient<BuilderRoleResponse>(`${apiRoutes.builders.roles}/${roleId}`, {
      method: "DELETE",
    }),
  listStaff: () =>
    apiClient<BuilderStaffResponse>(apiRoutes.builders.staff, {
    }),
  createStaff: (payload: BuilderStaffPayload) =>
    apiClient<BuilderStaffMutationResponse>(apiRoutes.builders.staff, {
      method: "POST",
      body: payload,
    }),
  updateStaff: (userId: string, payload: BuilderStaffPayload) =>
    apiClient<BuilderStaffMutationResponse>(`${apiRoutes.builders.staff}/${userId}`, {
      method: "PUT",
      body: payload,
    }),
  deleteStaff: (userId: string) =>
    apiClient<BuilderStaffMutationResponse>(`${apiRoutes.builders.staff}/${userId}`, {
      method: "DELETE",
    }),
  assignStaffRole: (userId: string, payload: BuilderStaffRolePayload) =>
    apiClient<BuilderStaffAssignmentResponse>(`${apiRoutes.builders.staff}/${userId}/role`, {
      method: "PUT",
      body: payload,
    }),
};
