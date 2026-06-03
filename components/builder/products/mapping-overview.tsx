export function MappingOverview() {
  return (
    <section className="product-panel product-mapping-overview">
      <header><h2>AI mapping overview</h2><p>Overview of AI mapping status across all products.</p></header>
      <div className="product-map-body">
        <div className="product-donut"><strong>74</strong><small>Total</small></div>
        <div className="product-map-legend">
          <p><span className="green" /> Verified & live <strong>65 <small>(87.8%)</small></strong></p>
          <p><span className="amber" /> Pending review <strong>6 <small>(8.1%)</small></strong></p>
          <p><span className="red" /> Flagged <strong>3 <small>(4.1%)</small></strong></p>
        </div>
      </div>
      <footer><span>AI mapping accuracy</span><strong>92%</strong></footer>
      <div className="product-accuracy"><i /></div>
    </section>
  );
}
