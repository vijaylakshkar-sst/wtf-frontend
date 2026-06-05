import type { ReactNode } from "react";
import { BoxIcon, HomeIcon, UsersIcon } from "@/components/icons";

export type AdminDirectoryType = "builders" | "suppliers" | "customers";

export type AdminDirectoryRow = {
  id: string;
  profileId?: string;
  name: string;
  primary: string;
  secondary: string;
  location: string;
  metricLabel: string;
  metricValue: string;
  status: "Active" | "Pending" | "Review" | "Inactive";
  updated: string;
};

export const adminStats = [
  { label: "Active builders", value: "42", note: "+6 this month", icon: HomeIcon },
  { label: "Supplier partners", value: "128", note: "18 pending review", icon: BoxIcon },
  { label: "Customers", value: "8,420", note: "+14% growth", icon: UsersIcon },
  { label: "Platform activity", value: "24.8k", note: "Visits this month", icon: UsersIcon },
] as const;

export const adminDirectoryMeta: Record<AdminDirectoryType, { title: string; eyebrow: string; description: string; icon: (props: { size?: number; className?: string }) => ReactNode }> = {
  builders: {
    title: "Builders",
    eyebrow: "Builder management",
    description: "Review registered builders, display home activity, account status and platform usage.",
    icon: HomeIcon,
  },
  suppliers: {
    title: "Suppliers",
    eyebrow: "Supplier management",
    description: "Track supplier accounts, product catalogue size, verification status and recent updates.",
    icon: BoxIcon,
  },
  customers: {
    title: "Customers",
    eyebrow: "Customer management",
    description: "View customers captured through display home visits, saved products and engagement status.",
    icon: UsersIcon,
  },
};

export const adminDirectories: Record<AdminDirectoryType, AdminDirectoryRow[]> = {
  builders: [
    { id: "BLD-1001", name: "Metricon Homes", primary: "Sarah Mitchell", secondary: "sarah@metricon.example", location: "Melbourne, VIC", metricLabel: "Display homes", metricValue: "12", status: "Active", updated: "Today" },
    { id: "BLD-1002", name: "Clarendon Homes", primary: "James Carter", secondary: "james@clarendon.example", location: "Sydney, NSW", metricLabel: "Display homes", metricValue: "8", status: "Active", updated: "2h ago" },
    { id: "BLD-1003", name: "Henley Homes", primary: "Olivia Brown", secondary: "olivia@henley.example", location: "Geelong, VIC", metricLabel: "Display homes", metricValue: "6", status: "Review", updated: "Yesterday" },
    { id: "BLD-1004", name: "Masterton Homes", primary: "Daniel Wright", secondary: "daniel@masterton.example", location: "Brisbane, QLD", metricLabel: "Display homes", metricValue: "5", status: "Pending", updated: "3 days ago" },
  ],
  suppliers: [
    { id: "SUP-2041", name: "Acme Surfaces", primary: "Mia Anderson", secondary: "mia@acmesurfaces.example", location: "Melbourne, VIC", metricLabel: "Products", metricValue: "186", status: "Active", updated: "Today" },
    { id: "SUP-2042", name: "Elysian Tapware", primary: "Noah Wilson", secondary: "noah@elysian.example", location: "Sydney, NSW", metricLabel: "Products", metricValue: "92", status: "Active", updated: "4h ago" },
    { id: "SUP-2043", name: "Coastal Flooring Co", primary: "Ava Taylor", secondary: "ava@coastalflooring.example", location: "Gold Coast, QLD", metricLabel: "Products", metricValue: "74", status: "Review", updated: "Yesterday" },
    { id: "SUP-2044", name: "Lumina Appliances", primary: "Ethan Harris", secondary: "ethan@lumina.example", location: "Perth, WA", metricLabel: "Products", metricValue: "58", status: "Pending", updated: "2 days ago" },
  ],
  customers: [
    { id: "CUS-7781", name: "Amelia Green", primary: "Kitchen renovation", secondary: "amelia.green@example.com", location: "Brighton, VIC", metricLabel: "Saved products", metricValue: "18", status: "Active", updated: "Today" },
    { id: "CUS-7782", name: "Lucas Martin", primary: "Display visit follow-up", secondary: "lucas.martin@example.com", location: "Parramatta, NSW", metricLabel: "Saved products", metricValue: "11", status: "Active", updated: "1h ago" },
    { id: "CUS-7783", name: "Charlotte Lee", primary: "Bathroom selections", secondary: "charlotte.lee@example.com", location: "Toorak, VIC", metricLabel: "Saved products", metricValue: "9", status: "Pending", updated: "Yesterday" },
    { id: "CUS-7784", name: "Henry Walker", primary: "Flooring shortlist", secondary: "henry.walker@example.com", location: "Noosa, QLD", metricLabel: "Saved products", metricValue: "7", status: "Inactive", updated: "5 days ago" },
  ],
};

export const adminRecentActivity = [
  "Metricon Homes published 2 new display homes",
  "Acme Surfaces uploaded 16 catalogue products",
  "18 customers saved products during display visits",
  "3 supplier accounts are waiting for verification",
] as const;
