import type { Metadata } from "next";
import { CustomerEngagementAnalyticsPage } from "@/components/supplier/customer-engagement-analytics/customer-engagement-analytics-page";

export const metadata: Metadata = { title: "Supplier customer engagement analytics", robots: { index: false, follow: false } };

export default function SupplierCustomerEngagementAnalyticsRoute() {
  return <CustomerEngagementAnalyticsPage />;
}
