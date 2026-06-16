import { ClipboardIcon, HomeIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { customerSelections, productInteractions, type Lead } from "@/components/builder/leads/data";
import { LeadWindow } from "@/components/builder/leads/lead-window";

export function LeadDetailPanel({ lead }: { lead: Lead }) {
  return (
    <LeadWindow path={`/leads/${lead.id}`}>
      <div className="lead-detail-header"><span>{lead.name.split(" ").map((part) => part[0]).join("")}</span><div><h2>{lead.name}</h2><p>{lead.displayHome} lead since 28 May 2026</p></div><em>{lead.status}</em></div>
      <div className="lead-detail-grid">
        <article><h3>Contact information</h3><p><MailIcon size={13} /> {lead.email}</p><p><PhoneIcon size={13} /> {lead.phone}</p><p><HomeIcon size={13} /> {lead.displayHome} - Whitmore</p><p><ClipboardIcon size={13} /> {lead.selectionChoice}</p></article>
        <article><h3>Visit history</h3><p><HomeIcon size={13} /> <strong>{lead.displayHome}</strong><em>QR</em></p><small>{lead.visit}</small><p><HomeIcon size={13} /> <strong>{lead.displayHome}</strong><em>Return</em></p></article>
      </div>
      <section className="interaction-card"><h3>Product interactions</h3>{productInteractions.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.views} views</strong><i style={{ width: item.value }} /></div>)}</section>
      <section className="leads-section lead-customer-selections">
        <h2>Customer selections</h2>
        <p className="selection-info">These are the selections the customer made after interacting with the products on this lead.</p>
        <div className="selection-table">
          <div>
            <span>Category</span>
            <span>Room</span>
            <span>Product</span>
            <span>Type</span>
          </div>
          {customerSelections.map((item) => (
            <div key={`${item.category}-${item.room}-${item.product}`}>
              <span>{item.category}</span>
              <span>{item.room}</span>
              <strong>{item.product}</strong>
              <em className={item.type.toLowerCase()}>{item.type}</em>
            </div>
          ))}
        </div>
      </section>
    </LeadWindow>
  );
}
