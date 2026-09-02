import React, { useEffect, useState } from "react";
import { Briefcase, Users, Wallet, Flag } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { LoadingState } from "../../components/ui/States";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [opps, users, payments, reports] = await Promise.all([
        supabase.from("opportunities").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({
        opportunities: opps.count || 0,
        users: users.count || 0,
        pendingPayments: payments.count || 0,
        pendingReports: reports.count || 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingState label="Loading dashboard…" />;

  const cards = [
    { icon: Briefcase, label: "Total opportunities", value: stats.opportunities },
    { icon: Users, label: "Registered users", value: stats.users },
    { icon: Wallet, label: "Pending payments", value: stats.pendingPayments },
    { icon: Flag, label: "Pending reports", value: stats.pendingReports },
  ];

  return (
    <div>
      <h2>Overview</h2>
      <div className="admin-stat-grid">
        {cards.map((c) => (
          <div key={c.label} className="admin-stat-card">
            <c.icon size={20} />
            <strong>{c.value}</strong>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
