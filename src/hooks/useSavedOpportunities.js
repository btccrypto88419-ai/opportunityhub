import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchSavedIds,
  saveOpportunity,
  unsaveOpportunity,
  getLocalSavedIds,
  toggleLocalSaved,
} from "../services/savedOpportunitiesService";

/** Provides a savedIds Set + toggle function that works for guests (localStorage)
 *  and signed-in users (Supabase), transparently. */
export function useSavedOpportunities() {
  const { user, isAuthenticated } = useAuth();
  const [savedIds, setSavedIds] = useState(() => new Set(getLocalSavedIds()));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (isAuthenticated && user) {
        const { data } = await fetchSavedIds(user.id);
        if (!cancelled) setSavedIds(new Set(data));
      } else {
        setSavedIds(new Set(getLocalSavedIds()));
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user]);

  const toggleSave = useCallback(
    async (opportunityId) => {
      if (isAuthenticated && user) {
        const isSaved = savedIds.has(opportunityId);
        // optimistic update
        setSavedIds((prev) => {
          const next = new Set(prev);
          isSaved ? next.delete(opportunityId) : next.add(opportunityId);
          return next;
        });
        if (isSaved) {
          await unsaveOpportunity(user.id, opportunityId);
        } else {
          await saveOpportunity(user.id, opportunityId);
        }
      } else {
        const next = toggleLocalSaved(opportunityId);
        setSavedIds(new Set(next));
      }
    },
    [isAuthenticated, user, savedIds]
  );

  return { savedIds, toggleSave };
}
