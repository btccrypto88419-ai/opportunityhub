import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchNotifications } from "../services/notificationsService";
import { useNotificationsRefresh } from "../contexts/NotificationsRefreshContext";

/**
 * Lightweight unread-notification count for the nav badge. Signed-out users
 * always get 0 (notifications are per-account only, no guest/local fallback
 * — there is nothing to show before an account exists).
 */
export function useUnreadNotificationsCount() {
  const { user, isAuthenticated } = useAuth();
  const { version } = useNotificationsRefresh();
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setUnreadCount(0);
      return;
    }
    const { data, error } = await fetchNotifications(user.id);
    if (!error) {
      setUnreadCount((data || []).filter((n) => !n.is_read).length);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refresh();
  }, [refresh, version]);

  return { unreadCount, refreshUnreadCount: refresh };
}
