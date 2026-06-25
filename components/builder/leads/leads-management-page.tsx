"use client";

import { useMemo, useState } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";
import { BuilderReviewStep } from "@/components/builder/leads/steps/builder-review-step";
import { CustomerSelectionsStep } from "@/components/builder/leads/steps/customer-selections-step";
import { LeadDetailStep } from "@/components/builder/leads/steps/lead-detail-step";
import { LeadListStep } from "@/components/builder/leads/steps/lead-list-step";
import { leads, leadsFlowSteps, type Lead } from "@/components/builder/leads/data";

export function LeadsManagementPage() {
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [, setNotice] = useState("Lead management ready.");
  const selectedLead = activeLead ?? leads[0];
  const exportRows = useMemo(
    () =>
      leads.map((lead) => [
        lead.name,
        lead.email,
        lead.phone,
        lead.displayHome,
        String(lead.saves),
        lead.selectionChoice,
        lead.status,
        lead.visit,
      ]),
    [],
  );

  const downloadCsv = () => {
    const header = ["Name", "Email", "Phone", "Display home", "Saves", "Selection choice", "Status", "Visit"];
    const csv = [header, ...exportRows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "leads-customers-export.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setNotice("Lead export downloaded.");
  };

  const saveAsPdf = () => {
    setNotice("Print dialog opened. Save the page as PDF from your browser.");
    window.print();
  };

  function goBack() {
    setActiveStep((step) => Math.max(0, step - 1));
  }

  return (
    <BuilderShell>
      <section className="builder-main leads-main">
        <header className="leads-page-header">
          <div className="leads-page-header-copy">
            <p>Home / Leads & Customers</p>
            <h1>Leads & Customer Selections</h1>
            <span>Lead list - Lead detail - Customer selection submission - Builder review</span>
          </div>
        </header>
        <section className="leads-section leads-flow-section">
          <h2>{leadsFlowSteps[activeStep]}</h2>
          {activeStep === 0 ? <LeadListStep activeLead={activeLead} leads={leads} onExport={downloadCsv} onSelectLead={(lead) => { setActiveLead(lead); setActiveStep(1); setNotice(`${lead.name} selected.`); }} /> : null}
          {activeStep === 1 && activeLead ? <LeadDetailStep lead={selectedLead} onBack={() => setActiveStep(0)} onExport={downloadCsv} onSave={saveAsPdf} /> : null}
          {activeStep === 2 && activeLead ? <CustomerSelectionsStep lead={selectedLead} onExport={downloadCsv} onSave={saveAsPdf} onSubmit={() => { setNotice(`${selectedLead.name}'s selections submitted to builder.`); setActiveStep(3); }} /> : null}
          {activeStep === 3 && activeLead ? <BuilderReviewStep lead={selectedLead} onApprove={() => setNotice(`${selectedLead.name}'s selections approved.`)} /> : null}
        </section>
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
      </section>
    </BuilderShell>
  );
}
