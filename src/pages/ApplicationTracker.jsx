import React, { useEffect, useState } from "react";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  fetchApplications,
  upsertApplication,
  deleteApplication,
} from "../services/applicationsService";
import { APPLICATION_STATUSES } from "../lib/constants";
import { LoadingState, EmptyState } from "../components/ui/States";

export default function ApplicationTracker() {
  const { user } = useAuth();
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    opportunityTitle: "",
    status: "Saved",
    applicationDate: "",
    deadline: "",
    notes: "",
  });

  async function load() {
    setLoading(true);
    const { data, error } = await fetchApplications(user.id);
    if (error) toast.error(error.message);
    setApplications(data);
    setLoading(false);
  }

  useEffect(() => {
    if (user?.id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleStatusChange(app, status) {
    setApplications((prev) => prev.map((a) => (a.id === app.id ? { ...a, status } : a)));
    const { error } = await upsertApplication({
      id: app.id,
      userId: user.id,
      opportunityId: app.opportunity_id,
      status,
      applicationDate: app.application_date,
      deadline: app.deadline,
      notes: app.notes,
    });
    if (error) toast.error(error.message);
  }

  async function handleDelete(id) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    const { error } = await deleteApplication(id);
    if (error) toast.error(error.message);
    else toast.success("Application removed.");
  }

  async function handleAddManual(e) {
    e.preventDefault();
    if (!form.opportunityTitle) {
      toast.warning("Enter what you're tracking.");
      return;
    }
    // Manual tracker entries not tied to a listing use opportunity_id = null,
    // with the title kept in notes as a lightweight fallback for now.
    const { error, data } = await upsertApplication({
      userId: user.id,
      opportunityId: null,
      status: form.status,
      applicationDate: form.applicationDate,
      deadline: form.deadline,
      notes: `${form.opportunityTitle}${form.notes ? " — " + form.notes : ""}`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setApplications((prev) => [data, ...prev]);
    setForm({ opportunityTitle: "", status: "Saved", applicationDate: "", deadline: "", notes: "" });
    setAddOpen(false);
    toast.success("Added to your tracker.");
  }

  const grouped = APPLICATION_STATUSES.map((status) => ({
    status,
    items: applications.filter((a) => a.status === status),
  }));

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="section-label">STAY ORGANIZED</span>
            <h2>Application tracker</h2>
          </div>
          <button className="primary-large-button" onClick={() => setAddOpen(true)}>
            <Plus size={16} /> Add entry
          </button>
        </div>

        {loading && <LoadingState label="Loading your applications…" />}

        {!loading && applications.length === 0 && (
          <EmptyState
            icon={ClipboardList}
            title="No applications tracked yet"
            description="Save an opportunity and mark it as Applied, or add a manual entry to start tracking."
          />
        )}

        {!loading && applications.length > 0 && (
          <div className="tracker-board">
            {grouped.map((col) => (
              <div key={col.status} className="tracker-column">
                <h3>
                  {col.status} <span className="tracker-count">{col.items.length}</span>
                </h3>
                {col.items.map((app) => (
                  <div key={app.id} className="tracker-card">
                    <strong>{app.opportunity?.title || app.notes || "Untitled"}</strong>
                    {app.opportunity?.organization && <p>{app.opportunity.organization}</p>}
                    <div className="tracker-meta">
                      {app.deadline && <span>Deadline: {app.deadline}</span>}
                      {app.application_date && <span>Applied: {app.application_date}</span>}
                    </div>
                    <div className="tracker-actions">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app, e.target.value)}
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => handleDelete(app.id)} aria-label="Remove">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {addOpen && (
        <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && setAddOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Add tracker entry</h2>
              <button onClick={() => setAddOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <form onSubmit={handleAddManual} className="modal-form">
              <label>
                What are you tracking?
                <input
                  value={form.opportunityTitle}
                  onChange={(e) => setForm({ ...form, opportunityTitle: e.target.value })}
                  placeholder="e.g. Product Design Internship — Company X"
                  required
                />
              </label>
              <label>
                Status
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Application date
                <input
                  type="date"
                  value={form.applicationDate}
                  onChange={(e) => setForm({ ...form, applicationDate: e.target.value })}
                />
              </label>
              <label>
                Deadline
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </label>
              <label>
                Notes
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </label>
              <button className="primary-large-button" type="submit">
                Save entry
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
