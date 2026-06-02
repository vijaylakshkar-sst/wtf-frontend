import type { Metadata } from "next";
import {DashboardShell} from "@/components/dashboard-shell";
export const metadata: Metadata = { title: "Builder portal", robots: { index: false, follow: false } };
export default function BuilderPage(){return <DashboardShell role="builder"/>}
