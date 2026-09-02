import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, KeyRound } from "lucide-react";
import Logo from "../components/ui/Logo";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

/** Reached via the password-recovery email link (Supabase redirects here with a session). */
export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { updatePassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) {
      toast.warning("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    const { error } = await updatePassword(password);
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Could not update password.");
      return;
    }
    toast.success("Password updated. You can now log in with your new password.");
    navigate("/login");
  }

  return (
    <section className="auth-section">
      <div className="auth-card">
        <Logo variant="full" size={44} />
        <h1>Set a new password</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            New password
            <div className="input-with-icon">
              <Lock size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
          </label>
          <button className="primary-large-button" type="submit" disabled={submitting}>
            <KeyRound size={16} /> {submitting ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </section>
  );
}
