export const builderAssociationStats = [
  { label: "Associated builders", value: "6", note: "Using supplier products" },
  { label: "Products in use", value: "84", note: "Across builder catalogues" },
  { label: "Display homes", value: "27", note: "With active placements" },
  { label: "Saved by customers", value: "1,246", note: "From associated builders" },
] as const;

export const builderAssociations = [
  {
    builder: "Metricon Homes",
    tier: "Preferred partner",
    displayHomes: 12,
    productsTaken: 28,
    customerSaves: 286,
    lastActivity: "2h ago",
    products: [
      { name: "Elysian Mixer Gunmetal", category: "Tapware", room: "Ensuite", status: "Live", saves: 96 },
      { name: "Calacatta Quartz 20mm", category: "Benchtops", room: "Kitchen", status: "Live", saves: 82 },
      { name: "Brushed Brass Kitchen Mixer", category: "Tapware", room: "Kitchen", status: "Review", saves: 61 },
    ],
  },
  {
    builder: "Clarendon Homes",
    tier: "Active builder",
    displayHomes: 8,
    productsTaken: 19,
    customerSaves: 174,
    lastActivity: "5h ago",
    products: [
      { name: "Coastal Oak Hybrid Floor", category: "Flooring", room: "Living", status: "Live", saves: 74 },
      { name: "Calacatta Quartz 20mm", category: "Benchtops", room: "Kitchen", status: "Live", saves: 58 },
      { name: "Elysian Mixer Gunmetal", category: "Tapware", room: "Bathroom", status: "Live", saves: 42 },
    ],
  },
  {
    builder: "Henley Homes",
    tier: "Active builder",
    displayHomes: 6,
    productsTaken: 15,
    customerSaves: 141,
    lastActivity: "1d ago",
    products: [
      { name: "Brushed Brass Kitchen Mixer", category: "Tapware", room: "Kitchen", status: "Live", saves: 53 },
      { name: "Coastal Oak Hybrid Floor", category: "Flooring", room: "Bedroom", status: "Live", saves: 49 },
      { name: "Calacatta Quartz 20mm", category: "Benchtops", room: "Kitchen", status: "Draft", saves: 39 },
    ],
  },
  {
    builder: "Masterton Homes",
    tier: "New association",
    displayHomes: 4,
    productsTaken: 9,
    customerSaves: 73,
    lastActivity: "3d ago",
    products: [
      { name: "Elysian Mixer Gunmetal", category: "Tapware", room: "Ensuite", status: "Live", saves: 31 },
      { name: "Coastal Oak Hybrid Floor", category: "Flooring", room: "Living", status: "Review", saves: 24 },
      { name: "Brushed Brass Kitchen Mixer", category: "Tapware", room: "Kitchen", status: "Live", saves: 18 },
    ],
  },
] as const;
