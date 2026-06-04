"use client";

import { useMemo, useState } from "react";
import { BoxIcon, ChartIcon, SearchIcon, StarIcon, UsersIcon } from "@/components/icons";
import { SupplierShell } from "@/components/supplier/supplier-shell";
import { builderAssociations, builderAssociationStats } from "@/components/supplier/builder-associations/data";

export function BuilderAssociationsPage() {
  const [query, setQuery] = useState("");
  const [selectedBuilder, setSelectedBuilder] = useState<string>(builderAssociations[0].builder);

  const filteredBuilders = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return builderAssociations;
    return builderAssociations.filter((builder) => [builder.builder, builder.tier, ...builder.products.map((product) => product.name)].join(" ").toLowerCase().includes(search));
  }, [query]);

  const activeBuilder = filteredBuilders.find((builder) => builder.builder === selectedBuilder) ?? filteredBuilders[0] ?? builderAssociations[0];

  return (
    <SupplierShell>
      <section className="builder-main supplier-associations-main">
        <header className="supplier-associations-header">
          <div>
            <p>Supplier / Builder Associations</p>
            <h1>Builder Associations</h1>
            <span>See which builders are using your products, how many they have taken, and exactly which products are active in their display homes.</span>
          </div>
          <label><SearchIcon size={17} /><input onChange={(event) => setQuery(event.target.value)} placeholder="Search builder or product..." value={query} /></label>
        </header>

        <section className="supplier-association-stats" aria-label="Builder association summary">
          {builderAssociationStats.map((stat, index) => {
            const Icon = index === 0 ? UsersIcon : index === 1 ? BoxIcon : index === 2 ? ChartIcon : StarIcon;
            return (
              <article key={stat.label}>
                <span><Icon size={21} /></span>
                <div><small>{stat.label}</small><strong>{stat.value}</strong><em>{stat.note}</em></div>
              </article>
            );
          })}
        </section>

        <section className="supplier-associations-layout">
          <div className="supplier-panel supplier-association-list">
            <header><div><h2>Builders using products</h2><p>{filteredBuilders.length} associated builders found</p></div></header>
            <div>
              {filteredBuilders.map((builder) => (
                <button className={builder.builder === activeBuilder.builder ? "active" : ""} key={builder.builder} onClick={() => setSelectedBuilder(builder.builder)} type="button">
                  <span>{builder.builder.slice(0, 2).toUpperCase()}</span>
                  <div>
                    <strong>{builder.builder}</strong>
                    <small>{builder.productsTaken} products - {builder.displayHomes} display homes</small>
                  </div>
                  <em>{builder.customerSaves} saves</em>
                </button>
              ))}
            </div>
          </div>

          <div className="supplier-panel supplier-association-detail">
            <header>
              <div><h2>{activeBuilder.builder}</h2><p>{activeBuilder.tier} - Last activity {activeBuilder.lastActivity}</p></div>
              <b>{activeBuilder.productsTaken} products taken</b>
            </header>
            <section className="supplier-builder-summary">
              <article><small>Display homes</small><strong>{activeBuilder.displayHomes}</strong></article>
              <article><small>Products used</small><strong>{activeBuilder.productsTaken}</strong></article>
              <article><small>Customer saves</small><strong>{activeBuilder.customerSaves}</strong></article>
            </section>
            <div className="supplier-builder-product-table">
              <div className="supplier-builder-product-row head"><span>Product</span><span>Category</span><span>Room</span><span>Status</span><span>Saves</span></div>
              {activeBuilder.products.map((product) => (
                <div className="supplier-builder-product-row" key={`${activeBuilder.builder}-${product.name}`}>
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                  <span>{product.room}</span>
                  <em className={product.status.toLowerCase()}>{product.status}</em>
                  <b>{product.saves}</b>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </SupplierShell>
  );
}
