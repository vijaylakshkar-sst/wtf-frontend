import { LeadDetailPanel } from "@/components/builder/leads/lead-detail-panel";
import { LeadListPanel } from "@/components/builder/leads/lead-list-panel";
import type { Lead } from "@/components/builder/leads/data";

export function LeadListDetailStep({ activeLead, leads, onExport, onSelectLead }: { activeLead: Lead | null; leads: Lead[]; onExport: () => void; onSelectLead: (lead: Lead) => void }) {
  return (
    <div className={`leads-flow-grid ${activeLead ? "" : "list-only"}`}>
      <LeadListPanel activeLeadId={activeLead?.id} leads={leads} onExport={onExport} onSelectLead={onSelectLead} />
      {activeLead ? <LeadDetailPanel lead={activeLead} /> : null}
    </div>
  );
}
