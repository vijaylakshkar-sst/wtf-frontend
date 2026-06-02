import type { Metadata } from "next";
import { BuilderDashboard } from "@/components/builder/builder-dashboard";
export const metadata: Metadata = { title: "Builder portal", robots: { index: false, follow: false } };
export default function BuilderPage(){return <BuilderDashboard />}
