import type { Metadata } from "next";
import {DashboardShell} from "@/components/dashboard-shell";
export const metadata: Metadata = { title: "Admin portal", robots: { index: false, follow: false } };
export default function AdminPage(){return <DashboardShell role="admin"/>}
