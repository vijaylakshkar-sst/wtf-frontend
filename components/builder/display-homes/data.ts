export const displayHomes = [
  { name: "Tarneit 42 - The Whitmore", address: "14 Harvest Dr, Tarneit VIC", status: "Published", image: "/builder_section.png", position: "left center", visits: 312, leads: 24, rooms: 8, products: 124, completion: 95 },
  { name: "Hoppers Crossing - The Delray", address: "22 Mosaic Blvd, Hoppers Crossing", status: "Published", image: "/hero.png", position: "center center", visits: 279, leads: 18, rooms: 6, products: 98, completion: 70 },
  { name: "Werribee 28 - The Aspen", address: "8 Pioneer Way, Werribee VIC", status: "Under review", image: "/builder_section.png", position: "center center", visits: 186, leads: 12, rooms: 7, products: 76, completion: 45 },
  { name: "Brighton 36 - The Hudson", address: "5 Seaside Ave, Point Cook VIC", status: "Draft", image: "/hero.png", position: "right center", visits: 98, leads: 6, rooms: 5, products: 45, completion: 25 },
] as const;

export const homeStats = [
  { label: "Total homes", value: "4", note: "All display homes" },
  { label: "Total visits (30d)", value: "1,204", note: "12% vs last 30 days" },
  { label: "Leads generated", value: "86", note: "8% vs last 30 days" },
  { label: "Products tagged", value: "237", note: "15% vs last 30 days" },
] as const;

export const homeActivity = [
  ["New product \"Premium Stone Top\" added to Tarneit 42 - The Whitmore", "by Jane Smith", "2h ago"],
  ["New lead from Tarneit 42 - The Whitmore", "Johnson Family - 0412 345 678", "4h ago"],
  ["Selections exported for Hoppers Crossing - The Delray", "by Jane Smith", "Yesterday"],
  ["Display home \"Werribee 28 - The Aspen\" is under review", "by Admin", "2 days ago"],
] as const;
