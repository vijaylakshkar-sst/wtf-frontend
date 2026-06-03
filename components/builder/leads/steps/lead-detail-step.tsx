import { LeadDetailPanel } from "@/components/builder/leads/lead-detail-panel";
import type { Lead } from "@/components/builder/leads/data";

export function LeadDetailStep({ lead }: { lead: Lead }) {
  return <div className="lead-detail-full"><LeadDetailPanel lead={lead} /></div>;
}
