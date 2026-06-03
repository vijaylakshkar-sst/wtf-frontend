import type { Metadata } from "next";
import { BuilderStaffPage } from "@/components/builder/staff/builder-staff-page";

export const metadata: Metadata = { title: "Staff management", robots: { index: false, follow: false } };

export default function BuilderStaffRoute() {
  return <BuilderStaffPage />;
}
