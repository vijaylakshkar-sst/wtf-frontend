import type { Metadata } from "next";
import { LeadsManagementPage } from "@/components/builder/leads/leads-management-page";

export const metadata: Metadata = { title: "Leads & selections", robots: { index: false, follow: false } };

export default function BuilderLeadsPage() {
  return <LeadsManagementPage />;
}
