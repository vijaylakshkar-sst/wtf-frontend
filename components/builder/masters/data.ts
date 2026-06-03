export type MasterFieldType = "text" | "select" | "textarea";

export type MasterField = {
  key: string;
  label: string;
  type?: MasterFieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
};

export type MasterRecord = {
  id: number;
  name: string;
  code: string;
  status: "Active" | "Inactive";
  description: string;
  [key: string]: string | number;
};

export type MasterConfig = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  singular: string;
  fields: MasterField[];
  rows: MasterRecord[];
};

const statusOptions = ["Active", "Inactive"];

export const masterConfigs = {
  "storey-types": {
    slug: "storey-types",
    title: "Storey Type",
    eyebrow: "Display home master",
    description: "Manage storey classifications used while creating and filtering display homes.",
    singular: "storey type",
    fields: [
      { key: "name", label: "Storey type", placeholder: "Single storey", required: true },
      { key: "code", label: "Code", placeholder: "SINGLE", required: true },
      { key: "sortOrder", label: "Sort order", placeholder: "1" },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "description", label: "Description", type: "textarea", placeholder: "Where this storey type appears." },
    ],
    rows: [
      { id: 1, name: "Single storey", code: "SINGLE", sortOrder: "1", status: "Active", description: "Used for single-level display homes." },
      { id: 2, name: "Double storey", code: "DOUBLE", sortOrder: "2", status: "Active", description: "Used for two-level display homes." },
    ],
  },
  "target-markets": {
    slug: "target-markets",
    title: "Target Market",
    eyebrow: "Display home master",
    description: "Maintain customer audience tags for display home classification and analytics.",
    singular: "target market",
    fields: [
      { key: "name", label: "Market name", placeholder: "First home buyer", required: true },
      { key: "code", label: "Code", placeholder: "FHB", required: true },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "description", label: "Description", type: "textarea", placeholder: "Audience notes for builder teams." },
    ],
    rows: [
      { id: 1, name: "First home buyer", code: "FHB", status: "Active", description: "Entry-level buyers comparing inclusions and value." },
      { id: 2, name: "Family", code: "FAMILY", status: "Active", description: "Growing families focused on space and room flow." },
      { id: 3, name: "Upsizer", code: "UPSIZE", status: "Active", description: "Customers moving to larger homes." },
      { id: 4, name: "Investor", code: "INVEST", status: "Active", description: "Buyers comparing rentable layouts and upgrades." },
    ],
  },
  brands: {
    slug: "brands",
    title: "Brand Master",
    eyebrow: "Product master",
    description: "Manage suppliers and brands shown in product dropdowns, PDF matching and product cards.",
    singular: "brand",
    fields: [
      { key: "name", label: "Brand / supplier", placeholder: "Caesarstone", required: true },
      { key: "code", label: "Brand code", placeholder: "CAESAR", required: true },
      { key: "contact", label: "Contact", placeholder: "supplier@example.com" },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "description", label: "Notes", type: "textarea", placeholder: "Catalog, matching or procurement notes." },
    ],
    rows: [
      { id: 1, name: "Caesarstone", code: "CAESAR", contact: "trade@caesarstone.com.au", status: "Active", description: "Stone and benchtop supplier." },
      { id: 2, name: "Polytec", code: "POLYTEC", contact: "support@polytec.com.au", status: "Active", description: "Cabinetry and joinery finishes." },
      { id: 3, name: "ABI Interiors", code: "ABI", contact: "trade@abiinteriors.com.au", status: "Active", description: "Tapware and bathroom fittings." },
    ],
  },
  "product-categories": {
    slug: "product-categories",
    title: "Product Category",
    eyebrow: "Product master",
    description: "Control product category dropdowns used by library filters, manual add and customer selections.",
    singular: "category",
    fields: [
      { key: "name", label: "Category", placeholder: "Benchtops", required: true },
      { key: "code", label: "Code", placeholder: "BENCH", required: true },
      { key: "parent", label: "Parent category", placeholder: "Interior" },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "description", label: "Description", type: "textarea", placeholder: "Where this category is used." },
    ],
    rows: [
      { id: 1, name: "Benchtops", code: "BENCH", parent: "Kitchen", status: "Active", description: "Stone, laminate and surface selections." },
      { id: 2, name: "Flooring", code: "FLOOR", parent: "Interior", status: "Active", description: "Timber, hybrid, carpet and tiles." },
      { id: 3, name: "Cabinetry", code: "CAB", parent: "Kitchen", status: "Active", description: "Profiles, doors, panels and finishes." },
      { id: 4, name: "Tapware", code: "TAP", parent: "Kitchen & bath", status: "Active", description: "Mixers, showers and fittings." },
    ],
  },
  "room-mapping": {
    slug: "room-mapping",
    title: "Room Mapping",
    eyebrow: "Display home master",
    description: "Define rooms and default product categories for display home product tagging.",
    singular: "room mapping",
    fields: [
      { key: "name", label: "Room", placeholder: "Kitchen", required: true },
      { key: "code", label: "Room code", placeholder: "KITCHEN", required: true },
      { key: "defaultCategories", label: "Default categories", placeholder: "Benchtops, Cabinetry, Tapware" },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "description", label: "Description", type: "textarea", placeholder: "How AI/product mapping should treat this room." },
    ],
    rows: [
      { id: 1, name: "Kitchen", code: "KITCHEN", defaultCategories: "Benchtops, Cabinetry, Tapware, Appliances", status: "Active", description: "Primary product mapping room." },
      { id: 2, name: "Living", code: "LIVING", defaultCategories: "Flooring, Lighting, Soft furnishings", status: "Active", description: "Shared living areas and open plans." },
      { id: 3, name: "Bathroom", code: "BATH", defaultCategories: "Tiles, Tapware, Vanity, Mirrors", status: "Active", description: "Bathroom product selections." },
      { id: 4, name: "Ensuite", code: "ENSUITE", defaultCategories: "Tiles, Tapware, Vanity", status: "Active", description: "Master ensuite selections." },
    ],
  },
  "inclusion-types": {
    slug: "inclusion-types",
    title: "Inclusion Type",
    eyebrow: "Product master",
    description: "Manage inclusion labels used when products are added or selected by customers.",
    singular: "inclusion type",
    fields: [
      { key: "name", label: "Inclusion type", placeholder: "Standard inclusion", required: true },
      { key: "code", label: "Code", placeholder: "STANDARD", required: true },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "description", label: "Description", type: "textarea", placeholder: "Commercial meaning for this inclusion." },
    ],
    rows: [
      { id: 1, name: "Standard inclusion", code: "STANDARD", status: "Active", description: "Included in the base package." },
      { id: 2, name: "Upgrade", code: "UPGRADE", status: "Active", description: "Paid upgrade or premium product." },
      { id: 3, name: "Optional inclusion", code: "OPTIONAL", status: "Active", description: "Optional add-on for customer selection." },
    ],
  },
} satisfies Record<string, MasterConfig>;

export type MasterSlug = keyof typeof masterConfigs;

export const masterNavigation = [
  { label: "Storey Type", href: "/builder/masters/storey-types", slug: "storey-types" },
  { label: "Target Market", href: "/builder/masters/target-markets", slug: "target-markets" },
  { label: "Brand Master", href: "/builder/masters/brands", slug: "brands" },
  { label: "Product Category", href: "/builder/masters/product-categories", slug: "product-categories" },
  { label: "Room Mapping", href: "/builder/masters/room-mapping", slug: "room-mapping" },
  { label: "Inclusion Type", href: "/builder/masters/inclusion-types", slug: "inclusion-types" },
] as const;
