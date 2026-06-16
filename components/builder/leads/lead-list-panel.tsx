import { useEffect, useMemo, useState } from "react";
import { leadStats, type Lead, type LeadStatus } from "@/components/builder/leads/data";
import { LeadWindow } from "@/components/builder/leads/lead-window";

const pageSize = 5;
const statusOptions: LeadStatus[] = ["New", "Contacted", "Approved"];

export function LeadListPanel({ activeLeadId, leads, onExport, onSelectLead }: { activeLeadId?: string; leads: Lead[]; onExport: () => void; onSelectLead: (lead: Lead) => void }) {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(leads);
  const pageCount = Math.ceil(leads.length / pageSize);
  const pagedLeads = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page]);

  useEffect(() => {
    setRows(leads);
  }, [leads]);

  function updateStatus(leadId: string, status: LeadStatus) {
    setRows((current) => current.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)));
  }

  return (
    <LeadWindow path="buildportal.com.au/leads">
      <div className="lead-panel-heading"><div><h2>Leads</h2><p>24 leads - 7 new this week</p></div><button onClick={onExport} type="button">Export</button></div>
      <div className="lead-stat-grid">{leadStats.map((stat) => <article key={stat.label}><small>{stat.label}</small><strong>{stat.value}</strong></article>)}</div>
      <div className="lead-table">
        <div className="lead-table-row head"><span>Sr. No.</span><span>Name</span><span>Contact</span><span>Display home</span><span>Saves</span><span>Choice</span><span>Status</span></div>
        {pagedLeads.map((lead, index) => {
          const rowNumber = (page - 1) * pageSize + index + 1;

          return (
            <div className={`lead-table-row ${lead.id === activeLeadId ? "active" : ""}`} key={lead.id}>
              <span className="lead-row-index">{rowNumber}</span>
              <strong>
                <button className="lead-name-button" onClick={() => onSelectLead(lead)} type="button">
                  {lead.name}
                </button>
              </strong>
              <span>{lead.email}</span>
              <span>{lead.displayHome}</span>
              <span>{lead.saves}</span>
              <span className="lead-selection-choice">{lead.selectionChoice}</span>
              <label className="lead-status-select">
                <select aria-label={`Change status for ${lead.name}`} onChange={(event) => updateStatus(lead.id, event.target.value as LeadStatus)} value={lead.status}>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
          );
        })}
      </div>
      <footer className="lead-pagination">
        <button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">Previous</button>
        <span>Page {page} of {pageCount}</span>
        <button disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button">Next</button>
      </footer>
    </LeadWindow>
  );
}
