import { CheckIcon, ClipboardIcon } from "@/components/icons";
import { customerSelections, selectionCategories, type Lead } from "@/components/builder/leads/data";
import { LeadWindow } from "@/components/builder/leads/lead-window";

export function CustomerSelectionsPanel({ lead, onSave, onSubmit }: { lead: Lead; onSave: () => void; onSubmit: () => void }) {
  return (
    <LeadWindow path="/customer/selections - Customer view">
      <div className="customer-selection-title"><h2>Your product selections</h2><p>{lead.displayHome} - Acme Homes</p></div>
      <p className="selection-info">You have been approved to make product selections. Complete all categories and submit to your builder.</p>
      <div className="selection-category-grid">{selectionCategories.map((item) => <button key={item.label} type="button"><CheckIcon size={18} /><strong>{item.label}</strong><small>{item.count}</small></button>)}</div>
      <div className="selection-table">
        <div><span>Category</span><span>Room</span><span>Product</span><span>Type</span></div>
        {customerSelections.map((item) => <div key={item.product}><span>{item.category}</span><span>{item.room}</span><strong>{item.product}</strong><em className={item.type.toLowerCase()}>{item.type}</em></div>)}
      </div>
      <footer className="selection-actions"><button onClick={onSave} type="button"><ClipboardIcon size={14} /> Save PDF</button><button onClick={onSubmit} type="button">Submit to builder</button></footer>
    </LeadWindow>
  );
}
