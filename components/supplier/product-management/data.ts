import type { MasterConfig } from "@/components/masters/types";
import type { Product, ProductStatus } from "@/components/builder/products/data";

const statusOptions = ["Active", "Inactive"];

export const supplierMasterConfigs = {
  "product-categories": {
    slug: "product-categories",
    title: "Product Category",
    eyebrow: "Supplier product master",
    description: "Control categories used when suppliers add products, manage inventory and review analytics.",
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
      { id: 3, name: "Tapware", code: "TAP", parent: "Kitchen & bath", status: "Active", description: "Mixers, showers and fittings." },
      { id: 4, name: "Appliances", code: "APPL", parent: "Kitchen", status: "Active", description: "Kitchen and laundry appliances." },
    ],
  },
  "room-mapping": {
    slug: "room-mapping",
    title: "Room Mapping",
    eyebrow: "Supplier product master",
    description: "Define room mappings used when supplier products are shown inside builder display homes.",
    singular: "room mapping",
    fields: [
      { key: "name", label: "Room", placeholder: "Kitchen", required: true },
      { key: "code", label: "Room code", placeholder: "KITCHEN", required: true },
      { key: "defaultCategories", label: "Default categories", placeholder: "Benchtops, Tapware, Appliances" },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "description", label: "Description", type: "textarea", placeholder: "How product mapping should treat this room." },
    ],
    rows: [
      { id: 1, name: "Kitchen", code: "KITCHEN", defaultCategories: "Benchtops, Tapware, Appliances", status: "Active", description: "Primary product mapping room." },
      { id: 2, name: "Living", code: "LIVING", defaultCategories: "Flooring, Lighting, Soft furnishings", status: "Active", description: "Shared living areas and open plans." },
      { id: 3, name: "Bathroom", code: "BATH", defaultCategories: "Tiles, Tapware, Vanity", status: "Active", description: "Bathroom product selections." },
      { id: 4, name: "Ensuite", code: "ENSUITE", defaultCategories: "Tiles, Tapware, Vanity", status: "Active", description: "Master ensuite selections." },
    ],
  },
  brands: {
    slug: "brands",
    title: "Brand Master",
    eyebrow: "Supplier product master",
    description: "Manage supplier-owned brands shown in product setup, product cards and builder catalogues.",
    singular: "brand",
    fields: [
      { key: "name", label: "Brand / supplier", placeholder: "Acme Surfaces", required: true },
      { key: "code", label: "Brand code", placeholder: "ACME", required: true },
      { key: "contact", label: "Contact", placeholder: "trade@acme.com.au" },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "description", label: "Notes", type: "textarea", placeholder: "Catalogue, matching or builder association notes." },
    ],
    rows: [
      { id: 1, name: "Acme Surfaces", code: "ACME", contact: "trade@acmesurfaces.com.au", status: "Active", description: "Primary supplier brand." },
      { id: 2, name: "Acme Premium", code: "ACME-P", contact: "premium@acmesurfaces.com.au", status: "Active", description: "Premium finishes for selected builders." },
    ],
  },
  "inclusion-types": {
    slug: "inclusion-types",
    title: "Inclusion Type",
    eyebrow: "Supplier product master",
    description: "Manage inclusion labels used when products are added, offered to builders or selected by customers.",
    singular: "inclusion type",
    fields: [
      { key: "name", label: "Inclusion type", placeholder: "Standard inclusion", required: true },
      { key: "code", label: "Code", placeholder: "STANDARD", required: true },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "description", label: "Description", type: "textarea", placeholder: "Commercial meaning for this inclusion." },
    ],
    rows: [
      { id: 1, name: "Standard inclusion", code: "STANDARD", status: "Active", description: "Included in builder package." },
      { id: 2, name: "Upgrade", code: "UPGRADE", status: "Active", description: "Paid upgrade or premium product." },
      { id: 3, name: "Optional inclusion", code: "OPTIONAL", status: "Active", description: "Optional add-on for customer selection." },
    ],
  },
} satisfies Record<string, MasterConfig>;

export type SupplierMasterSlug = keyof typeof supplierMasterConfigs;

export const supplierMasterNavigation = [
  { label: "Product Category", href: "/supplier/product-management/product-categories", slug: "product-categories" },
  { label: "Room Mapping", href: "/supplier/product-management/room-mapping", slug: "room-mapping" },
  { label: "Brand Master", href: "/supplier/product-management/brands", slug: "brands" },
  { label: "Inclusion Type", href: "/supplier/product-management/inclusion-types", slug: "inclusion-types" },
] as const;

export const supplierProductCategories = ["All products", "Flooring", "Benchtops", "Tapware", "Appliances"] as const;

export const supplierProductStats = [
  { label: "Total products", value: "42", note: "Supplier catalogue", tone: "gold" },
  { label: "Live with builders", value: "31", note: "Mapped to display homes", tone: "green" },
  { label: "Pending review", value: "8", note: "Awaiting verification", tone: "amber" },
  { label: "Draft products", value: "3", note: "Incomplete setup", tone: "red" },
] as const;

export const supplierProducts: Product[] = [
  { id: 1, name: "Elysian Mixer Gunmetal", supplier: "Acme Surfaces", room: "Ensuite", category: "Tapware", status: "Verified" as ProductStatus, image: "/supplier_section.png", imagePosition: "center 64%" },
  { id: 2, name: "Kitchen Mixer Brushed Brass", supplier: "Acme Premium", room: "Kitchen", category: "Tapware", status: "Verified" as ProductStatus, image: "/supplier_section.png", imagePosition: "center 58%" },
  { id: 3, name: "Calacatta Quartz 20mm", supplier: "Acme Surfaces", room: "Kitchen", category: "Benchtops", status: "AI mapped" as ProductStatus, image: "/builder_section.png", imagePosition: "center 62%" },
  { id: 4, name: "Coastal Oak Hybrid Floor", supplier: "Acme Floors", room: "Living", category: "Flooring", status: "Draft" as ProductStatus, image: "/hero.png", imagePosition: "center 72%" },
];
