export type LeadStatus = "New" | "Contacted" | "Approved";
export type SelectionStatus = "Submitted" | "Pending" | "Approved";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  displayHome: string;
  saves: number;
  selections: SelectionStatus;
  selectionChoice: string;
  status: LeadStatus;
  visit: string;
};

export const leadStats = [
  { label: "New", value: 7 },
  { label: "Contacted", value: 9 },
  { label: "Approved", value: 5 },
  { label: "Appointed", value: 3 },
] as const;

export const leads: Lead[] = [
  { id: "maya", name: "Maya Johnson", email: "maya@email.com", phone: "+61 412 345 678", displayHome: "Tarneit 42", saves: 12, selections: "Submitted", selectionChoice: "Yes, Continue", status: "New", visit: "Today - 10:24 AM - 47 min" },
  { id: "sanjay", name: "Sanjay Patel", email: "sanjay@email.com", phone: "+61 412 000 111", displayHome: "Werribee 28", saves: 7, selections: "Pending", selectionChoice: "No, Explore Products", status: "Contacted", visit: "25 May - 31 min" },
  { id: "linda", name: "Linda Chen", email: "lchen@outlook.com", phone: "+61 411 222 300", displayHome: "Tarneit 42", saves: 21, selections: "Approved", selectionChoice: "Yes, Continue", status: "Approved", visit: "23 May - 55 min" },
  { id: "oliver", name: "Oliver Brown", email: "oliver@email.com", phone: "+61 410 444 221", displayHome: "Brighton 36", saves: 8, selections: "Pending", selectionChoice: "No, Explore Products", status: "New", visit: "22 May - 24 min" },
  { id: "amelia", name: "Amelia Wilson", email: "amelia@email.com", phone: "+61 409 555 120", displayHome: "Tarneit 42", saves: 16, selections: "Submitted", selectionChoice: "Yes, Continue", status: "Contacted", visit: "21 May - 42 min" },
  { id: "noah", name: "Noah Taylor", email: "noah@email.com", phone: "+61 418 222 901", displayHome: "Werribee 28", saves: 10, selections: "Approved", selectionChoice: "Yes, Continue", status: "Approved", visit: "20 May - 38 min" },
] as const;

export const productInteractions = [
  { label: "Kitchen products", views: 18, value: "96%" },
  { label: "Living room", views: 12, value: "78%" },
  { label: "Ensuite", views: 9, value: "64%" },
] as const;

export const selectionCategories = [
  { label: "Flooring", count: "3 selected" },
  { label: "Roofing", count: "1 selected" },
  { label: "Paint", count: "4 selected" },
  { label: "Kitchen", count: "5 selected" },
  { label: "Bathroom", count: "3 selected" },
  { label: "Lighting", count: "Not started" },
] as const;

export const customerSelections = [
  { category: "Flooring", room: "Living", product: "Coastal Oak 6mm", type: "Standard" },
  { category: "Benchtop", room: "Kitchen", product: "Calacatta Quartz", type: "Upgrade" },
  { category: "Paint", room: "All", product: "Dulux Vivid White", type: "Standard" },
] as const;

export const reviewSelections = [
  { product: "Calacatta Quartz", category: "Benchtop", type: "Upgrade", preference: "Favourite", status: "Approved" },
  { product: "Shaker Cabinetry", category: "Cabinetry", type: "Standard", preference: "-", status: "Pending" },
] as const;

export const leadsFlowSteps = ["Lead list", "Lead detail", "Customer selections", "Builder review"] as const;
