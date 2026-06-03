"use client";

import { useMemo, useState } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";
import { CheckIcon, EditIcon, PlusIcon, SearchIcon, TrashIcon, XIcon } from "@/components/icons";
import type { MasterConfig, MasterField, MasterRecord } from "@/components/builder/masters/data";

type FormState = Record<string, string>;

function createEmptyForm(fields: MasterField[]): FormState {
  return fields.reduce<FormState>((form, field) => {
    form[field.key] = field.options?.[0] ?? "";
    return form;
  }, {});
}

function recordToForm(fields: MasterField[], record: MasterRecord): FormState {
  return fields.reduce<FormState>((form, field) => {
    form[field.key] = String(record[field.key] ?? "");
    return form;
  }, {});
}

export function MasterCrudPage({ config }: { config: MasterConfig }) {
  const [rows, setRows] = useState<MasterRecord[]>(config.rows);
  const [form, setForm] = useState<FormState>(() => createEmptyForm(config.fields));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState(`${config.title} master ready.`);

  const visibleRows = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return rows;
    return rows.filter((row) => config.fields.some((field) => String(row[field.key] ?? "").toLowerCase().includes(search)));
  }, [config.fields, query, rows]);

  const activeCount = rows.filter((row) => row.status === "Active").length;
  const inactiveCount = rows.length - activeCount;

  function updateField(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(createEmptyForm(config.fields));
  }

  function saveRecord() {
    const name = form.name?.trim();
    const code = form.code?.trim();
    if (!name || !code) {
      setNotice("Name and code are required.");
      return;
    }

    if (editingId) {
      setRows((current) => current.map((row) => (row.id === editingId ? ({ ...row, ...form, name, code } as MasterRecord) : row)));
      setNotice(`${name} updated.`);
    } else {
      const nextId = Math.max(0, ...rows.map((row) => row.id)) + 1;
      setRows((current) => [{ id: nextId, ...form, name, code } as MasterRecord, ...current]);
      setNotice(`${name} created.`);
    }

    resetForm();
  }

  function editRecord(record: MasterRecord) {
    setEditingId(record.id);
    setForm(recordToForm(config.fields, record));
    setNotice(`Editing ${record.name}.`);
  }

  function deleteRecord(record: MasterRecord) {
    setRows((current) => current.filter((row) => row.id !== record.id));
    if (editingId === record.id) resetForm();
    setNotice(`${record.name} deleted.`);
  }

  return (
    <BuilderShell>
      <section className="builder-main masters-main">
        <header className="masters-header">
          <div>
            <p>{config.eyebrow}</p>
            <h1>{config.title}</h1>
            <span>{config.description}</span>
          </div>
          <button onClick={resetForm} type="button"><PlusIcon size={17} /> New {config.singular}</button>
        </header>

        <section className="masters-stats" aria-label={`${config.title} summary`}>
          <article><small>Total records</small><strong>{rows.length}</strong><span>All {config.singular} entries</span></article>
          <article><small>Active</small><strong>{activeCount}</strong><span>Available in dropdowns</span></article>
          <article><small>Inactive</small><strong>{inactiveCount}</strong><span>Hidden from new mapping</span></article>
        </section>

        <section className="masters-layout">
          <section className="master-form-panel">
            <header>
              <div>
                <h2>{editingId ? `Edit ${config.singular}` : `Create ${config.singular}`}</h2>
                <p>{editingId ? "Update details and save changes." : "Add a new master value for dropdowns and mapping."}</p>
              </div>
              {editingId ? <button aria-label="Cancel edit" onClick={resetForm} type="button"><XIcon size={16} /></button> : null}
            </header>

            <div className="master-form-grid">
              {config.fields.map((field) => (
                <label className={field.type === "textarea" ? "wide" : ""} key={field.key}>
                  <span>{field.label}{field.required ? " *" : ""}</span>
                  {field.type === "select" ? (
                    <select onChange={(event) => updateField(field.key, event.target.value)} value={form[field.key] ?? ""}>
                      {field.options?.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea onChange={(event) => updateField(field.key, event.target.value)} placeholder={field.placeholder} value={form[field.key] ?? ""} />
                  ) : (
                    <input onChange={(event) => updateField(field.key, event.target.value)} placeholder={field.placeholder} value={form[field.key] ?? ""} />
                  )}
                </label>
              ))}
            </div>

            <footer>
              <button onClick={resetForm} type="button">Clear</button>
              <button className="primary" onClick={saveRecord} type="button"><CheckIcon size={16} /> {editingId ? "Save changes" : "Create record"}</button>
            </footer>
          </section>

          <section className="master-list-panel">
            <header>
              <div>
                <h2>{config.title} list</h2>
                <p>{visibleRows.length} records found</p>
              </div>
              <label><SearchIcon size={16} /><input onChange={(event) => setQuery(event.target.value)} placeholder="Search..." value={query} /></label>
            </header>

            <div className="master-table">
              <div className="master-row master-head">
                {config.fields.slice(0, 4).map((field) => <span key={field.key}>{field.label}</span>)}
                <span>Actions</span>
              </div>
              {visibleRows.map((row) => (
                <div className="master-row" key={row.id}>
                  {config.fields.slice(0, 4).map((field) => (
                    <span key={field.key} className={field.key === "status" ? `master-status ${String(row[field.key]).toLowerCase()}` : ""}>
                      {String(row[field.key] ?? "-")}
                    </span>
                  ))}
                  <span className="master-actions">
                    <button aria-label={`Edit ${row.name}`} onClick={() => editRecord(row)} type="button"><EditIcon size={14} /></button>
                    <button aria-label={`Delete ${row.name}`} onClick={() => deleteRecord(row)} type="button"><TrashIcon size={14} /></button>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </section>

        <p className="masters-notice" role="status">{notice}</p>
      </section>
    </BuilderShell>
  );
}
