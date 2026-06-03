type ProductTableRow = {
  category?: string;
  faves?: string;
  image: string;
  imagePosition: string;
  product: string;
  saves: string;
  selected?: string;
  views?: string;
};

type ProductAnalyticsTableProps = {
  mode: "viewed" | "saved";
  rows: ProductTableRow[];
  title: string;
};

export function ProductAnalyticsTable({ mode, rows, title }: ProductAnalyticsTableProps) {
  const columns = mode === "viewed" ? ["Product", "Category", "Views", "Saves"] : ["Product", "Saves", "Faves", "Selected"];

  return (
    <section className="analytics-card analytics-product-table-card">
      <header>
        <h2>{title}</h2>
        <button type="button">View all</button>
      </header>
      <div className="analytics-product-table">
        <div className="analytics-product-row head">{columns.map((column) => <span key={column}>{column}</span>)}</div>
        {rows.map((row) => (
          <div className="analytics-product-row" key={row.product}>
            <strong><i style={{ backgroundImage: `url("${row.image}")`, backgroundPosition: row.imagePosition }} />{row.product}</strong>
            {mode === "viewed" ? <span>{row.category}</span> : null}
            {mode === "viewed" ? <span>{row.views}</span> : null}
            <span>{row.saves}</span>
            {mode === "saved" ? <span>{row.faves}</span> : null}
            {mode === "saved" ? <span>{row.selected}</span> : null}
          </div>
        ))}
      </div>
      <footer><button type="button">{mode === "viewed" ? "View all products" : "View all saved products"} <span>→</span></button></footer>
    </section>
  );
}
