import { LeadDetailPanel } from "@/components/builder/leads/lead-detail-panel";
import type { Lead } from "@/components/builder/leads/data";

export function LeadDetailStep({ lead, onBack, onExport, onSave }: { lead: Lead; onBack: () => void; onExport: () => void; onSave: () => void }) {
  return <div className="lead-detail-full"><LeadDetailPanel lead={lead} onBack={onBack} onExport={onExport} onSave={onSave} /></div>;
}
