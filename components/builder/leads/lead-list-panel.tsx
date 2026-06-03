import { useMemo, useState } from "react";
import { leadStats, type Lead } from "@/components/builder/leads/data";
import { LeadWindow } from "@/components/builder/leads/lead-window";

const pageSize = 5;

export function LeadListPanel({ activeLeadId, leads, onExport, onSelectLead }: { activeLeadId?: string; leads: Lead[]; onExport: () => void; onSelectLead: (lead: Lead) => void }) {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(leads.length / pageSize);
  const pagedLeads = useMemo(() => leads.slice((page - 1) * pageSize, page * pageSize), [leads, page]);

  return (
    <LeadWindow path="buildportal.com.au/leads">
      <div className="lead-panel-heading"><div><h2>Leads</h2><p>24 leads - 7 new this week</p></div><button onClick={onExport} type="button">Export</button></div>
      <div className="lead-stat-grid">{leadStats.map((stat) => <article key={stat.label}><small>{stat.label}</small><strong>{stat.value}</strong></article>)}</div>
      <div className="lead-table">
        <div className="lead-table-row head"><span>Name</span><span>Contact</span><span>Display home</span><span>Saves</span><span>Selections</span><span>Status</span></div>
        {pagedLeads.map((lead) => <button className={`lead-table-row ${lead.id === activeLeadId ? "active" : ""}`} key={lead.id} onClick={() => onSelectLead(lead)} type="button"><strong>{lead.name}</strong><span>{lead.email}</span><span>{lead.displayHome}</span><span>{lead.saves}</span><em className={lead.selections.toLowerCase()}>{lead.selections}</em><em className={lead.status.toLowerCase()}>{lead.status}</em></button>)}
      </div>
      <footer className="lead-pagination">
        <button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">Previous</button>
        <span>Page {page} of {pageCount}</span>
        <button disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button">Next</button>
      </footer>
    </LeadWindow>
  );
}
