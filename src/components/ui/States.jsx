import React from "react";
import { Loader2, Inbox, AlertTriangle, ServerCog } from "lucide-react";

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="state-block loading-state" role="status">
      <Loader2 className="spin" size={30} />
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={30} />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, onRetry }) {
  return (
    <div className="state-block error-state">
      <AlertTriangle size={30} />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {onRetry && (
        <button className="outline-button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function NotConfiguredNotice({ what = "this feature" }) {
  return (
    <div className="state-block notconfigured-state">
      <ServerCog size={30} />
      <h3>Supabase is not connected yet</h3>
      <p>
        {what.charAt(0).toUpperCase() + what.slice(1)} requires a connected Supabase project.
        Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your{" "}
        <code>.env</code> file and run the SQL migrations in{" "}
        <code>supabase/migrations</code> to enable it.
      </p>
    </div>
  );
}
