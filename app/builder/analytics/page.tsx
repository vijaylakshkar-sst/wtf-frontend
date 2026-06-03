import type { Metadata } from "next";
import { BuilderAnalyticsPage } from "@/components/builder/analytics/builder-analytics-page";

export const metadata: Metadata = { title: "Builder analytics", robots: { index: false, follow: false } };

export default function BuilderAnalyticsRoute() {
  return <BuilderAnalyticsPage />;
}
