export type ProductStatus = "Verified" | "AI mapped" | "Flagged" | "Draft";

export type Product = {
  id: number;
  name: string;
  supplier: string;
  room: string;
  category: string;
  status: ProductStatus;
  image: string;
  imagePosition: string;
};

export const productStats = [
  { label: "Total products", value: "74", note: "All products in library", tone: "gold" },
  { label: "Verified & live", value: "65", note: "87.8% of total", tone: "green" },
  { label: "Pending AI review", value: "6", note: "8.1% of total", tone: "amber" },
  { label: "Flagged products", value: "3", note: "4.1% of total", tone: "red" },
] as const;

export const productCategories = ["All products", "Flooring", "Benchtops", "Cabinetry", "Tapware", "Appliances"] as const;

export const products: Product[] = [
  { id: 1, name: "Calacatta Quartz 20mm", supplier: "Caesarstone", room: "Kitchen", category: "Benchtops", status: "Verified", image: "/builder_section.png", imagePosition: "center 62%" },
  { id: 2, name: "Coastal Oak 6mm", supplier: "Hybrid Floors", room: "Living", category: "Flooring", status: "Verified", image: "/hero.png", imagePosition: "center 72%" },
  { id: 3, name: "Shaker Profile Cabinetry", supplier: "Polytec", room: "Kitchen", category: "Cabinetry", status: "AI mapped", image: "/builder_section.png", imagePosition: "right 58%" },
  { id: 4, name: "Unidentified Tapware", supplier: "Unidentified", room: "Bathroom", category: "Tapware", status: "Flagged", image: "/supplier_section.png", imagePosition: "center 64%" },
] as const;

export const flaggedProducts = [
  { name: "Unidentified Stone Surface", room: "Kitchen", confidence: "42%", image: "/builder_section.png", imagePosition: "center 66%" },
  { name: "Unidentified Timber Floor", room: "Living", confidence: "38%", image: "/hero.png", imagePosition: "center 74%" },
  { name: "Unidentified Tapware", room: "Ensuite", confidence: "35%", image: "/supplier_section.png", imagePosition: "center 63%" },
] as const;

export const supplierProductCatalog = [
  { id: "caesarstone", supplier: "Caesarstone", products: [
    { code: "CST-CQ-20", name: "Calacatta Quartz 20mm", category: "Benchtops", room: "Kitchen", price: "$320 / m2", image: "/builder_section.png" },
    { code: "CST-AV-30", name: "Alpine White Quartz 30mm", category: "Benchtops", room: "Kitchen", price: "$380 / m2", image: "/builder_section.png" },
  ] },
  { id: "hybrid-floors", supplier: "Hybrid Floors", products: [
    { code: "HF-CO-6", name: "Coastal Oak 6mm", category: "Flooring", room: "Living", price: "$72 / m2", image: "/hero.png" },
    { code: "HF-BO-8", name: "Blackbutt Oak 8mm", category: "Flooring", room: "Bedroom", price: "$84 / m2", image: "/hero.png" },
  ] },
  { id: "abi-interiors", supplier: "ABI Interiors", products: [
    { code: "ABI-ELO-GM", name: "Elysian Mixer Gunmetal", category: "Tapware", room: "Ensuite", price: "$249", image: "/supplier_section.png" },
    { code: "ABI-KIT-BR", name: "Kitchen Mixer Brushed Brass", category: "Tapware", room: "Kitchen", price: "$319", image: "/supplier_section.png" },
  ] },
] as const;
