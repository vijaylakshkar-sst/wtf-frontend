export type InventoryStatus = "In stock" | "Low stock" | "Out of stock" | "Backorder" | "Discontinued";

export type InventoryItem = {
  id: number;
  product: string;
  sku: string;
  brand: string;
  category: string;
  availableQty: number;
  allocatedQty: number;
  builders: string[];
  displayHomes: number;
  leadTime: string;
  status: InventoryStatus;
  lastUpdated: string;
};

export const inventoryStats = [
  { label: "Total SKUs", value: "86", note: "Supplier catalogue" },
  { label: "In stock", value: "61", note: "Ready for builder use" },
  { label: "Low stock", value: "14", note: "Needs attention" },
  { label: "Backorder / out", value: "11", note: "Availability risk" },
] as const;

export const inventoryItems: InventoryItem[] = [
  { id: 1, product: "Elysian Mixer Gunmetal", sku: "ACM-ELO-GM", brand: "Acme Surfaces", category: "Tapware", availableQty: 184, allocatedQty: 42, builders: ["Metricon", "Clarendon"], displayHomes: 9, leadTime: "3 days", status: "In stock", lastUpdated: "Today" },
  { id: 2, product: "Calacatta Quartz 20mm", sku: "ACM-CQ-20", brand: "Acme Surfaces", category: "Benchtops", availableQty: 28, allocatedQty: 21, builders: ["Metricon", "Henley"], displayHomes: 7, leadTime: "7 days", status: "Low stock", lastUpdated: "Today" },
  { id: 3, product: "Coastal Oak Hybrid Floor", sku: "ACM-COH-06", brand: "Acme Floors", category: "Flooring", availableQty: 0, allocatedQty: 18, builders: ["Clarendon", "Masterton"], displayHomes: 5, leadTime: "21 days", status: "Backorder", lastUpdated: "Yesterday" },
  { id: 4, product: "Brushed Brass Kitchen Mixer", sku: "ACM-KIT-BR", brand: "Acme Premium", category: "Tapware", availableQty: 96, allocatedQty: 33, builders: ["Metricon", "Henley"], displayHomes: 6, leadTime: "5 days", status: "In stock", lastUpdated: "2d ago" },
  { id: 5, product: "Alpine White Quartz 30mm", sku: "ACM-AW-30", brand: "Acme Surfaces", category: "Benchtops", availableQty: 7, allocatedQty: 12, builders: ["Metricon"], displayHomes: 3, leadTime: "10 days", status: "Low stock", lastUpdated: "3d ago" },
  { id: 6, product: "Matte Black Shower Rail", sku: "ACM-SR-MB", brand: "Acme Premium", category: "Tapware", availableQty: 0, allocatedQty: 0, builders: ["Clarendon"], displayHomes: 2, leadTime: "N/A", status: "Out of stock", lastUpdated: "5d ago" },
];
