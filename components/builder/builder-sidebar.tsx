"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoxIcon, ChartIcon, ClipboardIcon, GearIcon, GridIcon, HomeIcon, UsersIcon } from "@/components/icons";

export function BuilderSidebar() {
  const pathname = usePathname();

  return (
    <aside className="builder-sidebar">
      <section className="builder-company"><span>AH</span><div><strong>Acme Homes</strong><small>4 display homes active</small></div></section>
      <nav aria-label="Builder portal navigation">
        <small>Main</small>
        <Link className={pathname === "/builder" ? "active" : ""} href="/builder"><GridIcon size={18} /> Dashboard</Link>
        <Link className={pathname.startsWith("/builder/display-homes") ? "active" : ""} href="/builder/display-homes"><HomeIcon size={18} /> Display homes</Link>
        <a href="#"><BoxIcon size={18} /> Products</a>
        <small>Customers</small>
        <a href="#"><UsersIcon size={18} /> Leads <b>7</b></a>
        <a href="#"><ClipboardIcon size={18} /> Selections</a>
        <small>Business</small>
        <a href="#"><ChartIcon size={18} /> Analytics</a>
        <a href="#"><UsersIcon size={18} /> Staff</a>
        <a href="#"><GearIcon size={18} /> Settings</a>
      </nav>
      <div className="builder-sidebar-quote"><strong>Build more.<br />Grow more.</strong><span aria-hidden="true">&rarr;</span></div>
    </aside>
  );
}
