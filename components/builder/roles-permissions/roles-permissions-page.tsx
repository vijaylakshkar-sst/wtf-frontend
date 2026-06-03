"use client";

import { useMemo, useState } from "react";
import { CheckIcon, EditIcon, PlusIcon, ShieldIcon, UserIcon, UsersIcon, XIcon } from "@/components/icons";
import { BuilderShell } from "@/components/builder/builder-shell";
import {
  BuilderRole,
  ModuleKey,
  PermissionAction,
  RolePermissions,
  createBlankPermissions,
  initialAssignments,
  initialRoles,
  permissionActions,
  permissionModules,
} from "@/components/builder/roles-permissions/data";

type CreateRoleInput = {
  name: string;
  description: string;
  permissions: RolePermissions;
};

export function RolesPermissionsPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [selectedRoleId, setSelectedRoleId] = useState(initialRoles[0].id);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? roles[0];

  const permissionSummary = useMemo(() => {
    const enabled = roles.reduce((total, role) => total + countEnabledPermissions(role.permissions), 0);
    const available = roles.length * permissionModules.length * permissionActions.length;
    return { enabled, available };
  }, [roles]);

  function createRole(role: CreateRoleInput) {
    const nextRole: BuilderRole = {
      ...role,
      id: Date.now(),
      users: 0,
    };

    setRoles((current) => [...current, nextRole]);
    setSelectedRoleId(nextRole.id);
    setIsCreateModalOpen(false);
  }

  function updatePermission(roleId: number, moduleKey: ModuleKey, action: PermissionAction) {
    setRoles((current) => current.map((role) => {
      if (role.id !== roleId) {
        return role;
      }

      return {
        ...role,
        permissions: {
          ...role.permissions,
          [moduleKey]: {
            ...role.permissions[moduleKey],
            [action]: !role.permissions[moduleKey][action],
          },
        },
      };
    }));
  }

  function assignRole(staffId: number, roleId: number) {
    const previousRoleId = assignments.find((assignment) => assignment.id === staffId)?.roleId;

    setAssignments((current) => current.map((assignment) => assignment.id === staffId ? { ...assignment, roleId } : assignment));
    setRoles((current) => current.map((role) => {
      if (role.id === previousRoleId && previousRoleId !== roleId) {
        return { ...role, users: Math.max(0, role.users - 1) };
      }

      if (role.id === roleId && previousRoleId !== roleId) {
        return { ...role, users: role.users + 1 };
      }

      return role;
    }));
  }

  return (
    <BuilderShell>
      <main className="builder-main roles-main">
        <header className="roles-header">
          <div>
            <p>Home / Roles & Permissions</p>
            <h1>Roles & Permissions</h1>
            <span>Create roles, assign users, and control module-level actions.</span>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} type="button"><PlusIcon size={18} /> Create role</button>
        </header>

        <section className="roles-stats">
          <article><span><ShieldIcon size={22} /></span><div><small>Total roles</small><strong>{roles.length}</strong></div></article>
          <article><span><UsersIcon size={22} /></span><div><small>Assigned users</small><strong>{assignments.length}</strong></div></article>
          <article><span><CheckIcon size={22} /></span><div><small>Enabled permissions</small><strong>{permissionSummary.enabled}</strong></div></article>
          <article><span><EditIcon size={22} /></span><div><small>Permission coverage</small><strong>{Math.round((permissionSummary.enabled / permissionSummary.available) * 100)}%</strong></div></article>
        </section>

        <section className="roles-layout">
          <aside className="roles-list-panel">
            <header>
              <h2>Role library</h2>
              <p>Select a role to configure permissions.</p>
            </header>
            <div className="roles-list">
              {roles.map((role) => (
                <button className={role.id === selectedRole.id ? "active" : ""} key={role.id} onClick={() => setSelectedRoleId(role.id)} type="button">
                  <span>{role.name.slice(0, 2).toUpperCase()}</span>
                  <div>
                    <strong>{role.name}</strong>
                    <small>{role.users} assigned users</small>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="permission-panel">
            <header>
              <div>
                <h2>{selectedRole.name}</h2>
                <p>{selectedRole.description}</p>
              </div>
              <span>{countEnabledPermissions(selectedRole.permissions)} permissions enabled</span>
            </header>

            <div className="permission-table" role="table" aria-label={`${selectedRole.name} permissions`}>
              <div className="permission-row permission-head" role="row">
                <span>Module</span>
                {permissionActions.map((action) => <span key={action.key}>{action.label}</span>)}
              </div>
              {permissionModules.map((module) => (
                <div className="permission-row" key={module.key} role="row">
                  <div><strong>{module.name}</strong><small>{module.description}</small></div>
                  {permissionActions.map((action) => {
                    const isEnabled = selectedRole.permissions[module.key][action.key];

                    return (
                      <button
                        aria-label={`${isEnabled ? "Disable" : "Enable"} ${action.label} for ${module.name}`}
                        className={isEnabled ? "enabled" : ""}
                        key={action.key}
                        onClick={() => updatePermission(selectedRole.id, module.key, action.key)}
                        type="button"
                      >
                        {isEnabled ? <CheckIcon size={15} /> : null}
                      </button>
                    );
                  })}
                </div>
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
            <div className="role-assignment-row head"><span>Staff member</span><span>Email</span><span>Assigned role</span></div>
            {assignments.map((assignment) => (
              <div className="role-assignment-row" key={assignment.id}>
                <strong><i>{getInitials(assignment.name)}</i>{assignment.name}</strong>
                <span>{assignment.email}</span>
                <label>
                  <ShieldIcon size={16} />
                  <select onChange={(event) => assignRole(assignment.id, Number(event.target.value))} value={assignment.roleId}>
                    {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                  </select>
                </label>
              </div>
            ))}
          </div>
        </section>

        {isCreateModalOpen ? <CreateRoleModal existingRoleNames={roles.map((role) => role.name)} onClose={() => setIsCreateModalOpen(false)} onSubmit={createRole} /> : null}
      </main>
    </BuilderShell>
  );
}

function CreateRoleModal({ existingRoleNames, onClose, onSubmit }: { existingRoleNames: string[]; onClose: () => void; onSubmit: (role: CreateRoleInput) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState(createBlankPermissions);
  const trimmedName = name.trim();
  const roleExists = existingRoleNames.some((roleName) => roleName.toLowerCase() === trimmedName.toLowerCase());
  const canSubmit = trimmedName.length > 0 && !roleExists;

  function togglePermission(moduleKey: ModuleKey, action: PermissionAction) {
    setPermissions((current) => ({
      ...current,
      [moduleKey]: {
        ...current[moduleKey],
        [action]: !current[moduleKey][action],
      },
    }));
  }

  return (
    <div className="staff-modal-overlay" role="presentation">
      <section aria-labelledby="create-role-title" aria-modal="true" className="staff-modal role-create-modal" role="dialog">
        <header>
          <span><ShieldIcon size={27} /></span>
          <div><h2 id="create-role-title">Create role</h2><p>Set the role name and module actions.</p></div>
          <button aria-label="Close create role modal" onClick={onClose} type="button"><XIcon size={22} /></button>
        </header>
        <div className="staff-modal-form">
          <label><span>Role name</span><div><UserIcon size={18} /><input onChange={(event) => setName(event.target.value)} placeholder="e.g. Estimator" value={name} /></div></label>
          <label><span>Description</span><div><EditIcon size={18} /><input onChange={(event) => setDescription(event.target.value)} placeholder="Describe this role" value={description} /></div></label>
          <div className="role-create-permissions">
            {permissionModules.map((module) => (
              <article key={module.key}>
                <strong>{module.name}</strong>
                <div>
                  {permissionActions.map((action) => (
                    <button className={permissions[module.key][action.key] ? "enabled" : ""} key={action.key} onClick={() => togglePermission(module.key, action.key)} type="button">
                      <span>{permissions[module.key][action.key] ? <CheckIcon size={13} /> : null}</span>{action.label}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
          {roleExists ? <p className="role-form-error">Role name already exists.</p> : null}
        </div>
        <footer>
          <button onClick={onClose} type="button">Cancel</button>
          <button disabled={!canSubmit} onClick={() => onSubmit({ name: trimmedName, description: description.trim() || "Custom builder portal role.", permissions })} type="button"><PlusIcon size={18} /> Create role</button>
        </footer>
      </section>
    </div>
  );
}

function countEnabledPermissions(permissions: RolePermissions) {
  return permissionModules.reduce((total, module) => (
    total + permissionActions.filter((action) => permissions[module.key][action.key]).length
  ), 0);
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
