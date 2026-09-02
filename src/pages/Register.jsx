import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import Logo from "../components/ui/Logo";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signUp, isSupabaseConfigured } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref") || "";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fullName || !email || password.length < 8) {
      toast.warning("Use your name, email, and a password of at least 8 characters.");
      return;
    }
    setSubmitting(true);
    const { data, error } = await signUp({ email, password, fullName, referralCode });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Could not create your account.");
      return;
    }
    if (data?.user && !data.session) {
      toast.success("Account created! Check your email to confirm your address before logging in.");
      navigate("/login");
    } else {
      toast.success("Account created! Welcome to OpportunityHub.");
      navigate("/profile");
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-card">
        <Logo variant="full" size={44} />
        <h1>Create your account</h1>
        <p className="auth-subtitle">Save opportunities, track applications and build your CV.</p>

        {!isSupabaseConfigured && (
          <div className="notice-banner">
            Supabase isn't connected yet, so registration is disabled in this environment. Add
            your Supabase credentials to <code>.env</code> to enable real accounts.
          </div>
        )}

        {referralCode && (
          <div className="notice-banner notice-info">
            You were referred with code <strong>{referralCode}</strong>. Your referrer may earn a
            reward once you complete a qualifying action.
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full name
            <div className="input-with-icon">
              <User size={16} />
              <input
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </label>
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
          <label>
            Password (8+ characters)
            <div className="input-with-icon">
              <Lock size={16} />
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
          </label>
          <button className="primary-large-button" type="submit" disabled={submitting}>
            <UserPlus size={16} /> {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}
