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
  { label: "Total products", value: "20", note: "All products in library", tone: "gold" },
  { label: "Verified & live", value: "10", note: "50% of total", tone: "green" },
  { label: "Pending AI review", value: "7", note: "35% of total", tone: "amber" },
  { label: "Flagged products", value: "3", note: "15% of total", tone: "red" },
] as const;

export const productCategories = ["All products", "Flooring", "Benchtops", "Cabinetry", "Tapware", "Appliances"] as const;

export const products: Product[] = [
  { id: 1, name: "Calacatta Quartz 20mm", supplier: "Caesarstone", room: "Kitchen", category: "Benchtops", status: "Verified", image: "/builder_section.png", imagePosition: "center 62%" },
  { id: 2, name: "Coastal Oak 6mm", supplier: "Hybrid Floors", room: "Living", category: "Flooring", status: "Verified", image: "/hero.png", imagePosition: "center 72%" },
  { id: 3, name: "Shaker Profile Cabinetry", supplier: "Polytec", room: "Kitchen", category: "Cabinetry", status: "AI mapped", image: "/builder_section.png", imagePosition: "right 58%" },
  { id: 4, name: "Unidentified Tapware", supplier: "Unidentified", room: "Bathroom", category: "Tapware", status: "Flagged", image: "/supplier_section.png", imagePosition: "center 64%" },
  { id: 5, name: "Blackbutt Hybrid Plank", supplier: "Hybrid Floors", room: "Bedroom", category: "Flooring", status: "Verified", image: "/hero.png", imagePosition: "center 68%" },
  { id: 6, name: "Tasmanian Oak Plank", supplier: "Hybrid Floors", room: "Living", category: "Flooring", status: "AI mapped", image: "/hero.png", imagePosition: "center 70%" },
  { id: 7, name: "Matte Black Mixer", supplier: "ABI Interiors", room: "Ensuite", category: "Tapware", status: "Verified", image: "/supplier_section.png", imagePosition: "center 60%" },
  { id: 8, name: "Brushed Brass Mixer", supplier: "ABI Interiors", room: "Kitchen", category: "Tapware", status: "Draft", image: "/supplier_section.png", imagePosition: "center 58%" },
  { id: 9, name: "Alpine White Quartz 30mm", supplier: "Caesarstone", room: "Kitchen", category: "Benchtops", status: "AI mapped", image: "/builder_section.png", imagePosition: "center 60%" },
  { id: 10, name: "Stone Grey Quartz 20mm", supplier: "Caesarstone", room: "Laundry", category: "Benchtops", status: "Verified", image: "/builder_section.png", imagePosition: "center 63%" },
  { id: 11, name: "Handle Set Satin Nickel", supplier: "Hettich", room: "Kitchen", category: "Cabinetry", status: "Draft", image: "/supplier_section.png", imagePosition: "center 66%" },
  { id: 12, name: "Handle Set Matte Black", supplier: "Hettich", room: "Kitchen", category: "Cabinetry", status: "Verified", image: "/supplier_section.png", imagePosition: "center 62%" },
  { id: 13, name: "Island Pantry System", supplier: "Polytec", room: "Kitchen", category: "Cabinetry", status: "Flagged", image: "/builder_section.png", imagePosition: "center 57%" },
  { id: 14, name: "Laundry Laminate Finish", supplier: "Polytec", room: "Laundry", category: "Cabinetry", status: "AI mapped", image: "/builder_section.png", imagePosition: "center 61%" },
  { id: 15, name: "Splashback Porcelain Mist", supplier: "Caesarstone", room: "Kitchen", category: "Benchtops", status: "Draft", image: "/builder_section.png", imagePosition: "center 59%" },
  { id: 16, name: "Spotted Gum Decking", supplier: "TimberCo", room: "Outdoor", category: "Flooring", status: "Verified", image: "/hero.png", imagePosition: "center 74%" },
  { id: 17, name: "Charcoal Carpet Loop", supplier: "TimberCo", room: "Bedroom", category: "Flooring", status: "AI mapped", image: "/hero.png", imagePosition: "center 65%" },
  { id: 18, name: "Chrome Shower Rail", supplier: "ABI Interiors", room: "Bathroom", category: "Tapware", status: "Flagged", image: "/supplier_section.png", imagePosition: "center 64%" },
  { id: 19, name: "Linen White Cabinet Door", supplier: "Polytec", room: "Pantry", category: "Cabinetry", status: "Verified", image: "/builder_section.png", imagePosition: "center 56%" },
  { id: 20, name: "Warm White Wall Panel", supplier: "FibreCo", room: "Living", category: "Appliances", status: "Draft", image: "/hero.png", imagePosition: "center 71%" },
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
