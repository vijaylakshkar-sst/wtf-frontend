import type { AuthUser } from "@/lib/api";

export type BuilderPermissionKey =
  | "dashboard.view"
  | "displayHomes.view"
  | "displayHomes.create"
  | "displayHomes.edit"
  | "displayHomes.delete"
  | "productGuide.view"
  | "productGuide.create"
  | "productGuide.edit"
  | "productGuide.delete"
  | "products.view"
  | "products.create"
  | "products.edit"
  | "products.delete"
  | "leadsCustomers.view"
  | "leadsCustomers.create"
  | "leadsCustomers.edit"
  | "leadsCustomers.delete"
  | "analytics.view"
  | "masters.view"
  | "masters.create"
  | "masters.edit"
  | "masters.delete"
  | "staff.view"
  | "staff.create"
  | "staff.edit"
  | "staff.delete"
  | "rolesPermissions.view"
  | "rolesPermissions.create"
  | "rolesPermissions.edit"
  | "rolesPermissions.delete";

const builderRoutePermissions: Array<{ prefix: string; permissions: BuilderPermissionKey[] }> = [
  { prefix: "/builder/display-homes", permissions: ["displayHomes.view"] },
  { prefix: "/builder/color-selection-guide", permissions: ["productGuide.view"] },
  { prefix: "/builder/products", permissions: ["products.view"] },
  { prefix: "/builder/leads", permissions: ["leadsCustomers.view"] },
  { prefix: "/builder/analytics", permissions: ["analytics.view"] },
  { prefix: "/builder/masters", permissions: ["masters.view"] },
  { prefix: "/builder/staff", permissions: ["staff.view"] },
  { prefix: "/builder/roles-permissions", permissions: ["rolesPermissions.view"] },
  { prefix: "/builder", permissions: ["dashboard.view"] },
];

export const isBuilderOwner = (user: AuthUser | null | undefined) => {
  if (!user) {
    return false;
  }

  const ownerId = user.builderProfile?.userId || user.builderMembership?.userId;
  return Boolean(ownerId && ownerId === user.id);
};

export const getBuilderPermissionKeys = (user: AuthUser | null | undefined) => {
  const permissions = user?.builderRole?.permissions || [];
  return new Set(permissions.map((permission) => permission.key as BuilderPermissionKey));
};

export const hasBuilderPermission = (
  user: AuthUser | null | undefined,
  permission: BuilderPermissionKey,
) => {
  if (isBuilderOwner(user)) {
    return true;
  }

  return getBuilderPermissionKeys(user).has(permission);
};

export const hasAnyBuilderPermission = (
  user: AuthUser | null | undefined,
  permissions: BuilderPermissionKey[],
) => {
  if (isBuilderOwner(user)) {
    return true;
  }

  const permissionKeys = getBuilderPermissionKeys(user);
  return permissions.some((permission) => permissionKeys.has(permission));
};

export const getBuilderRoutePermissions = (pathname: string): BuilderPermissionKey[] => {
  const match = builderRoutePermissions.find((route) => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`));
  return match?.permissions || [];
};

export const canAccessBuilderRoute = (user: AuthUser | null | undefined, pathname: string) => {
  const permissions = getBuilderRoutePermissions(pathname);

  if (!permissions.length) {
    return true;
  }

  return hasAnyBuilderPermission(user, permissions);
};

export const getFirstAccessibleBuilderPath = (user: AuthUser | null | undefined) => {
  const allowed = builderRoutePermissions.find((route) => hasAnyBuilderPermission(user, route.permissions));
  return allowed?.prefix || null;
};
