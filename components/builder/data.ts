import { BookmarkIcon, ChartIcon, ClipboardIcon, UsersIcon } from "@/components/icons";

export const builderMetrics = [
  { icon: UsersIcon, label: "New leads (7d)", value: "24", change: "12% vs last week", positive: true },
  { icon: ChartIcon, label: "Display visits", value: "312", change: "8% vs last week", positive: true },
  { icon: ClipboardIcon, label: "Selections", value: "9", change: "3 this week", positive: true },
  { icon: BookmarkIcon, label: "Saved products", value: "147", change: "4% vs last week", positive: false },
] as const;

export const recentLeads = [
  { initials: "MJ", name: "M. Johnson", home: "Tarneit 42", status: "New", added: "2h ago" },
  { initials: "SP", name: "S. Patel", home: "Werribee 28", status: "Contacted", added: "5h ago" },
  { initials: "LC", name: "L. Chen", home: "Tarneit 42", status: "Qualified", added: "1d ago" },
] as const;

export const chartPoints = "15,98 83,137 151,88 219,112 287,78 355,32 423,95";
