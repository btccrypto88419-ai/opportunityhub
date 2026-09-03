import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { fetchSiteSettings, updateSiteSettings } from "../../services/adminService";
import { useToast } from "../../contexts/ToastContext";
import { LoadingState } from "../../components/ui/States";
import { DEFAULT_REFERRAL_REWARD_USDT } from "../../lib/constants";

export default function AdminSettings() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    referral_reward_usdt: DEFAULT_REFERRAL_REWARD_USDT,
    site_name: "OpportunityHub",
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await fetchSiteSettings();
      if (data) setSettings((prev) => ({ ...prev, ...data }));
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const { error } = await updateSiteSettings(settings);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved.");
  }

  if (loading) return <LoadingState label="Loading settings…" />;

  return (
    <div>
      <h2>Site settings</h2>
      <form onSubmit={handleSave} className="auth-form" style={{ maxWidth: 420 }}>
        <label>
          Referral reward (USDT)
          <input
            type="number"
            step="0.1"
            value={settings.referral_reward_usdt}
            onChange={(e) => setSettings({ ...settings, referral_reward_usdt: e.target.value })}
          />
        </label>
        <label>
          Site name
          <input
            value={settings.site_name}
            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
          />
        </label>
        <button className="primary-large-button" type="submit" disabled={saving}>
          <Save size={16} /> {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
