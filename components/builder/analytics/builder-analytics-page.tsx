"use client";

import { useState } from "react";
import { ClockIcon } from "@/components/icons";
import { AnalyticsMetricCard } from "@/components/builder/analytics/analytics-metric-card";
import { ConversionFunnelCard } from "@/components/builder/analytics/conversion-funnel-card";
import { CustomerBehaviourCard } from "@/components/builder/analytics/customer-behaviour-card";
import { analyticsByYear, analyticsYears, type AnalyticsYear } from "@/components/builder/analytics/data";
import { ProductAnalyticsTable } from "@/components/builder/analytics/product-analytics-table";
import { VisitsLineChart } from "@/components/builder/analytics/visits-line-chart";
import { BuilderShell } from "@/components/builder/builder-shell";

export function BuilderAnalyticsPage() {
  const [selectedYear, setSelectedYear] = useState<AnalyticsYear>("2026");
  const analytics = analyticsByYear[selectedYear];

  return (
    <BuilderShell>
      <main className="builder-main analytics-main">
        <header className="analytics-header">
          <div>
            <h1>Builder Analytics</h1>
            <p>Visitor analytics - Product analytics - Display home analytics - Customer behaviour</p>
          </div>
          <div className="analytics-header-actions">
            <label>
              <ClockIcon size={16} />
              <select aria-label="Analytics year" onChange={(event) => setSelectedYear(event.target.value as AnalyticsYear)} value={selectedYear}>
                {analyticsYears.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
          </div>
        </header>

        <section className="analytics-dashboard">
          <div className="analytics-metric-grid">
            {analytics.metrics.map((metric, index) => <AnalyticsMetricCard index={index} key={metric.label} {...metric} />)}
          </div>

          <div className="analytics-main-grid">
            <VisitsLineChart selectedYear={selectedYear} visits={analytics.visitsByDay} />
            <ConversionFunnelCard rows={analytics.funnelRows} />
          </div>

          <div className="analytics-main-grid">
            <ProductAnalyticsTable mode="viewed" rows={analytics.mostViewedProducts} title="Most viewed products" />
            <ProductAnalyticsTable mode="saved" rows={analytics.savedProducts} title="Most saved & favourited" />
          </div>

          <CustomerBehaviourCard stats={analytics.behaviourStats} />
          <p className="analytics-footnote">All data is based on {selectedYear} and may not reflect real-time updates.</p>
        </section>
      </main>
    </BuilderShell>
  );
}
