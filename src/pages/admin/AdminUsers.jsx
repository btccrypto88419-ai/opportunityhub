import React, { useEffect, useState } from "react";
import { fetchAllUsers } from "../../services/adminService";
import { useToast } from "../../contexts/ToastContext";
import { LoadingState, EmptyState } from "../../components/ui/States";

export default function AdminUsers() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await fetchAllUsers();
      if (error) toast.error(error.message);
      setUsers(data);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingState label="Loading users…" />;
  if (users.length === 0) return <EmptyState title="No users yet" />;

  return (
    <div>
      <h2>Users</h2>
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Referral code</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.full_name || "—"}</td>
                <td>
                  <span className={`status-pill ${u.role === "admin" ? "status-approved" : ""}`}>
                    {u.role || "user"}
                  </span>
                </td>
                <td>{u.referral_code || "—"}</td>
                <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
