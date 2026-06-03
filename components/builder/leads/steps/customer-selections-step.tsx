import { CustomerSelectionsPanel } from "@/components/builder/leads/customer-selections-panel";
import type { Lead } from "@/components/builder/leads/data";

export function CustomerSelectionsStep({ lead, onSave, onSubmit }: { lead: Lead; onSave: () => void; onSubmit: () => void }) {
  return <div className="customer-selection-full"><CustomerSelectionsPanel lead={lead} onSave={onSave} onSubmit={onSubmit} /></div>;
}
