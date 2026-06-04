import type { Metadata } from "next";
import { AdminDisplayHomesPage } from "@/components/admin/admin-display-homes-page";

export const metadata: Metadata = { title: "Display Homes | Admin portal", robots: { index: false, follow: false } };

export default function AdminDisplayHomesRoute() {
  return <AdminDisplayHomesPage />;
}
