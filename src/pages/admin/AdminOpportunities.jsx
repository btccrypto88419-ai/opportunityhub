import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Star, Trash2, Plus } from "lucide-react";
import {
  fetchAllOpportunities,
  upsertOpportunityAdmin,
  deleteOpportunityAdmin,
} from "../../services/adminService";
import { useToast } from "../../contexts/ToastContext";
import { CATEGORIES, MODES } from "../../lib/constants";
import { LoadingState, EmptyState } from "../../components/ui/States";

const emptyForm = {
  title: "",
  organization: "",
  category: CATEGORIES[0].slug,
  description: "",
  requirements: "",
  benefits: "",
  location: "",
  mode: "onsite",
  deadline: "",
  application_url: "",
  status: "published",
  is_verified: false,
  is_featured: false,
};

export default function AdminOpportunities() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);
    const { data, error } = await fetchAllOpportunities(statusFilter ? { status: statusFilter } : {});
    if (error) toast.error(error.message);
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function handleApprove(item) {
    const { error } = await upsertOpportunityAdmin({ id: item.id, status: "published" });
    if (error) return toast.error(error.message);
    toast.success("Opportunity published.");
    load();
  }

  async function handleReject(item) {
    const { error } = await upsertOpportunityAdmin({ id: item.id, status: "rejected" });
    if (error) return toast.error(error.message);
    toast.success("Opportunity rejected.");
    load();
  }

  async function handleToggleFeatured(item) {
    const { error } = await upsertOpportunityAdmin({ id: item.id, is_featured: !item.is_featured });
    if (error) return toast.error(error.message);
    load();
  }

  async function handleToggleVerified(item) {
    const { error } = await upsertOpportunityAdmin({ id: item.id, is_verified: !item.is_verified });
    if (error) return toast.error(error.message);
    load();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this opportunity permanently?")) return;
    const { error } = await deleteOpportunityAdmin(id);
    if (error) return toast.error(error.message);
    toast.success("Deleted.");
    load();
  }

  async function handleCreate(e) {
    e.preventDefault();
    const { error } = await upsertOpportunityAdmin(form);
    if (error) return toast.error(error.message);
    toast.success("Opportunity created.");
    setForm(emptyForm);
    setFormOpen(false);
    load();
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Opportunities</h2>
        <button className="primary-large-button" onClick={() => setFormOpen(true)}>
          <Plus size={16} /> New opportunity
        </button>
      </div>

      <div className="admin-filter-row">
        {["", "pending", "published", "rejected"].map((s) => (
          <button
            key={s || "all"}
            className={statusFilter === s ? "filter-pill active" : "filter-pill"}
            onClick={() => setStatusFilter(s)}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {loading && <LoadingState label="Loading opportunities…" />}

      {!loading && items.length === 0 && (
        <EmptyState title="No opportunities" description="Nothing matches this filter yet." />
      )}

      {!loading && items.length > 0 && (
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <div className="admin-table-sub">{item.organization}</div>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <span className={`status-pill status-${item.status}`}>{item.status}</span>
                  </td>
                  <td>
                    <button className="icon-toggle" onClick={() => handleToggleFeatured(item)}>
                      <Star size={15} fill={item.is_featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td>
                    <button className="icon-toggle" onClick={() => handleToggleVerified(item)}>
                      <CheckCircle2 size={15} fill={item.is_verified ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="admin-table-actions">
                    {item.status === "pending" && (
                      <>
                        <button title="Approve" onClick={() => handleApprove(item)}>
                          <CheckCircle2 size={15} />
                        </button>
                        <button title="Reject" onClick={() => handleReject(item)}>
                          <XCircle size={15} />
                        </button>
                      </>
                    )}
                    <button title="Delete" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && setFormOpen(false)}>
          <div className="modal modal-wide">
            <div className="modal-header">
              <h2>New opportunity</h2>
              <button onClick={() => setFormOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-grid-2">
                <input
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
                <input
                  placeholder="Organization"
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  required
                />
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                  {MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
              <textarea
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
              <textarea
                placeholder="Requirements"
                rows={2}
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              />
              <textarea
                placeholder="Benefits"
                rows={2}
                value={form.benefits}
                onChange={(e) => setForm({ ...form, benefits: e.target.value })}
              />
              <input
                type="url"
                placeholder="Official application URL"
                value={form.application_url}
                onChange={(e) => setForm({ ...form, application_url: e.target.value })}
                required
              />
              <button className="primary-large-button" type="submit">
                Create &amp; publish
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
