import React, { createContext, useCallback, useContext, useState } from "react";

// Tiny pub/sub so the Notifications page can tell the header's unread badge
// to refetch immediately after marking something read, without lifting all
// notification state into a global store.
const NotificationsRefreshContext = createContext(null);

export function NotificationsRefreshProvider({ children }) {
  const [version, setVersion] = useState(0);
  const notifyChanged = useCallback(() => setVersion((v) => v + 1), []);
  return (
    <NotificationsRefreshContext.Provider value={{ version, notifyChanged }}>
      {children}
    </NotificationsRefreshContext.Provider>
  );
}

export function useNotificationsRefresh() {
  const ctx = useContext(NotificationsRefreshContext);
  if (!ctx) throw new Error("useNotificationsRefresh must be used within a NotificationsRefreshProvider");
  return ctx;
}
