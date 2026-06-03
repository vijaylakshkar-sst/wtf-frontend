export const pdfWorkflowSteps = ["PDF Upload", "Processing", "Pages Scanned", "AI Results", "Verify & Edit", "Flagged Items"] as const;

export const extractionTasks = [
  { label: "PDF validated - 14 pages detected", status: "Done", tone: "done" },
  { label: "28 products detected", status: "Done", tone: "done" },
  { label: "Matching suppliers & images", status: "Running", tone: "running" },
  { label: "Mapping products to rooms", status: "Waiting", tone: "waiting" },
  { label: "Duplicate detection", status: "Waiting", tone: "waiting" },
  { label: "Flagging unidentified products", status: "Waiting", tone: "waiting" },
] as const;

export const scannedPages = [
  { page: "p1", products: 4, state: "ok" },
  { page: "p2", products: 2, state: "ok" },
  { page: "p3", products: 3, state: "ok" },
  { page: "p4", products: 5, state: "ok" },
  { page: "p5", products: 4, state: "ok" },
  { page: "p6", products: 4, state: "warn" },
  { page: "p7", products: 2, state: "ok" },
  { page: "p8", products: 3, state: "ok" },
  { page: "p9", products: 2, state: "ok" },
  { page: "p10", products: 1, state: "ok" },
  { page: "p11", products: 1, state: "warn" },
  { page: "p12", products: 0, state: "flag" },
] as const;

export const extractedProducts = [
  { name: "Calacatta Quartz 20mm", code: "CST-CQ-20", supplier: "Caesarstone", confidence: "0.93", status: "approved", image: "/builder_section.png" },
  { name: "Shaker Profile Cabinetry", code: "POL-SHP-W", supplier: "Polytec", confidence: "0.85", status: "pending", image: "/hero.png" },
  { name: "Unknown - ref #4482-B", code: "p13", supplier: "No supplier", confidence: "Low quality", status: "flagged", image: "/supplier_section.png" },
] as const;

export const flaggedPdfItems = [
  { title: "Unknown - ref #4482-B", note: "p13 - Low quality - No supplier - No category" },
  { title: "Product ref: TILE-441", note: "p14 - Tile - No supplier" },
] as const;
