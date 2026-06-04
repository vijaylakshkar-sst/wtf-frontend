"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoxIcon, GearIcon, GridIcon, HomeIcon, UsersIcon } from "@/components/icons";

export function AdminSidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  return (
    <aside className={`builder-sidebar admin-sidebar${isOpen ? " open" : " closed"}`}>
      <nav aria-label="Admin portal navigation">
        <small>Platform</small>
        <Link className={pathname === "/admin" ? "active" : ""} href="/admin"><GridIcon size={18} /> Dashboard</Link>
        <Link className={pathname.startsWith("/admin/builders") ? "active" : ""} href="/admin/builders"><HomeIcon size={18} /> Builders</Link>
        <Link className={pathname.startsWith("/admin/suppliers") ? "active" : ""} href="/admin/suppliers"><BoxIcon size={18} /> Suppliers</Link>
        <Link className={pathname.startsWith("/admin/customers") ? "active" : ""} href="/admin/customers"><UsersIcon size={18} /> Customers</Link>
        <small>Admin</small>
        <a href="#"><GearIcon size={18} /> Settings</a>
      </nav>
      <div className="builder-sidebar-quote"><strong>Manage the<br />platform flow.</strong><span aria-hidden="true">&rarr;</span></div>
    </aside>
  );
}
