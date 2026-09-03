import React, { useEffect, useState } from "react";
import { Users, Copy, Gift, CheckCircle2, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  fetchReferralSummary,
  fetchReferralHistory,
  buildReferralLink,
} from "../services/referralService";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/States";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const STATUS_LABELS = {
  pending: "Pending",
  qualified: "Qualified",
  rewarded: "Rewarded",
  rejected: "Rejected",
};

export default function ReferralHistory() {
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth();
  const toast = useToast();
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    const [summaryRes, historyRes] = await Promise.all([
      fetchReferralSummary(user.id),
      fetchReferralHistory(user.id),
    ]);
    if (summaryRes.error || historyRes.error) {
      setError(
        (summaryRes.error || historyRes.error)?.message ||
          "Could not load your referral information."
      );
    }
    setSummary(Array.isArray(summaryRes.data) ? summaryRes.data[0] : summaryRes.data);
    setHistory(historyRes.data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (user?.id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  function copyReferralLink() {
    if (!profile?.referral_code) return;
    navigator.clipboard.writeText(buildReferralLink(profile.referral_code));
    toast.success("Referral link copied.");
  }

  if (authLoading) return <LoadingState label="Checking your session…" />;

  if (!isAuthenticated) {
    return (
      <section className="section">
        <div className="container narrow">
          <EmptyState
            icon={Users}
            title="Log in to see your referral history"
            description="Your referral link, rewards and referral activity are tied to your account."
          />
        </div>
      </section>
    );
  }

  const totalReferred = summary?.total_referred ?? 0;
  const totalRewarded = summary?.total_rewarded ?? 0;
  const totalEarned = summary?.total_earned ?? 0;
  const totalPending = Math.max(totalReferred - totalRewarded, 0);

  return (
    <section className="section">
      <div className="container narrow">
        <div className="section-heading">
          <div>
            <span className="section-label">YOUR ACCOUNT</span>
            <h2>Referral history</h2>
          </div>
          <p>Share your link — you may earn a reward when someone you refer completes a qualifying payment.</p>
        </div>

        {profile?.referral_code ? (
          <div className="referral-code-box referral-code-box-standalone">
            <code>{buildReferralLink(profile.referral_code)}</code>
            <button onClick={copyReferralLink} aria-label="Copy referral link">
              <Copy size={14} />
            </button>
          </div>
        ) : (
          <div className="notice-banner notice-info">
            Your referral code will appear here once your profile finishes setting up.
          </div>
        )}

        {loading && <LoadingState label="Loading your referral activity…" />}

        {!loading && error && (
          <ErrorState
            title="Couldn't load your referral information"
            description={error}
            onRetry={load}
          />
        )}

        {!loading && !error && (
          <>
            <div className="admin-stat-grid referral-stat-grid">
              <div className="admin-stat-card">
                <Users size={20} />
                <strong>{totalReferred}</strong>
                <span>Total referrals</span>
              </div>
              <div className="admin-stat-card">
                <CheckCircle2 size={20} />
                <strong>{totalRewarded}</strong>
                <span>Successful / rewarded</span>
              </div>
              <div className="admin-stat-card">
                <Clock size={20} />
                <strong>{totalPending}</strong>
                <span>Pending / unqualified</span>
              </div>
              <div className="admin-stat-card">
                <Gift size={20} />
                <strong>{totalEarned} USDT</strong>
                <span>Rewards earned</span>
              </div>
            </div>

            <h3 className="referral-history-heading">Referral activity</h3>

            {history.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No referrals yet"
                description="Share your referral link above — once someone signs up with it, they'll show up here."
              />
            ) : (
              <div className="referral-history-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Referred user</th>
                      <th>Status</th>
                      <th>Reward</th>
                      <th>Joined</th>
                      <th>Rewarded on</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((r) => (
                      <tr key={r.id}>
                        <td>{r.referred_full_name || "A referred user"}</td>
                        <td>
                          <span className={`status-pill status-${r.status}`}>
                            {STATUS_LABELS[r.status] || r.status}
                          </span>
                        </td>
                        <td>{r.reward_amount ? `${r.reward_amount} USDT` : "—"}</td>
                        <td>{formatDate(r.created_at)}</td>
                        <td>{formatDate(r.rewarded_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
