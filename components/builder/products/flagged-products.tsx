import { flaggedProducts } from "@/components/builder/products/data";

export function FlaggedProducts({ onReview }: { onReview: (name: string) => void }) {
  return (
    <section className="product-panel flagged-products-panel">
      <header><div><h2>Flagged products</h2><p>Products that need your attention.</p></div><button onClick={() => onReview("all flagged products")} type="button">View all</button></header>
      <div className="flagged-product-list">
        {flaggedProducts.map((product) => (
          <article key={product.name}>
            <div className="flagged-thumb" style={{ backgroundImage: `url("${product.image}")`, backgroundPosition: product.imagePosition }} />
            <div><strong>{product.name} <small>Flagged</small></strong><p>Room: {product.room} <b>&bull;</b> Confidence: {product.confidence}</p></div>
            <button onClick={() => onReview(product.name)} type="button">Review</button>
          </article>
        ))}
      </div>
    </section>
  );
}
