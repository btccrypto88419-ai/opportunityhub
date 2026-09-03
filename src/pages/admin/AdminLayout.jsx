import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Wallet,
  Flag,
  Settings,
} from "lucide-react";

const LINKS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/opportunities", label: "Opportunities", icon: Briefcase },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/payments", label: "Payments", icon: Wallet },
  { to: "/admin/reports", label: "Reports", icon: Flag },
  { to: "/admin/settings", label: "Site settings", icon: Settings },
];

export default function AdminLayout() {
  return (
    <section className="section admin-shell">
      <div className="container admin-layout">
        <aside className="admin-sidebar">
          <h3>Admin dashboard</h3>
          <nav>
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
                <l.icon size={16} /> {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
