import type { Metadata } from "next";
import {DashboardShell} from "@/components/dashboard-shell";
export const metadata: Metadata = { title: "Supplier portal", robots: { index: false, follow: false } };
export default function SupplierPage(){return <DashboardShell role="supplier"/>}
