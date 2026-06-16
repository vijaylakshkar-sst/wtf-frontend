import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function Field({ label, children, className = "" }: FieldProps) {
  return (
    <label className={`create-home-field ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function ToggleRow({
  title,
  note,
  checked = false,
  onToggle,
}: {
  title: string;
  note?: string;
  checked?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="create-home-toggle-row">
      <div>
        <strong>{title}</strong>
        {note ? <small>{note}</small> : null}
      </div>
      <button
        aria-pressed={checked}
        aria-label={title}
        className={`create-home-switch ${checked ? "is-on" : ""}`}
        onClick={onToggle}
        type="button"
      >
        <i aria-hidden="true" />
      </button>
    </div>
  );
}

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="create-home-section-card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
