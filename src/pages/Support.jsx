import React, { useState } from "react";
import { Mail, Send, LifeBuoy } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

export default function Support() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.warning("Please fill in all fields.");
      return;
    }
    // No backend endpoint configured yet — direct users to email in the meantime.
    setSubmitted(true);
    toast.success("Thanks — for now, please also email us directly so we see it fast.");
  }

  return (
    <section className="section">
      <div className="container narrow">
        <div className="section-heading">
          <div>
            <span className="section-label">WE'RE HERE TO HELP</span>
            <h2>Support &amp; contact</h2>
          </div>
        </div>

        <div className="notice-banner notice-info">
          <LifeBuoy size={16} style={{ marginRight: 8 }} />
          For account, payment or opportunity issues, email{" "}
          <a href="mailto:support@opportunityhub.app">support@opportunityhub.app</a>. This
          contact form currently records your message locally in this session; a dedicated
          support inbox/integration should be wired up during Supabase setup (see the
          suggested <code>support_tickets</code> table in the SQL migrations).
        </div>

        {submitted ? (
          <div className="notice-banner notice-success">
            Thanks, {form.name.split(" ")[0]}! We've noted your message for this session.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Your name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              Email
              <div className="input-with-icon">
                <Mail size={16} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </label>
            <label>
              Message
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
            <button className="primary-large-button" type="submit">
              <Send size={16} /> Send message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
