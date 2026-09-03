import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Save, Copy, Users, Bookmark, ClipboardList, FileText, Bell, Gift } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { updateProfile } from "../services/profileService";
import { buildReferralLink } from "../services/referralService";
import { LoadingState } from "../components/ui/States";

export default function Profile() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    location: "",
    education: "",
    skills: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        education: profile.education || "",
        skills: (profile.skills || []).join(", "),
      });
    }
  }, [profile]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const { error } = await updateProfile(user.id, {
      full_name: form.full_name,
      phone: form.phone,
      location: form.location,
      education: form.education,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setSaving(false);
    if (error) {
      toast.error(error.message || "Could not update profile.");
      return;
    }
    toast.success("Profile updated.");
    refreshProfile();
  }

  function copyReferralLink() {
    if (!profile?.referral_code) return;
    navigator.clipboard.writeText(buildReferralLink(profile.referral_code));
    toast.success("Referral link copied.");
  }

  if (loading) return <LoadingState label="Loading your profile…" />;

  return (
    <section className="section">
      <div className="container profile-layout">
        <div className="profile-main">
          <div className="section-heading">
            <div>
              <span className="section-label">YOUR ACCOUNT</span>
              <h2>Profile</h2>
            </div>
          </div>

          <form onSubmit={handleSave} className="auth-form profile-form">
            <label>
              Full name
              <input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </label>
            <label>
              Email
              <input value={user?.email || ""} disabled />
            </label>
            <label>
              Phone
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label>
              Location
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </label>
            <label>
              Education
              <textarea
                rows={2}
                value={form.education}
                onChange={(e) => setForm({ ...form, education: e.target.value })}
              />
            </label>
            <label>
              Skills (comma-separated)
              <input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
              />
            </label>
            <button className="primary-large-button" type="submit" disabled={saving}>
              <Save size={16} /> {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>

        <aside className="profile-sidebar">
          <div className="sidebar-card">
            <h3>
              <Users size={16} /> Referral program
            </h3>
            {profile?.referral_code ? (
              <>
                <p>Share your link — you may earn a reward when someone you refer completes a qualifying action.</p>
                <div className="referral-code-box">
                  <code>{buildReferralLink(profile.referral_code)}</code>
                  <button onClick={copyReferralLink} aria-label="Copy referral link">
                    <Copy size={14} />
                  </button>
                </div>
              </>
            ) : (
              <p>Your referral code will appear here once your profile finishes setting up.</p>
            )}
          </div>

          <div className="sidebar-card sidebar-links">
            <Link to="/saved">
              <Bookmark size={15} /> Saved opportunities
            </Link>
            <Link to="/applications">
              <ClipboardList size={15} /> Application tracker
            </Link>
            <Link to="/cv-builder">
              <FileText size={15} /> My CV
            </Link>
            <Link to="/notifications">
              <Bell size={15} /> Notifications
            </Link>
            <Link to="/referrals">
              <Gift size={15} /> Referral history
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
