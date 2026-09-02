import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { fetchAllPayments, updatePaymentStatus } from "../../services/adminService";
import { useToast } from "../../contexts/ToastContext";
import { LoadingState, EmptyState } from "../../components/ui/States";

export default function AdminPayments() {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await fetchAllPayments();
    if (error) toast.error(error.message);
    setPayments(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStatus(id, status) {
    const { error } = await updatePaymentStatus(id, status);
    if (error) return toast.error(error.message);
    toast.success(`Payment ${status}.`);
    load();
  }

  if (loading) return <LoadingState label="Loading payments…" />;
  if (payments.length === 0) return <EmptyState title="No payments submitted yet" />;

  return (
    <div>
      <h2>Payments</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Reference</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.profile?.full_name || p.user_id}</td>
              <td>
                {p.method.toUpperCase()}
                {p.network ? ` (${p.network})` : ""}
              </td>
              <td>{p.amount}</td>
              <td className="admin-table-sub">{p.reference}</td>
              <td>
                <span className={`status-pill status-${p.status}`}>{p.status}</span>
              </td>
              <td className="admin-table-actions">
                {p.status === "pending" && (
                  <>
                    <button title="Approve" onClick={() => handleStatus(p.id, "approved")}>
                      <CheckCircle2 size={15} />
                    </button>
                    <button title="Reject" onClick={() => handleStatus(p.id, "rejected")}>
                      <XCircle size={15} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
