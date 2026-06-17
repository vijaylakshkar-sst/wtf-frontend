"use client";

import type { ReactNode } from "react";
import { CheckIcon, XIcon } from "@/components/icons";

type AdminConfirmationModalProps = {
  confirmLabel: string;
  icon?: ReactNode;
  isLoading?: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
  variant?: "danger" | "primary";
};

export function AdminConfirmationModal({
  confirmLabel,
  icon,
  isLoading = false,
  message,
  onCancel,
  onConfirm,
  open,
  title,
  variant = "danger",
}: AdminConfirmationModalProps) {
  if (!open) {
    return null;
  }

  const fallbackIcon = variant === "danger" ? <XIcon size={22} /> : <CheckIcon size={22} />;

  return (
    <div className="admin-confirm-overlay" onClick={onCancel} role="presentation">
      <section
        aria-labelledby="admin-confirm-title"
        aria-modal="true"
        className="admin-confirm-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header>
          <span>{icon || fallbackIcon}</span>
          <div>
            <h2 id="admin-confirm-title">{title}</h2>
            <p>{message}</p>
          </div>
        </header>
        <footer>
          <button disabled={isLoading} onClick={onCancel} type="button">
            Cancel
          </button>
          <button className={variant === "danger" ? "danger" : ""} disabled={isLoading} onClick={onConfirm} type="button">
            {isLoading ? "Working..." : confirmLabel}
          </button>
        </footer>
      </section>
    </div>
  );
}
