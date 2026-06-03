"use client";

import { useState } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";
import { BuilderReviewStep } from "@/components/builder/leads/steps/builder-review-step";
import { CustomerSelectionsStep } from "@/components/builder/leads/steps/customer-selections-step";
import { LeadDetailStep } from "@/components/builder/leads/steps/lead-detail-step";
import { LeadListStep } from "@/components/builder/leads/steps/lead-list-step";
import { leads, leadsFlowSteps, type Lead } from "@/components/builder/leads/data";

export function LeadsManagementPage() {
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [notice, setNotice] = useState("Lead management ready.");
  const selectedLead = activeLead ?? leads[0];

  function selectStep(step: number) {
    if (step > 0 && !activeLead) {
      setNotice("Please select a lead first.");
      return;
    }
    setActiveStep(step);
  }

  function goBack() {
    setActiveStep((step) => Math.max(0, step - 1));
  }

  return (
    <BuilderShell>
      <section className="builder-main leads-main">
        <header className="leads-page-header">
          <p>Home / Leads & Customers</p>
          <h1>Leads & Customer Selections</h1>
          <span>Lead list - Lead detail - Customer selection submission - Builder review</span>
        </header>
        <section className="leads-section leads-flow-section">
          <h2>{leadsFlowSteps[activeStep]}</h2>
          {activeStep === 0 ? <LeadListStep activeLead={activeLead} leads={leads} onExport={() => setNotice("Lead export prepared.")} onSelectLead={(lead) => { setActiveLead(lead); setActiveStep(1); setNotice(`${lead.name} selected.`); }} /> : null}
          {activeStep === 1 && activeLead ? <LeadDetailStep lead={selectedLead} /> : null}
          {activeStep === 2 && activeLead ? <CustomerSelectionsStep lead={selectedLead} onSave={() => setNotice("Customer selection PDF saved.")} onSubmit={() => { setNotice(`${selectedLead.name}'s selections submitted to builder.`); setActiveStep(3); }} /> : null}
          {activeStep === 3 && activeLead ? <BuilderReviewStep lead={selectedLead} onApprove={() => setNotice(`${selectedLead.name}'s selections approved.`)} /> : null}
        </section>
        {activeStep === 1 ? (
          <footer className="leads-flow-actions">
            <button onClick={goBack} type="button">Back</button>
            <button onClick={() => selectStep(2)} type="button">Customer selections</button>
          </footer>
        ) : null}
        {activeStep === 2 ? (
          <footer className="leads-flow-actions single">
            <button onClick={goBack} type="button">Back</button>
          </footer>
        ) : null}
        {activeStep === 3 ? (
          <footer className="leads-flow-actions single">
            <button onClick={goBack} type="button">Back</button>
          </footer>
        ) : null}
        <p className="leads-notice" role="status">{notice}</p>
      </section>
    </BuilderShell>
  );
}
