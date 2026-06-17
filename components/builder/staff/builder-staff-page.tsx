"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { EditIcon, PlusIcon, ShieldIcon, TrashIcon, UsersIcon, XIcon } from "@/components/icons";
import { BuilderShell } from "@/components/builder/builder-shell";
import { useToast } from "@/components/toast-provider";
import { builderAccessApi, getErrorMessage, type BuilderRole, type BuilderStaffMember } from "@/lib/api";
import { getStoredAuthUser } from "@/lib/api";
import { hasAnyBuilderPermission } from "@/lib/builder-access";

type StaffRow = BuilderStaffMember & { displayName: string };
type StaffModalMode = "create" | "edit";
type StaffStatus = "active" | "pending" | "suspended";

type StaffFormState = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  status: StaffStatus;
  builderRoleId: string;
};

const createEmptyStaffForm = (): StaffFormState => ({
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  password: "",
  status: "active",
  builderRoleId: "",
});

export function BuilderStaffPage() {
  const { showToast } = useToast();
  const user = getStoredAuthUser();
  const canCreateStaff = hasAnyBuilderPermission(user, ["staff.create"]);
  const canEditStaff = hasAnyBuilderPermission(user, ["staff.edit"]);
  const canDeleteStaff = hasAnyBuilderPermission(user, ["staff.delete"]);
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [roles, setRoles] = useState<BuilderRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savingStaff, setSavingStaff] = useState(false);
  const [deletingStaffId, setDeletingStaffId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<StaffModalMode>("create");
  const [selectedStaff, setSelectedStaff] = useState<StaffRow | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<StaffRow | null>(null);
  const [form, setForm] = useState<StaffFormState>(createEmptyStaffForm());

  const assignedCount = useMemo(
    () => staff.filter((member) => Boolean(member.builderRoleId)).length,
    [staff],
  );
  const activeCount = useMemo(
    () => staff.filter((member) => member.status === "active").length,
    [staff],
  );

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    try {
      const [rolesResponse, staffResponse] = await Promise.all([
        builderAccessApi.listRoles(),
        builderAccessApi.listStaff(),
      ]);

      setRoles(rolesResponse.data.roles);
      setStaff(
        staffResponse.data.staff.map((member) => ({
          ...member,
          displayName: [member.firstName, member.lastName].filter(Boolean).join(" "),
        })),
      );
    } catch (loadError) {
      const message = getErrorMessage(loadError, "Staff could not be loaded.");
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedStaff(null);
    setForm(createEmptyStaffForm());
    setIsModalOpen(true);
  }

  function openEditModal(member: StaffRow) {
    setModalMode("edit");
    setSelectedStaff(member);
    setForm({
      email: member.email,
      firstName: member.firstName,
      lastName: member.lastName || "",
      phone: member.phone || "",
      password: "",
      status: (member.status as StaffStatus) || "active",
      builderRoleId: member.builderRoleId || "",
    });
    setIsModalOpen(true);
  }

  async function refreshData() {
    setIsRefreshing(true);

    try {
      await loadData();
      showToast("Staff list refreshed.", "success");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function saveStaff() {
    const payload = {
      email: form.email.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      password: form.password.trim(),
      status: form.status,
      builderRoleId: form.builderRoleId || null,
    };

    if (modalMode === "create" && !payload.password) {
      showToast("Password is required for new staff.", "error");
      return;
    }

    if (!payload.email || !payload.firstName) {
      showToast("First name and email are required.", "error");
      return;
    }

    setSavingStaff(true);

    try {
      if (modalMode === "create") {
        await builderAccessApi.createStaff(payload);
      } else if (selectedStaff) {
        await builderAccessApi.updateStaff(selectedStaff.id, payload);
      }

      await loadData();
      setIsModalOpen(false);
      setSelectedStaff(null);
      showToast(modalMode === "create" ? "Staff created successfully." : "Staff updated successfully.", "success");
    } catch (saveError) {
      showToast(getErrorMessage(saveError, "Unable to save staff."), "error");
    } finally {
      setSavingStaff(false);
    }
  }

  async function deleteStaff() {
    if (!staffToDelete) {
      return;
    }

    setDeletingStaffId(staffToDelete.id);

    try {
      await builderAccessApi.deleteStaff(staffToDelete.id);
      await loadData();
      setStaffToDelete(null);
      showToast("Staff deleted successfully.", "success");
    } catch (deleteError) {
      showToast(getErrorMessage(deleteError, "Unable to delete staff."), "error");
    } finally {
      setDeletingStaffId(null);
    }
  }

  return (
    <BuilderShell>
      <main className="builder-main staff-main">
        <header className="staff-page-header">
          <div>
            <p>Home / Staff management</p>
            <h1>Staff Management</h1>
            <span>Create builder staff, assign roles, and manage login access from one place.</span>
          </div>
        </header>

        {isLoading ? <p className="staff-loading">Loading staff members...</p> : null}
        {error ? <p className="staff-error">{error}</p> : null}

        <section className="staff-card">
          <div className="staff-card-header">
            <span className="staff-card-icon"><UsersIcon size={31} /></span>
            <div>
              <h2>Staff management</h2>
              <p>{staff.length} team members - {assignedCount} assigned roles - {activeCount} active</p>
            </div>
            <div className="staff-card-actions">
              <button className="staff-add-button ghost" onClick={() => void refreshData()} type="button">
                <ShieldIcon size={18} /> {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
              {canCreateStaff ? (
                <button className="staff-add-button" onClick={openCreateModal} type="button">
                  <PlusIcon size={18} /> Add staff
                </button>
              ) : null}
            </div>
          </div>

          <div className="staff-table" role="table" aria-label="Staff members">
            <div className="staff-row staff-head" role="row">
              <span>Staff member</span>
              <span>Email</span>
              <span>Phone</span>
              <span>Role</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {staff.map((member) => (
              <div className="staff-row" key={member.id} role="row">
                <strong>
                  <i>{getInitials(member.displayName)}</i>
                  <span>
                    {member.displayName || "Unnamed staff"}
                    {member.isBuilderOwner ? <small className="staff-owner-badge">Owner</small> : null}
                  </span>
                </strong>
                <span className="staff-cell-muted">{member.email}</span>
                <span className="staff-cell-muted">{member.phone || "-"}</span>
                <span className={`staff-role ${getRoleClass(member.builderRole?.name || "")}`}>
                  {member.builderRole?.displayName || member.builderRole?.name || "Unassigned"}
                </span>
                <span className={`staff-status ${member.status}`}>{member.status}</span>
                <div className="staff-action-buttons">
                  <button
                    aria-label={`Edit ${member.displayName || member.email}`}
                    disabled={Boolean(member.isBuilderOwner) || !canEditStaff}
                    onClick={() => openEditModal(member)}
                    title={member.isBuilderOwner ? "Owner profile cannot be edited here" : !canEditStaff ? "No permission to edit staff" : "Edit staff"}
                    type="button"
                  >
                    <EditIcon size={15} />
                  </button>
                  {canDeleteStaff ? (
                    <button
                      aria-label={`Delete ${member.displayName || member.email}`}
                      className="danger"
                      disabled={Boolean(member.isBuilderOwner)}
                      onClick={() => setStaffToDelete(member)}
                      title={member.isBuilderOwner ? "Owner cannot be deleted" : "Delete staff"}
                      type="button"
                    >
                      <TrashIcon size={15} />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <aside className="staff-permissions-note">
            <span><ShieldIcon size={27} /></span>
            <div>
              <strong>Role access</strong>
              <p>Manage permissions from the Roles & Permissions menu. This page creates and maintains staff accounts only.</p>
            </div>
          </aside>
        </section>

        {isModalOpen ? (
          <StaffModal
            form={form}
            mode={modalMode}
            onCancel={() => setIsModalOpen(false)}
            onChange={setForm}
            onSave={() => void saveStaff()}
            roles={roles}
            saving={savingStaff}
            readOnly={!canEditStaff && modalMode === "edit"}
          />
        ) : null}

        {staffToDelete ? (
          <DeleteStaffModal
            deleting={deletingStaffId === staffToDelete.id}
            member={staffToDelete}
            onCancel={() => setStaffToDelete(null)}
            onConfirm={() => void deleteStaff()}
          />
        ) : null}
      </main>
    </BuilderShell>
  );
}

function StaffModal({
  form,
  mode,
  onCancel,
  onChange,
  onSave,
  roles,
  saving,
  readOnly,
}: {
  form: StaffFormState;
  mode: StaffModalMode;
  onCancel: () => void;
  onChange: Dispatch<SetStateAction<StaffFormState>>;
  onSave: () => void;
  roles: BuilderRole[];
  saving: boolean;
  readOnly: boolean;
}) {
  return (
    <div className="staff-modal-overlay" role="presentation">
      <section aria-labelledby="staff-modal-title" aria-modal="true" className="staff-modal staff-edit-modal" role="dialog">
        <header>
          <span><UsersIcon size={24} /></span>
          <div>
            <h2 id="staff-modal-title">{mode === "create" ? "Add staff" : "Edit staff"}</h2>
            <p>{mode === "create" ? "Create a new staff account and assign a builder role." : "Update staff details, status, and role."}</p>
          </div>
          <button aria-label="Close staff modal" onClick={onCancel} type="button"><XIcon size={22} /></button>
        </header>

        <div className="staff-modal-form staff-edit-form">
          <label>
            <span>Email</span>
            <div>
                <UsersIcon size={18} />
              <input
                disabled={readOnly}
                onChange={(event) => onChange((current) => ({ ...current, email: event.target.value }))}
                placeholder="e.g. staff@builder.com"
                value={form.email}
              />
            </div>
          </label>

          <label>
            <span>First name</span>
            <div>
              <EditIcon size={18} />
              <input
                disabled={readOnly}
                onChange={(event) => onChange((current) => ({ ...current, firstName: event.target.value }))}
                placeholder="e.g. Rahul"
                value={form.firstName}
              />
            </div>
          </label>

          <label>
            <span>Last name</span>
            <div>
              <EditIcon size={18} />
              <input
                disabled={readOnly}
                onChange={(event) => onChange((current) => ({ ...current, lastName: event.target.value }))}
                placeholder="e.g. Sharma"
                value={form.lastName}
              />
            </div>
          </label>

          <label>
            <span>Phone</span>
            <div>
              <ShieldIcon size={18} />
              <input
                disabled={readOnly}
                onChange={(event) => onChange((current) => ({ ...current, phone: event.target.value }))}
                placeholder="e.g. 9876543210"
                value={form.phone}
              />
            </div>
          </label>

          <label>
            <span>Password {mode === "edit" ? "(optional)" : ""}</span>
            <div>
              <ShieldIcon size={18} />
              <input
                disabled={readOnly}
                onChange={(event) => onChange((current) => ({ ...current, password: event.target.value }))}
                placeholder={mode === "create" ? "Set login password" : "Leave blank to keep current password"}
                type="password"
                value={form.password}
              />
            </div>
          </label>

          <label>
            <span>Role</span>
            <div>
              <ShieldIcon size={18} />
              <select
                disabled={readOnly}
                onChange={(event) => onChange((current) => ({ ...current, builderRoleId: event.target.value }))}
                value={form.builderRoleId}
              >
                <option value="">No role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.displayName || role.name}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label>
            <span>Status</span>
            <div>
              <ShieldIcon size={18} />
              <select
                disabled={readOnly}
                onChange={(event) => onChange((current) => ({ ...current, status: event.target.value as StaffStatus }))}
                value={form.status}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </label>
        </div>

        <footer>
          <button onClick={onCancel} type="button">Cancel</button>
          <button disabled={saving || readOnly} onClick={onSave} type="button">
            <PlusIcon size={18} /> {saving ? "Saving..." : mode === "create" ? "Create staff" : "Update staff"}
          </button>
        </footer>
      </section>
    </div>
  );
}

function DeleteStaffModal({
  deleting,
  member,
  onCancel,
  onConfirm,
}: {
  deleting: boolean;
  member: StaffRow;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="staff-modal-overlay delete-role-overlay" role="presentation">
      <section aria-labelledby="delete-staff-title" aria-modal="true" className="staff-modal delete-role-modal" role="dialog">
        <header>
          <span className="delete-role-icon"><XIcon size={24} /></span>
          <div>
            <h2 id="delete-staff-title">Delete staff</h2>
            <p>This will remove the staff account from the builder workspace.</p>
          </div>
          <button aria-label="Close delete staff modal" onClick={onCancel} type="button"><XIcon size={22} /></button>
        </header>
        <div className="staff-modal-form delete-role-body">
          <p>
            Are you sure you want to delete <strong>{member.displayName || member.email}</strong>? This action can be reversed only by recreating the account.
          </p>
        </div>
        <footer>
          <button onClick={onCancel} type="button">Cancel</button>
          <button disabled={deleting} onClick={onConfirm} type="button">
            <XIcon size={18} /> {deleting ? "Deleting..." : "Delete staff"}
          </button>
        </footer>
      </section>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRoleClass(roleName: string) {
  const normalized = roleName.toLowerCase();

  if (normalized.includes("admin")) return "admin";
  if (normalized.includes("sales")) return "sales";
  if (normalized.includes("colour") || normalized.includes("color")) return "colour";
  if (normalized.includes("marketing")) return "marketing";

  return "";
}
