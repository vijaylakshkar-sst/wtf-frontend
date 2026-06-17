export type BuilderPermissionAction = "view" | "create" | "edit" | "delete";

export type BuilderPermission = {
  id: string;
  key: string;
  moduleKey: string;
  action: BuilderPermissionAction;
  displayName: string;
  description?: string | null;
};

export type BuilderRole = {
  id: string;
  builderProfileId: string;
  name: string;
  displayName: string;
  description?: string | null;
  usersCount?: number;
  permissions: BuilderPermission[];
};

export type BuilderStaffMember = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  status: string;
  builderRoleId?: string | null;
  builderRole?: BuilderRole | null;
  isBuilderOwner?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BuilderPermissionsResponse = {
  permissions: BuilderPermission[];
};

export type BuilderRolesResponse = {
  roles: BuilderRole[];
};

export type BuilderRoleResponse = {
  role: BuilderRole;
};

export type BuilderStaffResponse = {
  staff: BuilderStaffMember[];
};

export type BuilderStaffAssignmentResponse = {
  staff: BuilderStaffMember;
};

export type BuilderStaffMutationResponse = {
  staff: BuilderStaffMember;
};

export type BuilderRolePayload = {
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
};

export type BuilderStaffRolePayload = {
  builderRoleId: string;
};

export type BuilderStaffPayload = {
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  password?: string;
  status?: "active" | "pending" | "suspended";
  builderRoleId?: string | null;
};
