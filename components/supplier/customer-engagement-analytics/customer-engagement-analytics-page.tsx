import { BookmarkIcon, EyeIcon, StarIcon, UsersIcon } from "@/components/icons";
import { SupplierShell } from "@/components/supplier/supplier-shell";
import { customerEngagementMetrics, engagementTrendPoints, frequentlyViewedProducts, interestTrends, mostFavoritedProducts, mostSavedProducts } from "@/components/supplier/customer-engagement-analytics/data";

const metricIcons = [BookmarkIcon, StarIcon, EyeIcon, UsersIcon] as const;

export function CustomerEngagementAnalyticsPage() {
  return (
    <SupplierShell>
      <section className="builder-main supplier-engagement-main">
        <header className="supplier-engagement-header">
          <div>
            <p>Supplier / Customer Engagement Analytics</p>
            <h1>Customer Engagement Analytics</h1>
            <span>View products customers save, favourite and repeatedly view during display home visits.</span>
          </div>
        </header>

        <section className="supplier-engagement-metrics" aria-label="Customer engagement metrics">
          {customerEngagementMetrics.map((metric, index) => {
            const Icon = metricIcons[index];
            return (
              <article className={metric.tone} key={metric.label}>
                <span><Icon size={22} /></span>
                <div><small>{metric.label}</small><strong>{metric.value}</strong><em>{metric.note}</em></div>
              </article>
            );
          })}
        </section>

        <section className="supplier-engagement-grid">
          <article className="supplier-panel supplier-trend-card">
            <header><div><h2>Product engagement trends</h2><p>Combined saves, favourites and product opens across recent visits.</p></div></header>
            <svg viewBox="0 0 456 160" role="img" aria-label="Product engagement trend line">
              {[32, 72, 112, 152].map((y) => <line key={y} x1="0" x2="456" y1={y} y2={y} />)}
              <polyline points={engagementTrendPoints} />
            </svg>
            <div className="supplier-trend-days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
          </article>

          <article className="supplier-panel supplier-interest-card">
            <header><div><h2>Customer interest trends</h2><p>Categories customers are saving and favouriting most often.</p></div></header>
            <div className="supplier-interest-list">
              {interestTrends.map((trend) => (
                <article key={trend.label}>
                  <p><span>{trend.label}</span><strong>{trend.value}</strong></p>
                  <i><b style={{ width: trend.width }} /></i>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="supplier-engagement-grid">
          <article className="supplier-panel supplier-engagement-table-card">
            <header><div><h2>Most saved products</h2><p>Products customers save for selections or later review.</p></div></header>
            <div className="supplier-engagement-table">
              <div className="supplier-engagement-row head"><span>Product</span><span>Category</span><span>Saves</span><span>Fav</span><span>Trend</span></div>
              {mostSavedProducts.map((product) => (
                <div className="supplier-engagement-row" key={product.product}>
                  <strong>{product.product}</strong>
                  <span>{product.category}</span>
                  <span>{product.saves}</span>
                  <span>{product.favourites}</span>
                  <em><i><b style={{ width: `${product.trend}%` }} /></i>{product.trend}%</em>
                </div>
              ))}
            </div>
          </article>

          <article className="supplier-panel supplier-engagement-table-card">
            <header><div><h2>Most favourited products</h2><p>Products with strongest direct customer preference signals.</p></div></header>
            <div className="supplier-favourite-list">
              {mostFavoritedProducts.map((product) => (
                <article key={product.product}>
                  <span><StarIcon size={16} /></span>
                  <div><strong>{product.product}</strong><small>{product.category} - {product.saves} saves</small></div>
                  <b>{product.favourites}</b>
                  <em className={product.interest.toLowerCase()}>{product.interest}</em>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="supplier-panel supplier-viewed-card">
          <header><div><h2>Frequently viewed products</h2><p>Products customers open most often inside builder display home experiences.</p></div></header>
          <div className="supplier-viewed-grid">
            {frequentlyViewedProducts.map((product) => (
              <article key={product.product}>
                <strong>{product.product}</strong>
                <span>{product.views} views</span>
                <small>{product.rooms}</small>
                <em>{product.builders}</em>
              </article>
            ))}
          </div>
        </section>
      </section>
    </SupplierShell>
  );
}
