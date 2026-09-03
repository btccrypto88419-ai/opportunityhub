import React, { useEffect, useState } from "react";
import { Bell, CheckCheck, CircleDot } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationsService";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/States";
import { useNotificationsRefresh } from "../contexts/NotificationsRefreshContext";

const TYPE_LABELS = {
  payment_approved: "Payment approved",
  payment_rejected: "Payment rejected",
  referral_reward: "Referral reward",
  application_reminder: "Application reminder",
  new_opportunity: "New opportunity",
  deadline_approaching: "Deadline approaching",
  general: "Notification",
};

function formatDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Notifications() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const toast = useToast();
  const { notifyChanged } = useNotificationsRefresh();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  async function load() {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    const { data, error } = await fetchNotifications(user.id);
    if (error) setError(error.message || "Could not load your notifications.");
    setNotifications(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (user?.id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleMarkRead(notification) {
    if (notification.is_read) return;
    // optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
    );
    const { error } = await markNotificationRead(notification.id);
    if (error) {
      toast.error(error.message || "Could not mark this notification as read.");
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: false } : n))
      );
      return;
    }
    notifyChanged();
  }

  async function handleMarkAllRead() {
    if (!user?.id) return;
    setMarkingAll(true);
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    const { error } = await markAllNotificationsRead(user.id);
    setMarkingAll(false);
    if (error) {
      toast.error(error.message || "Could not mark all notifications as read.");
      setNotifications(previous);
      return;
    }
    toast.success("All notifications marked as read.");
    notifyChanged();
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (authLoading) return <LoadingState label="Checking your session…" />;

  if (!isAuthenticated) {
    return (
      <section className="section">
        <div className="container narrow">
          <EmptyState
            icon={Bell}
            title="Log in to see your notifications"
            description="Notifications are tied to your account — log in to view payment updates, referral rewards and more."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container narrow">
        <div className="section-heading">
          <div>
            <span className="section-label">YOUR ACCOUNT</span>
            <h2>Notifications</h2>
          </div>
          {unreadCount > 0 && (
            <button
              className="outline-button"
              onClick={handleMarkAllRead}
              disabled={markingAll}
            >
              <CheckCheck size={16} /> {markingAll ? "Marking…" : "Mark all as read"}
            </button>
          )}
        </div>

        {loading && <LoadingState label="Loading your notifications…" />}

        {!loading && error && (
          <ErrorState
            title="Couldn't load your notifications"
            description={error}
            onRetry={load}
          />
        )}

        {!loading && !error && notifications.length === 0 && (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="You'll see updates here about your payments, referral rewards, and application deadlines."
          />
        )}

        {!loading && !error && notifications.length > 0 && (
          <ul className="notification-list">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`notification-item ${n.is_read ? "" : "notification-unread"}`}
                onClick={() => handleMarkRead(n)}
              >
                <div className="notification-icon" aria-hidden="true">
                  {!n.is_read && <CircleDot size={10} className="notification-dot" />}
                </div>
                <div className="notification-body">
                  <div className="notification-top">
                    <span className="notification-type">{TYPE_LABELS[n.type] || "Notification"}</span>
                    <span className="notification-date">{formatDateTime(n.created_at)}</span>
                  </div>
                  <h4>{n.title}</h4>
                  {n.message && <p>{n.message}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
