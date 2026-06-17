import type {
  BuilderPermission,
  BuilderPermissionAction,
  BuilderRole,
  BuilderStaffMember,
} from "@/lib/api";

export const permissionActions: { key: BuilderPermissionAction; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

export const builderModuleOrder = [
  { key: "dashboard", name: "Dashboard", description: "Overview metrics and builder activity" },
  { key: "displayHomes", name: "Display homes", description: "Homes, rooms, floor plans and QR setup" },
  { key: "productGuide", name: "Product Guide", description: "Guided product setup and review workflow" },
  { key: "products", name: "Products", description: "Product library, mapping and flagged items" },
  { key: "leadsCustomers", name: "Leads & Customers", description: "Lead list, customer selections and reviews" },
  { key: "analytics", name: "Analytics", description: "Visits, conversion and product performance" },
  { key: "masters", name: "Masters", description: "Brands, categories, mapping and reference data" },
  { key: "staff", name: "Staff", description: "Team members and access assignments" },
  { key: "rolesPermissions", name: "Roles & Permissions", description: "Builder role library and access matrix" },
] as const;

export type BuilderModuleKey = (typeof builderModuleOrder)[number]["key"];

export type PermissionMatrix = Record<BuilderModuleKey, Record<BuilderPermissionAction, boolean>>;

export type PermissionGroup = {
  key: BuilderModuleKey;
  name: string;
  description: string;
  permissions: BuilderPermission[];
};

export type RoleFormState = {
  name: string;
  displayName: string;
  description: string;
  permissions: PermissionMatrix;
};

export const createBlankPermissions = (): PermissionMatrix => {
  return builderModuleOrder.reduce((modulePermissions, module) => ({
    ...modulePermissions,
    [module.key]: permissionActions.reduce(
      (actions, action) => ({ ...actions, [action.key]: false }),
      {} as Record<BuilderPermissionAction, boolean>,
    ),
  }), {} as PermissionMatrix);
};

export const createPermissionMatrix = (permissions: BuilderPermission[]): PermissionMatrix => {
  const matrix = createBlankPermissions();

  permissions.forEach((permission) => {
    const moduleKey = permission.moduleKey as BuilderModuleKey;
    const action = permission.action as BuilderPermissionAction;

    if (matrix[moduleKey]) {
      matrix[moduleKey][action] = true;
    }
  });

  return matrix;
};

export const groupPermissionsByModule = (permissions: BuilderPermission[]): PermissionGroup[] => {
  return builderModuleOrder.map((module) => ({
    ...module,
    permissions: permissions.filter((permission) => permission.moduleKey === module.key),
  }));
};

export const toSelectedPermissionKeys = (permissions: PermissionMatrix) => {
  return builderModuleOrder.flatMap((module) =>
    permissionActions
      .filter((action) => permissions[module.key][action.key])
      .map((action) => `${module.key}.${action.key}`),
  );
};

export const countEnabledPermissions = (permissions: PermissionMatrix) => {
  return builderModuleOrder.reduce(
    (total, module) =>
      total + permissionActions.filter((action) => permissions[module.key][action.key]).length,
    0,
  );
};

export const countAvailablePermissions = (groups: PermissionGroup[]) => {
  return groups.reduce((total, group) => total + group.permissions.length, 0);
};

export const getRoleLabel = (role: BuilderRole | null | undefined) => role?.displayName || role?.name || "Unassigned";

export const getStaffName = (staff: BuilderStaffMember) =>
  [staff.firstName, staff.lastName].filter(Boolean).join(" ");
