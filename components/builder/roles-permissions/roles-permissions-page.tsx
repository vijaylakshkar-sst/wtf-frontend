"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { CheckIcon, EditIcon, PlusIcon, ShieldIcon, UserIcon, UsersIcon, XIcon } from "@/components/icons";
import { BuilderShell } from "@/components/builder/builder-shell";
import { useToast } from "@/components/toast-provider";
import { getStoredAuthUser } from "@/lib/api";
import { hasAnyBuilderPermission } from "@/lib/builder-access";
import {
  builderAccessApi,
  getErrorMessage,
  type BuilderPermission,
  type BuilderPermissionAction,
  type BuilderRole,
  type BuilderStaffMember,
} from "@/lib/api";
import {
  countAvailablePermissions,
  countEnabledPermissions,
  createBlankPermissions,
  createPermissionMatrix,
  groupPermissionsByModule,
  permissionActions,
  toSelectedPermissionKeys,
  type BuilderModuleKey,
  type PermissionGroup,
  type RoleFormState,
} from "./data";

type RoleModalMode = "create" | "edit";
type StaffRow = BuilderStaffMember & { displayName: string };

const createEmptyForm = (): RoleFormState => ({
  name: "",
  displayName: "",
  description: "",
  permissions: createBlankPermissions(),
});

