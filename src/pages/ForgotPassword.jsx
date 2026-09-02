import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound } from "lucide-react";
import Logo from "../components/ui/Logo";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { sendPasswordReset, isSupabaseConfigured } = useAuth();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      toast.warning("Enter your email address.");
      return;
    }
    setSubmitting(true);
    const { error } = await sendPasswordReset(email);
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Could not send reset email.");
      return;
    }
    setSent(true);
    toast.success("Password reset email sent, if an account exists for that address.");
  }

  return (
    <section className="auth-section">
      <div className="auth-card">
        <Logo variant="full" size={44} />
        <h1>Reset your password</h1>
        <p className="auth-subtitle">
          Enter the email address linked to your account and we'll send a reset link.
        </p>

        {!isSupabaseConfigured && (
          <div className="notice-banner">
            Supabase isn't connected yet, so password recovery emails cannot be sent in this
            environment.
          </div>
        )}

        {sent ? (
          <div className="notice-banner notice-success">
            If an account exists for <strong>{email}</strong>, a password reset link has been
            sent. Check your inbox (and spam folder).
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email address
              <div className="input-with-icon">
                <Mail size={16} />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>
            <button className="primary-large-button" type="submit" disabled={submitting}>
              <KeyRound size={16} /> {submitting ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="auth-switch">
          Remembered your password? <Link to="/login">Back to login</Link>
        </p>
      </div>
    </section>
  );
}
