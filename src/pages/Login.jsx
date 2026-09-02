import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import Logo from "../components/ui/Logo";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, isSupabaseConfigured } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    const { error } = await signIn({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Could not sign in.");
      return;
    }
    toast.success("Welcome back!");
    navigate(location.state?.from?.pathname || "/profile");
  }

  return (
    <section className="auth-section">
      <div className="auth-card">
        <Logo variant="full" size={44} />
        <h1>Login to OpportunityHub</h1>
        <p className="auth-subtitle">Access your saved opportunities, applications and CV.</p>

        {!isSupabaseConfigured && (
          <div className="notice-banner">
            Supabase isn't connected yet, so sign-in is disabled in this environment. Add your
            Supabase credentials to <code>.env</code> to enable real authentication.
          </div>
        )}

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
          <label>
            Password
            <div className="input-with-icon">
              <Lock size={16} />
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </label>
          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>
          <button className="primary-large-button" type="submit" disabled={submitting}>
            <LogIn size={16} /> {submitting ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </section>
  );
}
