import { BuilderReviewPanel } from "@/components/builder/leads/builder-review-panel";
import type { Lead } from "@/components/builder/leads/data";

export function BuilderReviewStep({ lead, onApprove }: { lead: Lead; onApprove: () => void }) {
  return <div className="builder-review-full"><BuilderReviewPanel lead={lead} onApprove={onApprove} /></div>;
}
