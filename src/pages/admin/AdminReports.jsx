import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { fetchAllReports, updateReportStatus } from "../../services/adminService";
import { useToast } from "../../contexts/ToastContext";
import { LoadingState, EmptyState } from "../../components/ui/States";

export default function AdminReports() {
  const toast = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await fetchAllReports();
    if (error) toast.error(error.message);
    setReports(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStatus(id, status) {
    const { error } = await updateReportStatus(id, status);
    if (error) return toast.error(error.message);
    toast.success(`Report marked ${status}.`);
    load();
  }

  if (loading) return <LoadingState label="Loading reports…" />;
  if (reports.length === 0) return <EmptyState title="No reports" description="No opportunity has been reported." />;

  return (
    <div>
      <h2>Reports</h2>
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Opportunity</th>
              <th>Reason</th>
              <th>Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.opportunity?.title || "—"}</td>
                <td>{r.reason}</td>
                <td className="admin-table-sub">{r.details || "—"}</td>
                <td>
                  <span className={`status-pill status-${r.status}`}>{r.status}</span>
                </td>
                <td className="admin-table-actions">
                  {r.status === "pending" && (
                    <>
                      <button title="Resolve" onClick={() => handleStatus(r.id, "resolved")}>
                        <CheckCircle2 size={15} />
                      </button>
                      <button title="Dismiss" onClick={() => handleStatus(r.id, "dismissed")}>
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
    </div>
  );
}
