import React, { useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { submitOpportunity } from "../services/opportunitiesService";
import { CATEGORIES, MODES } from "../lib/constants";

const initialForm = {
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
  contact_email: "",
};

export default function SubmitOpportunity() {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.organization || !form.description || !form.application_url) {
      toast.warning("Please fill in title, organization, description and application URL.");
      return;
    }
    setSubmitting(true);
    const { error } = await submitOpportunity({ ...form, submitted_by: user?.id || null });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Could not submit this opportunity.");
      return;
    }
    setSubmitted(true);
    toast.success("Submitted! Our team will review it before it goes live.");
  }

  return (
    <section className="section">
      <div className="container narrow">
        <div className="section-heading">
          <div>
            <span className="section-label">SHARE AN OPPORTUNITY</span>
            <h2>Submit an opportunity</h2>
          </div>
          <p>All submissions are reviewed by our team before appearing publicly.</p>
        </div>

        {submitted ? (
          <div className="notice-banner notice-success">
            Thank you! Your submission is pending review. You'll be notified once it's
            approved and published.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-grid-2">
              <label>
                Opportunity title *
                <input value={form.title} onChange={(e) => update("title", e.target.value)} required />
              </label>
              <label>
                Organization *
                <input
                  value={form.organization}
                  onChange={(e) => update("organization", e.target.value)}
                  required
                />
              </label>
              <label>
                Category
                <select value={form.category} onChange={(e) => update("category", e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Mode
                <select value={form.mode} onChange={(e) => update("mode", e.target.value)}>
                  {MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Location
                <input value={form.location} onChange={(e) => update("location", e.target.value)} />
              </label>
              <label>
                Deadline
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => update("deadline", e.target.value)}
                />
              </label>
            </div>

            <label>
              Description *
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                required
              />
            </label>
            <label>
              Requirements
              <textarea
                rows={3}
                value={form.requirements}
                onChange={(e) => update("requirements", e.target.value)}
              />
            </label>
            <label>
              Benefits
              <textarea
                rows={3}
                value={form.benefits}
                onChange={(e) => update("benefits", e.target.value)}
              />
            </label>
            <label>
              Official application URL *
              <input
                type="url"
                value={form.application_url}
                onChange={(e) => update("application_url", e.target.value)}
                placeholder="https://…"
                required
              />
            </label>
            <label>
              Contact email
              <input
                type="email"
                value={form.contact_email}
                onChange={(e) => update("contact_email", e.target.value)}
              />
            </label>

            <button className="primary-large-button" type="submit" disabled={submitting}>
              <Send size={16} /> {submitting ? "Submitting…" : "Submit for review"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
