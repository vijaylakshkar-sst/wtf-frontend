import { BookOpenIcon, CameraIcon, FileIcon, HomeIcon, SparklesIcon } from "@/components/icons";

export const createDisplayHomeSteps = [
  { id: "details", eyebrow: "Step 1", shortLabel: "1", title: "Details", description: "Add all the essential information about your display home.", icon: HomeIcon },
  { id: "classification", eyebrow: "Step 2", shortLabel: "2", title: "Classification", description: "Define how your display home should be categorised.", icon: SparklesIcon },
  { id: "floor-plan", eyebrow: "Step 3", shortLabel: "3", title: "Floor Plan Upload", description: "Upload your floor plan to get started.", icon: FileIcon },
  { id: "rooms", eyebrow: "Step 4", shortLabel: "4", title: "AI Detected Rooms", description: "Review, edit or add any missing rooms.", icon: BookOpenIcon },
  { id: "qr", eyebrow: "Step 5", shortLabel: "5", title: "QR Generated", description: "Your display home is ready for visitors.", icon: CameraIcon },
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
