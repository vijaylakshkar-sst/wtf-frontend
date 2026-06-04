export const customerEngagementMetrics = [
  { label: "Saved products", value: "1,246", note: "+18% this month", tone: "green" },
  { label: "Favourited products", value: "824", note: "+11% this month", tone: "gold" },
  { label: "Product views", value: "6,940", note: "+24% engagement", tone: "blue" },
  { label: "Interested customers", value: "392", note: "Across display visits", tone: "violet" },
] as const;

export const mostSavedProducts = [
  { product: "Elysian Mixer Gunmetal", category: "Tapware", saves: 196, favourites: 122, views: 1240, trend: 92 },
  { product: "Calacatta Quartz 20mm", category: "Benchtops", saves: 172, favourites: 108, views: 1080, trend: 88 },
  { product: "Coastal Oak Hybrid Floor", category: "Flooring", saves: 149, favourites: 91, views: 890, trend: 81 },
  { product: "Brushed Brass Kitchen Mixer", category: "Tapware", saves: 118, favourites: 76, views: 746, trend: 76 },
] as const;

export const mostFavoritedProducts = [
  { product: "Elysian Mixer Gunmetal", category: "Tapware", favourites: 122, saves: 196, interest: "High" },
  { product: "Calacatta Quartz 20mm", category: "Benchtops", favourites: 108, saves: 172, interest: "High" },
  { product: "Coastal Oak Hybrid Floor", category: "Flooring", favourites: 91, saves: 149, interest: "Medium" },
  { product: "Brushed Brass Kitchen Mixer", category: "Tapware", favourites: 76, saves: 118, interest: "Medium" },
] as const;

export const frequentlyViewedProducts = [
  { product: "Elysian Mixer Gunmetal", views: "1,240", rooms: "Ensuite, Bathroom", builders: "Metricon, Clarendon" },
  { product: "Calacatta Quartz 20mm", views: "1,080", rooms: "Kitchen", builders: "Metricon, Henley" },
  { product: "Coastal Oak Hybrid Floor", views: "890", rooms: "Living, Bedroom", builders: "Clarendon, Masterton" },
  { product: "Brushed Brass Kitchen Mixer", views: "746", rooms: "Kitchen", builders: "Metricon, Henley" },
] as const;

export const interestTrends = [
  { label: "Tapware", value: "38%", width: "88%" },
  { label: "Benchtops", value: "27%", width: "72%" },
  { label: "Flooring", value: "21%", width: "61%" },
  { label: "Appliances", value: "14%", width: "44%" },
] as const;

export const engagementTrendPoints = "15,132 86,118 157,96 228,104 299,72 370,58 441,34";
