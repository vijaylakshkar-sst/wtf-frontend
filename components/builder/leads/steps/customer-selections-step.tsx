import { CustomerSelectionsPanel } from "@/components/builder/leads/customer-selections-panel";
import type { Lead } from "@/components/builder/leads/data";

export function CustomerSelectionsStep({ lead, onExport, onSave, onSubmit }: { lead: Lead; onExport: () => void; onSave: () => void; onSubmit: () => void }) {
  return <div className="customer-selection-full"><CustomerSelectionsPanel lead={lead} onExport={onExport} onSave={onSave} onSubmit={onSubmit} /></div>;
}
