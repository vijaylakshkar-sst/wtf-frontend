import { customerSelections, type Lead } from "@/components/builder/leads/data";
import { LeadWindow } from "@/components/builder/leads/lead-window";
import { FileIcon, PrintIcon } from "@/components/icons";

export function CustomerSelectionsPanel({ lead, onExport, onSave, onSubmit }: { lead: Lead; onExport: () => void; onSave: () => void; onSubmit: () => void }) {
  return (
    <LeadWindow path="/customer/selections - Customer view">
      <div className="customer-selection-title customer-selection-title--actions">
        <div>
          <h2>Customer selections</h2>
          <p>{lead.displayHome} - Acme Homes</p>
        </div>
        <div className="customer-selection-actions">
          <button onClick={onSave} type="button">
            <PrintIcon size={14} /> Save as PDF
          </button>
          <button onClick={onExport} type="button">
            <FileIcon size={14} /> Export
          </button>
        </div>
      </div>
      <p className="selection-info">You have been approved to make product selections. Complete all categories and submit to your builder.</p>
      {/* <div className="selection-category-grid">{selectionCategories.map((item) => <button key={item.label} type="button"><CheckIcon size={18} /><strong>{item.label}</strong><small>{item.count}</small></button>)}</div> */}
      <div className="selection-table">
        <div><span>Category</span><span>Room</span><span>Product</span><span>Type</span></div>
        {customerSelections.map((item) => <div key={item.product}><span>{item.category}</span><span>{item.room}</span><strong>{item.product}</strong><em className={item.type.toLowerCase()}>{item.type}</em></div>)}
      </div>
      <footer className="selection-actions"><button onClick={onSubmit} type="button">Submit to builder</button></footer>
    </LeadWindow>
  );
}
