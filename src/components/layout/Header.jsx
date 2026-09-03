import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Bookmark,
  ClipboardList,
  User,
  LogOut,
  LayoutDashboard,
  Bell,
  Gift,
} from "lucide-react";
import Logo from "../ui/Logo";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useUnreadNotificationsCount } from "../../hooks/useNotifications";

const NAV_LINKS = [
  { to: "/opportunities", label: "Opportunities" },
  { to: "/jobs", label: "Jobs" },
  { to: "/scholarships", label: "Scholarships" },
  { to: "/internships", label: "Internships" },
  { to: "/cv-builder", label: "CV Builder" },
  { to: "/resources", label: "Resources" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, profile, user, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { unreadCount } = useUnreadNotificationsCount();

  useEffect(() => {
    setOpen(false);
  }, [navigate]);

  async function handleSignOut() {
    await signOut();
    toast.success("You have been signed out.");
    navigate("/");
  }

  const isAdmin = profile?.role === "admin";

  return (
    <header className="site-header">
      <div className="container nav-container">
        <Logo variant="full" size={40} />

        <nav className={`main-nav ${open ? "nav-open" : ""}`} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="nav-auth">
            {isAuthenticated ? (
              <>
                <NavLink to="/saved" className="icon-link" title="Saved opportunities">
                  <Bookmark size={17} /> <span>Saved</span>
                </NavLink>
                <NavLink to="/applications" className="icon-link" title="Application tracker">
                  <ClipboardList size={17} /> <span>Applications</span>
                </NavLink>
                <NavLink to="/referrals" className="icon-link" title="Referral history">
                  <Gift size={17} /> <span>Referrals</span>
                </NavLink>
                <NavLink
                  to="/notifications"
                  className="icon-link nav-notification-link"
                  title="Notifications"
                >
                  <Bell size={17} />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="notification-badge" aria-label={`${unreadCount} unread notifications`}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/profile" className="icon-link" title="Profile">
                  <User size={17} /> <span>{profile?.full_name?.split(" ")[0] || "Profile"}</span>
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className="icon-link" title="Admin dashboard">
                    <LayoutDashboard size={17} /> <span>Admin</span>
                  </NavLink>
                )}
                <button className="login-button" onClick={handleSignOut}>
                  <LogOut size={16} /> <span>Log out</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="login-button">
                  Login
                </NavLink>
                <NavLink to="/register" className="register-button">
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </nav>

        <button
          className="mobile-menu-button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
