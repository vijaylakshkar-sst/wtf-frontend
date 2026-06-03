import { CheckIcon } from "@/components/icons";
import { reviewSelections, type Lead } from "@/components/builder/leads/data";
import { LeadWindow } from "@/components/builder/leads/lead-window";

export function BuilderReviewPanel({ lead, onApprove }: { lead: Lead; onApprove: () => void }) {
  return (
    <LeadWindow path={`/selections/${lead.id} - Builder review`}>
      <div className="review-header"><span>{lead.name.split(" ").map((part) => part[0]).join("")}</span><div><h2>{lead.name} - Selections submitted</h2><p>20 products - 2 Jun 2026</p></div><em>Submitted</em><button onClick={onApprove} type="button"><CheckIcon size={14} /> Approve all</button></div>
      <div className="review-stats"><article><small>Total</small><strong>20</strong></article><article><small>Standard</small><strong>12</strong></article><article><small>Upgrades</small><strong>8</strong></article><article><small>Categories</small><strong>7</strong></article></div>
      <section className="review-table"><h3>Kitchen selections</h3><div className="review-row head"><span>Product</span><span>Category</span><span>Type</span><span>Customer pref.</span><span>Status</span></div>{reviewSelections.map((item) => <div className="review-row" key={item.product}><strong>{item.product}</strong><span>{item.category}</span><em className={item.type.toLowerCase()}>{item.type}</em><span>{item.preference}</span><em className={item.status.toLowerCase()}>{item.status}</em></div>)}</section>
    </LeadWindow>
  );
}
