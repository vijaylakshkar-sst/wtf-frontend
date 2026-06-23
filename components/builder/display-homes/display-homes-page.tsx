"use client";

import { useMemo, useState } from "react";
import { BoxIcon, FilterIcon, HomeIcon, SearchIcon, UsersIcon } from "@/components/icons";
import { BuilderShell } from "@/components/builder/builder-shell";
import { CreateDisplayHomeButton } from "@/components/builder/display-homes/create-display-home-button";
import { displayHomes, homeActivity } from "@/components/builder/display-homes/data";
import { HomeCard } from "@/components/builder/display-homes/home-card";
import { ThemedSelect } from "@/components/themed-select";

const statusOptions = ["All status", "Published", "Under review", "Draft"] as const;
const numberFormatter = new Intl.NumberFormat("en-US");

export function DisplayHomesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All status");

  const filteredHomes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return displayHomes.filter((home) => {
      const matchesSearch =
        !query ||
        home.name.toLowerCase().includes(query) ||
        home.address.toLowerCase().includes(query);
      const matchesStatus = status === "All status" || home.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const hasActiveFilter = Boolean(search.trim()) || status !== "All status";

  const homeStats = useMemo(() => {
    const totals = filteredHomes.reduce(
      (acc, home) => {
        acc.visits += home.visits;
        acc.leads += home.leads;
        acc.products += home.products;
        acc.completion += home.completion;
        return acc;
      },
      { visits: 0, leads: 0, products: 0, completion: 0 }
    );

    const averageCompletion = filteredHomes.length ? Math.round(totals.completion / filteredHomes.length) : 0;

    return [
      { icon: HomeIcon, label: "Total homes", value: numberFormatter.format(filteredHomes.length), note: status === "All status" ? "All display homes" : `${status} homes` },
      { icon: UsersIcon, label: "Total visits (30d)", value: numberFormatter.format(totals.visits), note: filteredHomes.length ? `Across ${filteredHomes.length} homes` : "No matching homes" },
      { icon: UsersIcon, label: "Leads generated", value: numberFormatter.format(totals.leads), note: filteredHomes.length ? `Avg. completion ${averageCompletion}%` : "No matching homes" },
      { icon: BoxIcon, label: "Products tagged", value: numberFormatter.format(totals.products), note: filteredHomes.length ? "Filtered results only" : "No matching homes" },
    ];
  }, [filteredHomes, status]);

  const filteredActivities = useMemo(() => {
    if (!filteredHomes.length) return [];

    return homeActivity.filter(([title]) =>
      filteredHomes.some((home) => title.toLowerCase().includes(home.name.toLowerCase()))
    );
  }, [filteredHomes]);

  const topHomes = useMemo(() => [...filteredHomes].sort((left, right) => right.visits - left.visits), [filteredHomes]);
  const activitiesToShow = hasActiveFilter ? filteredActivities : homeActivity;

  return (
    <BuilderShell>
      <section className="builder-main display-homes-main">
        <header className="display-homes-header">
          <div>
            <h1>Display homes</h1>
            <p>
              {numberFormatter.format(filteredHomes.length)} homes <b>&bull;</b>{" "}
              {numberFormatter.format(filteredHomes.filter((home) => home.status === "Published").length)} published{" "}
              <b>&bull;</b> {numberFormatter.format(filteredHomes.filter((home) => home.status === "Draft").length)} draft
            </p>
          </div>
          <div className="display-home-tools">
            <label>
              <SearchIcon size={17} />
              <input aria-label="Search display homes" onChange={(event) => setSearch(event.target.value)} placeholder="Search display homes..." value={search} />
            </label>
            <div className="status-filter">
              <FilterIcon size={15} />
              <ThemedSelect
                ariaLabel="Filter display homes by status"
                className="display-status-select"
                onChange={(value) => setStatus(value as (typeof statusOptions)[number])}
                options={statusOptions.map((option) => ({ label: option, value: option }))}
                placeholder="All status"
                value={status}
              />
            </div>
            <CreateDisplayHomeButton />
          </div>
        </header>
        <section className="home-stats" aria-label="Display home statistics">
          {homeStats.map((stat, index) => {
            const Icon = stat.icon;
            return <article key={stat.label}><div className="builder-metric-icon"><Icon size={19} /></div><div><p>{stat.label}</p><strong>{stat.value}</strong><small className={index ? "positive" : ""}>{index ? "\u2191 " : ""}{stat.note}</small></div></article>;
          })}
        </section>
        <section className="homes-grid" aria-label="Display homes list">
          {filteredHomes.length ? filteredHomes.map((home) => <HomeCard home={home} key={home.name} />) : <div className="display-empty-state">No display homes match your search or status filter.</div>}
        </section>
        <div className="display-bottom-grid">
          <section className="display-bottom-panel activity-list">
            <header><h2>Recent activity</h2><a href="#">View all</a></header>
            {activitiesToShow.length ? activitiesToShow.map(([title, subtitle, time], index) => <article key={title}><span>{index + 1}</span><div><strong>{title}</strong><small>{subtitle}</small></div><time>{time}</time></article>) : <div className="display-empty-state">No activity matches the current filters.</div>}
          </section>
          <section className="display-bottom-panel top-homes">
            <header><h2>Top performing homes</h2><a href="#">View report</a></header>
            {topHomes.length ? topHomes.map((home, index) => <article key={home.name}><b>{index + 1}</b><div className="top-home-thumb" style={{ backgroundImage: `url("${home.image}")`, backgroundPosition: home.position }} /><div><strong>{home.name}</strong><small>{home.address.split(",")[0]}</small></div><span><small>Visits</small>{home.visits}</span><span><small>Leads</small>{home.leads}</span></article>) : <div className="display-empty-state">No homes to rank.</div>}
          </section>
        </div>
      </section>
    </BuilderShell>
  );
}
