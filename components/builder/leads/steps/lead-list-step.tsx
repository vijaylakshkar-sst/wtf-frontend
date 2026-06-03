import { LeadListPanel } from "@/components/builder/leads/lead-list-panel";
import type { Lead } from "@/components/builder/leads/data";

export function LeadListStep({ activeLead, leads, onExport, onSelectLead }: { activeLead: Lead | null; leads: Lead[]; onExport: () => void; onSelectLead: (lead: Lead) => void }) {
  return <div className="lead-list-full"><LeadListPanel activeLeadId={activeLead?.id} leads={leads} onExport={onExport} onSelectLead={onSelectLead} /></div>;
}
