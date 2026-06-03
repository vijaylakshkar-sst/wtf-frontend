"use client";

import { useState } from "react";
import { EditIcon, MailIcon, PlusIcon, ShieldIcon, UserIcon, UsersIcon, XIcon } from "@/components/icons";
import { BuilderShell } from "@/components/builder/builder-shell";

type StaffRole = "Admin" | "Sales" | "Colour" | "Marketing";
type StaffMember = {
  id: number;
  name: string;
  email: string;
  role: StaffRole;
};

const staffRoles: StaffRole[] = ["Admin", "Sales", "Colour", "Marketing"];

const initialStaff: StaffMember[] = [
  { id: 1, name: "Jane Smith", email: "jane@acme.com", role: "Admin" },
  { id: 2, name: "Marcus Lee", email: "marcus@acme.com", role: "Sales" },
  { id: 3, name: "Priya Nair", email: "priya@acme.com", role: "Colour" },
  { id: 4, name: "Tom Walsh", email: "tom@acme.com", role: "Marketing" },
];

export function BuilderStaffPage() {
  const [staff, setStaff] = useState(initialStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function addStaffMember(member: Pick<StaffMember, "name" | "email" | "role">) {
    setStaff((current) => [
      ...current,
      {
        ...member,
        id: Date.now(),
      },
    ]);
    setIsModalOpen(false);
  }

  return (
    <BuilderShell>
      <main className="builder-main staff-main">
        <header className="staff-page-header">
          <div>
            <p>Home / Staff management</p>
            <h1>Staff Management</h1>
            <span>Add staff members and assign an existing role.</span>
          </div>
        </header>

        <section className="staff-card">
          <div className="staff-card-header">
            <span className="staff-card-icon"><UsersIcon size={31} /></span>
            <div>
              <h2>Staff management</h2>
              <p>{staff.length} team members - Manage staff access assignments</p>
            </div>
            <button className="staff-add-button" onClick={() => setIsModalOpen(true)} type="button"><PlusIcon size={18} /> Add staff</button>
          </div>

          <div className="staff-table" role="table" aria-label="Staff members">
            <div className="staff-row staff-head" role="row">
              <span>Staff member</span><span>Role</span><span>Email</span><span>Actions</span>
            </div>
            {staff.map((member) => (
              <div className="staff-row" key={member.id} role="row">
                <strong><i>{getInitials(member.name)}</i>{member.name}</strong>
                <span className={`staff-role ${member.role.toLowerCase()}`}>{member.role}</span>
                <span>{member.email}</span>
                <button aria-label={`Edit ${member.name}`} className="staff-edit-button" type="button"><EditIcon size={18} /></button>
              </div>
            ))}
          </div>

          <aside className="staff-permissions-note">
            <span><ShieldIcon size={27} /></span>
            <div><strong>Role access</strong><p>Create and configure role permissions from the Roles & Permissions menu.</p></div>
          </aside>
        </section>

        {isModalOpen ? <AddStaffModal onClose={() => setIsModalOpen(false)} onSubmit={addStaffMember} /> : null}
      </main>
    </BuilderShell>
  );
}

function AddStaffModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (member: Pick<StaffMember, "name" | "email" | "role">) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("Sales");
  const canSubmit = name.trim().length > 0 && email.trim().length > 0;

  return (
    <div className="staff-modal-overlay" role="presentation">
      <section aria-labelledby="staff-modal-title" aria-modal="true" className="staff-modal" role="dialog">
        <header>
          <span><UserIcon size={27} /></span>
          <div><h2 id="staff-modal-title">Add staff</h2><p>Invite a team member and assign their role.</p></div>
          <button aria-label="Close add staff modal" onClick={onClose} type="button"><XIcon size={22} /></button>
        </header>
        <div className="staff-modal-form">
          <label><span>Name</span><div><UserIcon size={18} /><input onChange={(event) => setName(event.target.value)} placeholder="e.g. Alex Morgan" value={name} /></div></label>
          <label><span>Email</span><div><MailIcon size={18} /><input onChange={(event) => setEmail(event.target.value)} placeholder="alex@acme.com" type="email" value={email} /></div></label>
          <label><span>Role</span><div><ShieldIcon size={18} /><select onChange={(event) => setRole(event.target.value as StaffRole)} value={role}>{staffRoles.map((item) => <option key={item}>{item}</option>)}</select></div></label>
        </div>
        <footer>
          <button onClick={onClose} type="button">Cancel</button>
          <button disabled={!canSubmit} onClick={() => onSubmit({ name: name.trim(), email: email.trim(), role })} type="button"><PlusIcon size={18} /> Add staff</button>
        </footer>
      </section>
    </div>
  );
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
