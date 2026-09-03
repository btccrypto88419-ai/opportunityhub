import React, { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { fetchSavedOpportunities, getLocalSavedIds } from "../services/savedOpportunitiesService";
import { fetchOpportunities } from "../services/opportunitiesService";
import OpportunityCard from "../components/opportunities/OpportunityCard";
import { useSavedOpportunities } from "../hooks/useSavedOpportunities";
import { LoadingState, EmptyState } from "../components/ui/States";

export default function SavedOpportunities() {
  const { user, isAuthenticated } = useAuth();
  const { savedIds, toggleSave } = useSavedOpportunities();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      if (isAuthenticated && user) {
        const { data } = await fetchSavedOpportunities(user.id);
        if (!cancelled) setItems(data.map((r) => r.opportunity).filter(Boolean));
      } else {
        const ids = getLocalSavedIds();
        if (ids.length === 0) {
          if (!cancelled) setItems([]);
        } else {
          // Guests: fetch all published and filter client-side by id (small dataset expected).
          const { data } = await fetchOpportunities({}, { page: 0, pageSize: 200 });
          if (!cancelled) setItems(data.filter((o) => ids.includes(o.id)));
        }
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, savedIds]);

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="section-label">YOUR LIST</span>
            <h2>Saved opportunities</h2>
          </div>
          <p>
            {isAuthenticated
              ? "Synced to your account across devices."
              : "Saved on this device only — log in to sync across devices."}
          </p>
        </div>

        {loading && <LoadingState label="Loading saved opportunities…" />}

        {!loading && items.length === 0 && (
          <EmptyState
            icon={Bookmark}
            title="Nothing saved yet"
            description="Tap the bookmark icon on any opportunity to save it here for later."
          />
        )}

        {!loading && items.length > 0 && (
          <div className="opportunity-grid">
            {items.map((o) => (
              <OpportunityCard
                key={o.id}
                opportunity={o}
                isSaved={savedIds.has(o.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
