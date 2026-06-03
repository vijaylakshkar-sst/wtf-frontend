export type PermissionAction = "view" | "create" | "edit" | "delete";
export type ModuleKey = "dashboard" | "displayHomes" | "products" | "leads" | "analytics" | "staff";
export type RolePermissions = Record<ModuleKey, Record<PermissionAction, boolean>>;

export type PermissionModule = {
  key: ModuleKey;
  name: string;
  description: string;
};

export type BuilderRole = {
  id: number;
  name: string;
  description: string;
  users: number;
  permissions: RolePermissions;
};

export type RoleAssignment = {
  id: number;
  name: string;
  email: string;
  roleId: number;
};

export const permissionActions: { key: PermissionAction; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

export const permissionModules: PermissionModule[] = [
  { key: "dashboard", name: "Dashboard", description: "Overview metrics and builder activity" },
  { key: "displayHomes", name: "Display homes", description: "Homes, rooms, floor plans and QR setup" },
  { key: "products", name: "Products", description: "Product library, mapping and flagged items" },
  { key: "leads", name: "Leads & Customers", description: "Lead list, customer selections and reviews" },
  { key: "analytics", name: "Analytics", description: "Visits, conversion and product performance" },
  { key: "staff", name: "Staff", description: "Team members and access assignments" },
];

export const initialRoles: BuilderRole[] = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to all builder portal modules.",
    users: 1,
    permissions: createPermissions({
      dashboard: ["view"],
      displayHomes: ["view", "create", "edit", "delete"],
      products: ["view", "create", "edit", "delete"],
      leads: ["view", "create", "edit", "delete"],
      analytics: ["view"],
      staff: ["view", "create", "edit", "delete"],
    }),
  },
  {
    id: 2,
    name: "Sales",
    description: "Manage leads, customers and display home enquiries.",
    users: 1,
    permissions: createPermissions({
      dashboard: ["view"],
      displayHomes: ["view"],
      leads: ["view", "create", "edit"],
    }),
  },
  {
    id: 3,
    name: "Colour",
    description: "Maintain selections, products and display home content.",
    users: 1,
    permissions: createPermissions({
      dashboard: ["view"],
      displayHomes: ["view", "edit"],
      products: ["view", "create", "edit"],
    }),
  },
  {
    id: 4,
    name: "Marketing",
    description: "Review analytics and manage product visibility.",
    users: 1,
    permissions: createPermissions({
      dashboard: ["view"],
      displayHomes: ["view"],
      products: ["view", "edit"],
      analytics: ["view"],
    }),
  },
];

export const initialAssignments: RoleAssignment[] = [
  { id: 1, name: "Jane Smith", email: "jane@acme.com", roleId: 1 },
  { id: 2, name: "Marcus Lee", email: "marcus@acme.com", roleId: 2 },
  { id: 3, name: "Priya Nair", email: "priya@acme.com", roleId: 3 },
  { id: 4, name: "Tom Walsh", email: "tom@acme.com", roleId: 4 },
];

export function createBlankPermissions(): RolePermissions {
  return permissionModules.reduce((modulePermissions, module) => ({
    ...modulePermissions,
    [module.key]: permissionActions.reduce((actions, action) => ({ ...actions, [action.key]: false }), {} as Record<PermissionAction, boolean>),
  }), {} as RolePermissions);
}

export function createPermissions(enabled: Partial<Record<ModuleKey, PermissionAction[]>>): RolePermissions {
  const permissions = createBlankPermissions();

  Object.entries(enabled).forEach(([moduleKey, actions]) => {
    actions?.forEach((action) => {
      permissions[moduleKey as ModuleKey][action] = true;
    });
  });

  return permissions;
}
