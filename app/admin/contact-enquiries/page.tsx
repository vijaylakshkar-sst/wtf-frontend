import type { Metadata } from "next";
import { AdminContactEnquiriesPage } from "@/components/admin/admin-contact-enquiries-page";

export const metadata: Metadata = { title: "Contact Enquiries | Admin portal", robots: { index: false, follow: false } };

export default function AdminContactEnquiriesRoute() {
  return <AdminContactEnquiriesPage />;
}
