export type AnalyticsYear = "2026" | "2025" | "2024";

export type AnalyticsMetric = {
  change: string;
  iconTone: string;
  label: string;
  value: string;
};

export type VisitPoint = {
  label: string;
  value: number;
};

export type FunnelRow = {
  label: string;
  tone: string;
  value: string;
  width: number;
};

export type AnalyticsProduct = {
  category?: string;
  faves?: string;
  image: string;
  imagePosition: string;
  product: string;
  saves: string;
  selected?: string;
  views?: string;
};

export type BehaviourStat = {
  label: string;
  tone: string;
  value: string;
  width: number;
};

export type AnalyticsDataset = {
  behaviourStats: BehaviourStat[];
  funnelRows: FunnelRow[];
  metrics: AnalyticsMetric[];
  mostViewedProducts: AnalyticsProduct[];
  savedProducts: AnalyticsProduct[];
  visitsByDay: VisitPoint[];
};

export const analyticsYears: AnalyticsYear[] = ["2026", "2025", "2024"];

export const analyticsByYear: Record<AnalyticsYear, AnalyticsDataset> = {
  "2026": {
    metrics: [
      { label: "Total visits", value: "1,204", change: "14%", iconTone: "violet" },
      { label: "Unique visitors", value: "847", change: "19%", iconTone: "blue" },
      { label: "Leads generated", value: "86", change: "25%", iconTone: "green" },
      { label: "Selections submitted", value: "14", change: "6%", iconTone: "gold" },
    ],
    visitsByDay: [
      { label: "6 May", value: 172 }, { label: "7 May", value: 158 }, { label: "8 May", value: 268 },
      { label: "9 May", value: 174 }, { label: "10 May", value: 181 }, { label: "11 May", value: 108 },
      { label: "12 May", value: 118 }, { label: "13 May", value: 132 }, { label: "14 May", value: 164 },
      { label: "15 May", value: 114 }, { label: "16 May", value: 119 }, { label: "17 May", value: 105 },
      { label: "18 May", value: 158 }, { label: "19 May", value: 205 }, { label: "20 May", value: 111 },
      { label: "21 May", value: 164 }, { label: "22 May", value: 163 }, { label: "23 May", value: 129 },
      { label: "24 May", value: 204 }, { label: "25 May", value: 155 }, { label: "26 May", value: 115 },
    ],
    funnelRows: [
      { label: "Visit -> Lead", value: "7.1%", width: 35, tone: "blue" },
      { label: "Lead -> Qualified", value: "20.8%", width: 52, tone: "green" },
      { label: "Qualified -> Appointed", value: "60%", width: 80, tone: "green" },
    ],
    mostViewedProducts: [
      { product: "Calacatta Quartz 20mm", category: "Benchtop", views: "312", saves: "83", image: "/builder_section.png", imagePosition: "center 64%" },
      { product: "Coastal Oak 6mm", category: "Flooring", views: "289", saves: "71", image: "/hero.png", imagePosition: "center 72%" },
      { product: "Matte Black Tapware", category: "Tapware", views: "201", saves: "44", image: "/supplier_section.png", imagePosition: "center 64%" },
    ],
    savedProducts: [
      { product: "Calacatta Quartz 20mm", saves: "83", faves: "41", selected: "11", image: "/builder_section.png", imagePosition: "center 64%" },
      { product: "Coastal Oak 6mm", saves: "71", faves: "34", selected: "9", image: "/hero.png", imagePosition: "center 72%" },
      { product: "Shaker Cabinetry", saves: "67", faves: "28", selected: "7", image: "/builder_section.png", imagePosition: "right 58%" },
    ],
    behaviourStats: [
      { label: "Saved a product", value: "868 visitors - 71.9%", width: 72, tone: "violet" },
      { label: "Return 2+ times", value: "512 visitors - 42.4%", width: 42, tone: "blue" },
      { label: "Submitted selections", value: "14 visitors - 1.2%", width: 38, tone: "green" },
      { label: "Requested callback", value: "41 visitors - 4.8%", width: 26, tone: "gold" },
    ],
  },
  "2025": {
    metrics: [
      { label: "Total visits", value: "10,842", change: "11%", iconTone: "violet" },
      { label: "Unique visitors", value: "7,436", change: "16%", iconTone: "blue" },
      { label: "Leads generated", value: "712", change: "18%", iconTone: "green" },
      { label: "Selections submitted", value: "126", change: "9%", iconTone: "gold" },
    ],
    visitsByDay: [
      { label: "Jan", value: 118 }, { label: "Feb", value: 142 }, { label: "Mar", value: 168 },
      { label: "Apr", value: 151 }, { label: "May", value: 195 }, { label: "Jun", value: 211 },
      { label: "Jul", value: 188 }, { label: "Aug", value: 226 }, { label: "Sep", value: 239 },
      { label: "Oct", value: 255 }, { label: "Nov", value: 232 }, { label: "Dec", value: 284 },
    ],
    funnelRows: [
      { label: "Visit -> Lead", value: "6.6%", width: 32, tone: "blue" },
      { label: "Lead -> Qualified", value: "24.4%", width: 58, tone: "green" },
      { label: "Qualified -> Appointed", value: "57%", width: 76, tone: "green" },
    ],
    mostViewedProducts: [
      { product: "Coastal Oak 6mm", category: "Flooring", views: "2,814", saves: "712", image: "/hero.png", imagePosition: "center 72%" },
      { product: "Calacatta Quartz 20mm", category: "Benchtop", views: "2,490", saves: "681", image: "/builder_section.png", imagePosition: "center 64%" },
      { product: "Shaker Cabinetry", category: "Cabinetry", views: "1,882", saves: "503", image: "/builder_section.png", imagePosition: "right 58%" },
    ],
    savedProducts: [
      { product: "Coastal Oak 6mm", saves: "712", faves: "321", selected: "79", image: "/hero.png", imagePosition: "center 72%" },
      { product: "Calacatta Quartz 20mm", saves: "681", faves: "308", selected: "73", image: "/builder_section.png", imagePosition: "center 64%" },
      { product: "Matte Black Tapware", saves: "441", faves: "192", selected: "46", image: "/supplier_section.png", imagePosition: "center 64%" },
    ],
    behaviourStats: [
      { label: "Saved a product", value: "6,998 visitors - 64.5%", width: 65, tone: "violet" },
      { label: "Return 2+ times", value: "4,132 visitors - 38.1%", width: 38, tone: "blue" },
      { label: "Submitted selections", value: "126 visitors - 1.2%", width: 34, tone: "green" },
      { label: "Requested callback", value: "402 visitors - 3.7%", width: 22, tone: "gold" },
    ],
  },
  "2024": {
    metrics: [
      { label: "Total visits", value: "8,316", change: "8%", iconTone: "violet" },
      { label: "Unique visitors", value: "5,902", change: "10%", iconTone: "blue" },
      { label: "Leads generated", value: "538", change: "13%", iconTone: "green" },
      { label: "Selections submitted", value: "91", change: "5%", iconTone: "gold" },
    ],
    visitsByDay: [
      { label: "Jan", value: 96 }, { label: "Feb", value: 121 }, { label: "Mar", value: 138 },
      { label: "Apr", value: 126 }, { label: "May", value: 154 }, { label: "Jun", value: 166 },
      { label: "Jul", value: 149 }, { label: "Aug", value: 181 }, { label: "Sep", value: 172 },
      { label: "Oct", value: 199 }, { label: "Nov", value: 214 }, { label: "Dec", value: 237 },
    ],
    funnelRows: [
      { label: "Visit -> Lead", value: "6.4%", width: 31, tone: "blue" },
      { label: "Lead -> Qualified", value: "22.1%", width: 54, tone: "green" },
      { label: "Qualified -> Appointed", value: "52%", width: 70, tone: "green" },
    ],
    mostViewedProducts: [
      { product: "Matte Black Tapware", category: "Tapware", views: "1,940", saves: "395", image: "/supplier_section.png", imagePosition: "center 64%" },
      { product: "Coastal Oak 6mm", category: "Flooring", views: "1,764", saves: "362", image: "/hero.png", imagePosition: "center 72%" },
      { product: "Calacatta Quartz 20mm", category: "Benchtop", views: "1,601", saves: "344", image: "/builder_section.png", imagePosition: "center 64%" },
    ],
    savedProducts: [
      { product: "Matte Black Tapware", saves: "395", faves: "168", selected: "37", image: "/supplier_section.png", imagePosition: "center 64%" },
      { product: "Coastal Oak 6mm", saves: "362", faves: "154", selected: "34", image: "/hero.png", imagePosition: "center 72%" },
      { product: "Shaker Cabinetry", saves: "326", faves: "139", selected: "29", image: "/builder_section.png", imagePosition: "right 58%" },
    ],
    behaviourStats: [
      { label: "Saved a product", value: "5,121 visitors - 61.6%", width: 62, tone: "violet" },
      { label: "Return 2+ times", value: "2,918 visitors - 35.1%", width: 35, tone: "blue" },
      { label: "Submitted selections", value: "91 visitors - 1.1%", width: 30, tone: "green" },
      { label: "Requested callback", value: "318 visitors - 3.8%", width: 21, tone: "gold" },
    ],
  },
};