export function RolesPermissionsPage() {
  const { showToast } = useToast();
  const user = getStoredAuthUser();
  const canCreateRole = hasAnyBuilderPermission(user, ["rolesPermissions.create"]);
  const canEditRole = hasAnyBuilderPermission(user, ["rolesPermissions.edit"]);
  const canDeleteRole = hasAnyBuilderPermission(user, ["rolesPermissions.delete"]);
  const canAssignStaffRoles = hasAnyBuilderPermission(user, ["staff.edit"]);
  const [permissions, setPermissions] = useState<BuilderPermission[]>([]);
  const [roles, setRoles] = useState<BuilderRole[]>([]);
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleModalMode, setRoleModalMode] = useState<RoleModalMode>("create");
  const [roleForm, setRoleForm] = useState<RoleFormState>(createEmptyForm());
  const [savingRole, setSavingRole] = useState(false);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<BuilderRole | null>(null);
  const [assigningStaffId, setAssigningStaffId] = useState<string | null>(null);

  const permissionGroups = useMemo(() => groupPermissionsByModule(permissions), [permissions]);
  const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? roles[0] ?? null;
  const selectedRoleMatrix = useMemo(() => createPermissionMatrix(selectedRole?.permissions ?? []), [selectedRole]);
  const enabledPermissionCount = useMemo(
    () => roles.reduce((total, role) => total + countEnabledPermissions(createPermissionMatrix(role.permissions)), 0),
    [roles],
  );
  const availablePermissionCount = useMemo(
    () => roles.reduce((total, role) => total + countAvailablePermissions(groupPermissionsByModule(role.permissions)), 0),
    [roles],
  );

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (!selectedRoleId && roles[0]) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    try {
      const [permissionsResponse, rolesResponse, staffResponse] = await Promise.all([
        builderAccessApi.listPermissions(),
        builderAccessApi.listRoles(),
        builderAccessApi.listStaff(),
      ]);

      setPermissions(permissionsResponse.data.permissions);
      setRoles(rolesResponse.data.roles);
      setStaff(
        staffResponse.data.staff.map((member) => ({
          ...member,
          displayName: [member.firstName, member.lastName].filter(Boolean).join(" "),
        })),
      );

      setSelectedRoleId((current) => current || rolesResponse.data.roles[0]?.id || null);
    } catch (loadError) {
      const message = getErrorMessage(loadError, "Roles and permissions could not be loaded.");
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateModal() {
    setRoleModalMode("create");
    setRoleForm(createEmptyForm());
    setIsRoleModalOpen(true);
  }

  function openEditModal(role: BuilderRole) {
    setRoleModalMode("edit");
    setRoleForm({
      name: role.name,
      displayName: role.displayName,
      description: role.description || "",
      permissions: createPermissionMatrix(role.permissions),
    });
    setIsRoleModalOpen(true);
  }

  function toggleRolePermission(moduleKey: BuilderModuleKey, action: BuilderPermissionAction) {
    setRoleForm((current) => ({
      ...current,
      permissions: {
        ...current.permissions,
        [moduleKey]: {
          ...current.permissions[moduleKey],
          [action]: !current.permissions[moduleKey][action],
        },
      },
    }));
  }

  async function saveRole() {
    const payload = {
      name: roleForm.name.trim(),
      displayName: roleForm.displayName.trim(),
      description: roleForm.description.trim(),
      permissions: toSelectedPermissionKeys(roleForm.permissions),
    };

    if (!payload.name || !payload.displayName) {
      showToast("Role name and display name are required.", "error");
      return;
    }

    setSavingRole(true);

    try {
      if (roleModalMode === "create") {
        const response = await builderAccessApi.createRole(payload);
        setRoles((current) => [...current, response.data.role]);
        setSelectedRoleId(response.data.role.id);
        showToast("Builder role created successfully.", "success");
      } else if (selectedRole) {
        const response = await builderAccessApi.updateRole(selectedRole.id, payload);
        setRoles((current) => current.map((role) => (role.id === response.data.role.id ? response.data.role : role)));
        setSelectedRoleId(response.data.role.id);
        showToast("Builder role updated successfully.", "success");
      }

      setIsRoleModalOpen(false);
    } catch (saveError) {
      showToast(getErrorMessage(saveError, "Unable to save role."), "error");
    } finally {
      setSavingRole(false);
    }
  }

  async function deleteRole(roleId: string) {
    if (!roleId) {
      return;
    }

    setDeletingRoleId(roleId);

    try {
      await builderAccessApi.deleteRole(roleId);
      setRoles((current) => {
        const nextRoles = current.filter((item) => item.id !== roleId);
        if (selectedRoleId === roleId) {
          setSelectedRoleId(nextRoles[0]?.id || null);
        }
        return nextRoles;
      });
      setRoleToDelete(null);
      showToast("Builder role deleted successfully.", "success");
    } catch (deleteError) {
      showToast(getErrorMessage(deleteError, "Unable to delete role."), "error");
    } finally {
      setDeletingRoleId(null);
    }
  }

  async function assignRoleToStaff(staffId: string, builderRoleId: string) {
    setAssigningStaffId(staffId);

    try {
      await builderAccessApi.assignStaffRole(staffId, { builderRoleId });
      setStaff((current) =>
        current.map((member) =>
          member.id === staffId
            ? {
                ...member,
                builderRoleId,
                builderRole: roles.find((role) => role.id === builderRoleId) || null,
              }
            : member,
        ),
      );
      showToast("Staff role updated successfully.", "success");
    } catch (assignError) {
      showToast(getErrorMessage(assignError, "Unable to update staff role."), "error");
    } finally {
      setAssigningStaffId(null);
    }
  }

  return (
    <BuilderShell>
      <main className="builder-main roles-main">
        <header className="roles-header">
          <div>
            <p>Home / Roles & Permissions</p>
            <h1>Roles & Permissions</h1>
            <span>Create builder roles, assign module permissions, and manage staff access.</span>
          </div>
          {canCreateRole ? (
            <button onClick={openCreateModal} type="button">
              <PlusIcon size={18} /> Create role
            </button>
          ) : null}
        </header>

        {isLoading ? <p className="roles-loading">Loading roles and permissions...</p> : null}
        {error ? <p className="roles-error">{error}</p> : null}

        <section className="roles-stats">
          <article>
            <span><ShieldIcon size={22} /></span>
            <div><small>Total roles</small><strong>{roles.length}</strong></div>
          </article>
          <article>
            <span><UsersIcon size={22} /></span>
            <div><small>Assigned users</small><strong>{staff.length}</strong></div>
          </article>
          <article>
            <span><CheckIcon size={22} /></span>
            <div><small>Enabled permissions</small><strong>{enabledPermissionCount}</strong></div>
          </article>
          <article>
            <span><EditIcon size={22} /></span>
            <div>
              <small>Permission coverage</small>
              <strong>
                {availablePermissionCount > 0 ? Math.round((enabledPermissionCount / availablePermissionCount) * 100) : 0}%
              </strong>
            </div>
          </article>
        </section>

        <section className="roles-layout">
          <aside className="roles-list-panel">
            <header>
              <div>
                <h2>Role library</h2>
                <p>Select a role to configure permissions.</p>
              </div>
            </header>
            <div className="roles-list">
              {roles.map((role) => (
                <button
                  className={role.id === selectedRole?.id ? "active" : ""}
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  type="button"
                >
                  <span>{getRoleAbbrev(role.displayName || role.name)}</span>
                  <div>
                    <strong>{role.displayName || role.name}</strong>
                    <small>{role.usersCount || 0} assigned users</small>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="permission-panel">
            <header>
              <div>
                <h2>{selectedRole?.displayName || "No role selected"}</h2>
                <p>{selectedRole?.description || "Choose a role to view its permissions."}</p>
              </div>
              <div className="permission-panel-actions">
                <span>{countEnabledPermissions(selectedRoleMatrix)} permissions enabled</span>
                {selectedRole ? (
                  <div className="permission-panel-buttons">
                    {canEditRole ? (
                      <button onClick={() => openEditModal(selectedRole)} type="button">
                        <EditIcon size={15} /> Edit
                      </button>
                    ) : null}
                    {canDeleteRole ? (
                      <button
                        className="danger"
                        disabled={deletingRoleId === selectedRole.id || (selectedRole.usersCount || 0) > 0}
                        onClick={() => setRoleToDelete(selectedRole)}
                        type="button"
                      >
                        <XIcon size={15} /> {deletingRoleId === selectedRole.id ? "Deleting..." : "Delete"}
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </header>

            <div className="permission-table" role="table" aria-label={`${selectedRole?.displayName || "Role"} permissions`}>
              <div className="permission-row permission-head" role="row">
                <span>Module</span>
                {permissionActions.map((action) => <span key={action.key}>{action.label}</span>)}
              </div>
              {permissionGroups.map((module) => (
                <PermissionRow
                  key={module.key}
                  module={module}
                  matrix={selectedRoleMatrix}
                  canToggle={canEditRole}
                  selectedRole={selectedRole}
                  onToggle={toggleRolePermission}
                />
              ))}
            </div>
          </section>
        </section>

        <section className="role-assignments-panel">
          <header>
            <div>
              <h2>Assign roles to staff</h2>
              <p>Role assignments are managed separately from staff profile details.</p>
            </div>
          </header>

          <div className="role-assignment-table">
            <div className="role-assignment-row head">
              <span>Staff member</span>
              <span>Email</span>
              <span>Assigned role</span>
            </div>
            {staff.map((member) => (
              <div className="role-assignment-row" key={member.id}>
                <strong>
                  <i>{getInitials(member.displayName)}</i>
                  {member.displayName}
                </strong>
                <span>{member.email}</span>
                <label>
                  <ShieldIcon size={16} />
                  <select
                    disabled={assigningStaffId === member.id || !canAssignStaffRoles}
                    onChange={(event) => void assignRoleToStaff(member.id, event.target.value)}
                    value={member.builderRoleId || ""}
                  >
                    <option disabled value="">Select role</option>
                    {roles.map((role) => <option key={role.id} value={role.id}>{role.displayName || role.name}</option>)}
                  </select>
                </label>
              </div>
            ))}
          </div>
        </section>

        {isRoleModalOpen ? (
          <RoleModal
            mode={roleModalMode}
            onClose={() => setIsRoleModalOpen(false)}
            onSave={() => void saveRole()}
            permissions={permissionGroups}
            saving={savingRole}
            readOnly={roleModalMode === "create" ? !canCreateRole : !canEditRole}
            setForm={setRoleForm}
            role={roleForm}
            onToggle={toggleRolePermission}
          />
        ) : null}

        {roleToDelete ? (
          <DeleteRoleModal
            deleting={deletingRoleId === roleToDelete.id}
            onCancel={() => setRoleToDelete(null)}
            onConfirm={() => void deleteRole(roleToDelete.id)}
            roleName={roleToDelete.displayName || roleToDelete.name}
          />
        ) : null}
      </main>
    </BuilderShell>
  );
}

function PermissionRow({
  module,
  matrix,
  canToggle,
  selectedRole,
  onToggle,
}: {
  module: PermissionGroup;
  matrix: ReturnType<typeof createBlankPermissions>;
  canToggle: boolean;
  selectedRole: BuilderRole | null;
  onToggle: (moduleKey: BuilderModuleKey, action: BuilderPermissionAction) => void;
}) {
  return (
    <div className="permission-row" role="row">
      <div>
        <strong>{module.name}</strong>
        <small>{module.description}</small>
      </div>
      {permissionActions.map((action) => {
        const permission = module.permissions.find((item) => item.action === action.key);
        const isEnabled = permission ? Boolean(matrix[module.key][action.key]) : false;

        return (
          <button
            aria-label={permission ? `${isEnabled ? "Disable" : "Enable"} ${action.label} for ${module.name}` : `${action.label} unavailable for ${module.name}`}
            className={`${isEnabled ? "enabled" : ""}${permission ? "" : " missing"}`}
            disabled={!permission || !selectedRole || !canToggle}
            key={action.key}
            onClick={() => onToggle(module.key, action.key)}
            type="button"
          >
            {permission ? (isEnabled ? <CheckIcon size={15} /> : null) : "-"}
          </button>
        );
      })}
    </div>
  );
}

function RoleModal({
  mode,
  onClose,
  onSave,
  onToggle,
  permissions,
  saving,
  readOnly,
  setForm,
  role,
}: {
  mode: RoleModalMode;
  onClose: () => void;
  onSave: () => void;
  onToggle: (moduleKey: BuilderModuleKey, action: BuilderPermissionAction) => void;
  permissions: PermissionGroup[];
  saving: boolean;
  readOnly: boolean;
  setForm: Dispatch<SetStateAction<RoleFormState>>;
  role: RoleFormState;
}) {
  return (
    <div className="staff-modal-overlay" role="presentation">
      <section aria-labelledby="create-role-title" aria-modal="true" className="staff-modal role-create-modal" role="dialog">
        <header>
          <span><ShieldIcon size={27} /></span>
          <div>
            <h2 id="create-role-title">{mode === "create" ? "Create role" : "Edit role"}</h2>
            <p>Set the role name, display name, and module actions.</p>
          </div>
          <button aria-label="Close role modal" onClick={onClose} type="button"><XIcon size={22} /></button>
        </header>
        <div className="staff-modal-form">
          <label>
            <span>Role name</span>
            <div>
              <UserIcon size={18} />
              <input
                disabled={readOnly}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="e.g. estimator"
                value={role.name}
              />
            </div>
          </label>
          <label>
            <span>Display name</span>
            <div>
              <EditIcon size={18} />
              <input
                disabled={readOnly}
                onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))}
                placeholder="e.g. Estimator"
                value={role.displayName}
              />
            </div>
          </label>
          <label>
            <span>Description</span>
            <div>
              <EditIcon size={18} />
              <input
                disabled={readOnly}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Describe this role"
                value={role.description}
              />
            </div>
          </label>
          <div className="role-create-permissions">
            {permissions.map((module) => (
              <article key={module.key}>
                <strong>{module.name}</strong>
                <div>
                  {permissionActions.map((action) => {
                    const isAvailable = module.permissions.some((permission) => permission.action === action.key);
                    const isChecked = role.permissions[module.key][action.key];

                    return (
                      <button
                        className={isChecked ? "enabled" : ""}
                        disabled={!isAvailable || readOnly}
                        key={action.key}
                        onClick={() => onToggle(module.key, action.key)}
                        type="button"
                      >
                        <span>{isChecked ? <CheckIcon size={13} /> : isAvailable ? null : "-"}</span>
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </div>
        <footer>
          <button onClick={onClose} type="button">Cancel</button>
          <button disabled={saving || readOnly} onClick={onSave} type="button">
            <PlusIcon size={18} /> {saving ? "Saving..." : mode === "create" ? "Create role" : "Update role"}
          </button>
        </footer>
      </section>
    </div>
  );
}

function DeleteRoleModal({
  deleting,
  onCancel,
  onConfirm,
  roleName,
}: {
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  roleName: string;
}) {
  return (
    <div className="staff-modal-overlay delete-role-overlay" role="presentation">
      <section aria-labelledby="delete-role-title" aria-modal="true" className="staff-modal delete-role-modal" role="dialog">
        <header>
          <span className="delete-role-icon"><XIcon size={24} /></span>
          <div>
            <h2 id="delete-role-title">Delete role</h2>
            <p>This action cannot be undone.</p>
          </div>
          <button aria-label="Close delete role modal" onClick={onCancel} type="button"><XIcon size={22} /></button>
        </header>
        <div className="staff-modal-form delete-role-body">
          <p>Are you sure you want to delete <strong>{roleName}</strong>? Users assigned to this role must be reassigned first.</p>
        </div>
        <footer>
          <button onClick={onCancel} type="button">Cancel</button>
          <button disabled={deleting} onClick={onConfirm} type="button">
            <XIcon size={18} /> {deleting ? "Deleting..." : "Delete role"}
          </button>
        </footer>
      </section>
    </div>
  );
}

function getRoleAbbrev(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
