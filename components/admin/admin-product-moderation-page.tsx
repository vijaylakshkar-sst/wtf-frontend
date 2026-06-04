import { AdminShell } from "@/components/admin/admin-shell";
import { ChartIcon, EditIcon, EyeIcon, SearchIcon, ShieldIcon, SparklesIcon, TrashIcon } from "@/components/icons";

const moderationStats = [
  { label: "Products in review", value: "34", note: "12 AI mapped", icon: EyeIcon },
  { label: "AI mapping checks", value: "18", note: "6 need validation", icon: SparklesIcon },
  { label: "Quality warnings", value: "9", note: "Images or specs missing", icon: ShieldIcon },
  { label: "Removed this month", value: "4", note: "Policy or duplicate issues", icon: TrashIcon },
] as const;

const moderationActions = [
  { title: "Review products", copy: "Open submitted products, check product details, images, supplier info and approval status.", icon: EyeIcon },
  { title: "Edit products", copy: "Update incorrect categories, descriptions, room mappings, brands and inclusion types.", icon: EditIcon },
  { title: "Remove products", copy: "Remove duplicates, invalid listings, expired products or policy-flagged catalogue items.", icon: TrashIcon },
  { title: "Validate AI mappings", copy: "Confirm AI extracted product category, room mapping, brand and inclusion type before publishing.", icon: SparklesIcon },
  { title: "Monitor product quality", copy: "Track missing assets, low quality metadata, poor visibility scores and repeated moderation issues.", icon: ChartIcon },
] as const;

const products = [
  { name: "Elysian Mixer Gunmetal", supplier: "Elysian Tapware", category: "Tapware", mapping: "Validated", quality: "High", status: "Review" },
  { name: "Calacatta Quartz 20mm", supplier: "Acme Surfaces", category: "Benchtops", mapping: "AI check", quality: "Medium", status: "Pending" },
  { name: "Coastal Oak Hybrid Floor", supplier: "Coastal Flooring Co", category: "Flooring", mapping: "Validated", quality: "High", status: "Approved" },
  { name: "Lumina Built-in Oven", supplier: "Lumina Appliances", category: "Appliances", mapping: "Needs fix", quality: "Low", status: "Flagged" },
] as const;

export function AdminProductModerationPage() {
  return (
    <AdminShell>
      <section className="builder-main admin-main">
        <header className="admin-page-header">
          <div>
            <p>Product moderation</p>
            <h1>Product moderation</h1>
            <span>Review submitted products, validate AI mappings and keep catalogue quality consistent.</span>
          </div>
          <label className="admin-search">
            <SearchIcon size={17} />
            <input aria-label="Search products for moderation" placeholder="Search products..." />
          </label>
        </header>

        <section className="admin-stats" aria-label="Product moderation metrics">
          {moderationStats.map(({ icon: Icon, ...stat }) => (
            <article key={stat.label}>
              <span><Icon size={22} /></span>
              <div>
                <small>{stat.label}</small>
                <strong>{stat.value}</strong>
                <em>{stat.note}</em>
              </div>
            </article>
          ))}
        </section>

        <section className="admin-panel admin-customer-controls admin-product-moderation-controls">
          <header>
            <div><h2>Moderation options</h2><p>Admin tools available for product approval, cleanup, AI validation and quality governance.</p></div>
          </header>
          <div>
            {moderationActions.map(({ icon: Icon, title, copy }) => (
              <article key={title}>
                <Icon size={18} />
                <strong>{title}</strong>
                <span>{copy}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel admin-list-panel admin-product-moderation-table">
          <header>
            <div><h2>Products awaiting moderation</h2><p>Sample moderation queue for supplier catalogue products.</p></div>
            <button type="button">Export</button>
          </header>
          <div className="admin-table">
            <div className="admin-row product-moderation-row admin-row-head"><span>Product</span><span>Supplier</span><span>Category</span><span>AI mapping</span><span>Quality</span><span>Status</span><span>Actions</span></div>
            {products.map((product) => (
              <div className="admin-row product-moderation-row" key={product.name}>
                <strong><i>{product.name.slice(0, 2).toUpperCase()}</i><span>{product.name}<small>Supplier product</small></span></strong>
                <span>{product.supplier}</span>
                <span>{product.category}</span>
                <span>{product.mapping}</span>
                <span>{product.quality}</span>
                <em className={product.status.toLowerCase()}>{product.status}</em>
                <div className="admin-user-actions">
                  <button aria-label={`Review ${product.name}`} title="Review product" type="button"><EyeIcon size={16} /></button>
                  <button aria-label={`Edit ${product.name}`} title="Edit product" type="button"><EditIcon size={16} /></button>
                  <button aria-label={`Validate AI mappings for ${product.name}`} title="Validate AI mappings" type="button"><SparklesIcon size={16} /></button>
                  <button aria-label={`Remove ${product.name}`} className="danger" title="Remove product" type="button"><TrashIcon size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
