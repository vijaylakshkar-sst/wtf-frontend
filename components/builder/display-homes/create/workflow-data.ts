import { BookOpenIcon, CameraIcon, FileIcon, HomeIcon, SparklesIcon } from "@/components/icons";

export const createDisplayHomeSteps = [
  { id: "details", eyebrow: "Step 1", shortLabel: "1", title: "Details", description: "Add all the essential information about your display home.", icon: HomeIcon },
  { id: "classification", eyebrow: "Step 2", shortLabel: "2", title: "Classification", description: "Define how your display home should be categorised.", icon: SparklesIcon },
  { id: "floor-plan", eyebrow: "Step 3", shortLabel: "3", title: "Floor Plan Upload", description: "Upload your floor plan to get started.", icon: FileIcon },
  { id: "rooms", eyebrow: "Step 4", shortLabel: "4", title: "AI Detected Rooms", description: "Review, edit or add any missing rooms.", icon: BookOpenIcon },
  { id: "products-upload", eyebrow: "Step 5", shortLabel: "5", title: "Products Upload", description: "Upload your products to get started.", icon: FileIcon },
  { id: "products-result", eyebrow: "Step 6", shortLabel: "6", title: "Products Result", description: "AI extracted products", icon: BookOpenIcon },
  { id: "products-verify-edit", eyebrow: "Step 7", shortLabel: "7", title: "Products Verify", description: "Products Verify and Edit", icon: BookOpenIcon },
  { id: "qr", eyebrow: "Step 7", shortLabel: "8", title: "QR Generated", description: "Your display home is ready for visitors.", icon: CameraIcon },
] as const;

export type CreateDisplayHomeStepId = (typeof createDisplayHomeSteps)[number]["id"];

export const homeUploads = [
  { label: "Floor plan", note: "Upload PDF", icon: FileIcon },
  { label: "Brochure", note: "Upload PDF", icon: BookOpenIcon },
  { label: "Photography", note: "Upload images", icon: CameraIcon },
] as const;

export const targetMarkets = ["First home buyer", "Family", "Upsizer", "Investor"] as const;

export const detectedRooms = [
  { name: "Living room", products: "flooring, soft furnishings, lighting", icon: HomeIcon },
  { name: "Kitchen", products: "benchtops, cabinetry, tapware", icon: SparklesIcon },
  { name: "Ensuite", products: "tiles, tapware, vanity, mirrors", icon: BookOpenIcon },
] as const;

export const extractedProducts = [
  { name: "Calacatta Quartz 20mm", code: "CST-CQ-20", supplier: "Caesarstone", confidence: "0.93", status: "approved", image: "/builder_section.png" },
  { name: "Shaker Profile Cabinetry", code: "POL-SHP-W", supplier: "Polytec", confidence: "0.85", status: "pending", image: "/hero.png" },
  { name: "Unknown - ref #4482-B", code: "p13", supplier: "No supplier", confidence: "Low quality", status: "flagged", image: "/supplier_section.png" },
] as const;