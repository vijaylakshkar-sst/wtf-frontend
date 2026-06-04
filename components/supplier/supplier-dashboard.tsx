import { ChartIcon, EyeIcon, HomeIcon, SearchIcon, StarIcon } from "@/components/icons";
import { SupplierShell } from "@/components/supplier/supplier-shell";

const metrics = [
  { label: "Builders using products", value: "18", note: "+4 this month", icon: HomeIcon },
  { label: "Product interactions", value: "4,820", note: "+18% engagement", icon: EyeIcon },
  { label: "Saved or favourited", value: "1,246", note: "26% save rate", icon: StarIcon },
  { label: "Visibility score", value: "87%", note: "+9% performance", icon: ChartIcon },
] as const;

const builderUsage = [
  { builder: "Metricon Homes", displays: "12 display homes", products: "38 products", saves: "286 saves", status: "High usage" },
  { builder: "Clarendon Homes", displays: "8 display homes", products: "24 products", saves: "174 saves", status: "Growing" },
  { builder: "Henley Homes", displays: "6 display homes", products: "19 products", saves: "141 saves", status: "Active" },
  { builder: "Masterton Homes", displays: "5 display homes", products: "15 products", saves: "96 saves", status: "Active" },
] as const;

const productEngagement = [
  { product: "Elysian Mixer Gunmetal", category: "Tapware", views: "1,240", interactions: "482", saves: "196", performance: 92 },
  { product: "Calacatta Quartz 20mm", category: "Benchtops", views: "1,080", interactions: "421", saves: "172", performance: 88 },
  { product: "Coastal Oak Hybrid Floor", category: "Flooring", views: "890", interactions: "338", saves: "149", performance: 81 },
  { product: "Brushed Brass Kitchen Mixer", category: "Tapware", views: "746", interactions: "291", saves: "118", performance: 76 },
] as const;

const visibilityRows = [
  { label: "Display home placement", value: "64 active rooms", width: "92%" },
  { label: "Customer product opens", value: "2,910 opens", width: "84%" },
  { label: "Saved to selections", value: "1,246 saves", width: "78%" },
  { label: "Builder catalogue matches", value: "38 matched products", width: "66%" },
] as const;

export function SupplierDashboard() {
  return (
    <SupplierShell>
      <section className="builder-main supplier-dashboard-main">
        <header className="dashboard-header supplier-dashboard-header">
          <div>
            <p>Supplier portal</p>
            <h1>Product engagement dashboard</h1>
            <span>Track builder usage, customer interactions, saves, favourites and visibility performance.</span>
          </div>
          <div className="header-actions"><SearchIcon /></div>
        </header>

        <section className="supplier-metric-grid" aria-label="Supplier performance metrics">
          {metrics.map(({ icon: Icon, ...metric }) => (
            <article key={metric.label}>
              <span><Icon size={22} /></span>
              <div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
                <small>{metric.note}</small>
              </div>
            </article>
          ))}
        </section>

        <section className="supplier-dashboard-grid">
          <div className="supplier-panel supplier-builder-panel">
            <header>
              <div><h2>Builders using your products</h2><p>Where your products are currently appearing across builder display homes.</p></div>
              <button type="button">View all</button>
            </header>
            <div className="supplier-builder-list">
              {builderUsage.map((builder) => (
                <article key={builder.builder}>
                  <span>{builder.builder.slice(0, 2).toUpperCase()}</span>
                  <div>
                    <strong>{builder.builder}</strong>
                    <small>{builder.displays} - {builder.products}</small>
                  </div>
                  <em>{builder.saves}</em>
                  <b>{builder.status}</b>
                </article>
              ))}
            </div>
          </div>

          <div className="supplier-panel">
            <header>
              <div><h2>Visibility and engagement performance</h2><p>How often customers see, open and save your products.</p></div>
            </header>
            <div className="supplier-visibility-list">
              {visibilityRows.map((row) => (
                <article key={row.label}>
                  <p><span>{row.label}</span><strong>{row.value}</strong></p>
                  <i><b style={{ width: row.width }} /></i>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="supplier-panel supplier-product-panel">
          <header>
            <div><h2>Products customers are interacting with</h2><p>Views, interactions, saves and favourites by product.</p></div>
            <button type="button">Export report</button>
          </header>
          <div className="supplier-product-table">
            <div className="supplier-product-row head"><span>Product</span><span>Category</span><span>Views</span><span>Interactions</span><span>Saved / fav</span><span>Performance</span></div>
            {productEngagement.map((product) => (
              <div className="supplier-product-row" key={product.product}>
                <strong>{product.product}</strong>
                <span>{product.category}</span>
                <span>{product.views}</span>
                <span>{product.interactions}</span>
                <span>{product.saves}</span>
                <em><i><b style={{ width: `${product.performance}%` }} /></i>{product.performance}%</em>
              </div>
            ))}
          </div>
        </section>
      </section>
    </SupplierShell>
  );
}
