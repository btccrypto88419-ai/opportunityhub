import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Compass } from "lucide-react";
import OpportunityFilters from "../components/opportunities/OpportunityFilters";
import OpportunityCard from "../components/opportunities/OpportunityCard";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/States";
import { fetchOpportunities } from "../services/opportunitiesService";
import { useSavedOpportunities } from "../hooks/useSavedOpportunities";
import { CATEGORY_LABELS } from "../lib/constants";

const PAGE_SIZE = 12;

/**
 * Generic opportunities listing.
 * If `fixedCategory` is provided (used by /jobs, /scholarships, etc.), the
 * category filter is locked to that value and hidden from the filter UI.
 */
export default function Opportunities({ fixedCategory = null, pageTitle = null }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    keyword: searchParams.get("q") || "",
    category: fixedCategory || searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    mode: searchParams.get("mode") || "",
    fullyFunded: searchParams.get("funded") === "1",
    sort: searchParams.get("sort") || "newest",
  });
  const [page, setPage] = useState(0);
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { savedIds, toggleSave } = useSavedOpportunities();

  useEffect(() => {
    setPage(0);
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const effectiveFilters = fixedCategory ? { ...filters, category: fixedCategory } : filters;
      const { data, error, count } = await fetchOpportunities(effectiveFilters, {
        page,
        pageSize: PAGE_SIZE,
      });
      if (cancelled) return;
      if (error) setError(error.message);
      setResults(data);
      setCount(count);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [filters, page, fixedCategory]);

  useEffect(() => {
    const params = {};
    if (filters.keyword) params.q = filters.keyword;
    if (!fixedCategory && filters.category) params.category = filters.category;
    if (filters.location) params.location = filters.location;
    if (filters.mode) params.mode = filters.mode;
    if (filters.fullyFunded) params.funded = "1";
    if (filters.sort !== "newest") params.sort = filters.sort;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const title = pageTitle || (fixedCategory ? CATEGORY_LABELS[fixedCategory] : "All opportunities");
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const resultsLabel = useMemo(() => {
    if (loading) return "Searching…";
    if (error) return "";
    if (count === 0) return "No opportunities found";
    return `${count} opportunit${count === 1 ? "y" : "ies"} found`;
  }, [loading, error, count]);

  return (
    <section className="section opportunities-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="section-label">DISCOVER</span>
            <h2>{title}</h2>
          </div>
          <p>Search, filter and save real opportunities that match what you're looking for.</p>
        </div>

        <OpportunityFilters filters={filters} onChange={setFilters} hideCategory={Boolean(fixedCategory)} />

        <div className="opportunity-toolbar">
          <span className="results-info">{resultsLabel}</span>
        </div>

        {loading && <LoadingState label="Loading opportunities…" />}

        {!loading && error && (
          <ErrorState
            title="Couldn't load opportunities"
            description={error}
            onRetry={() => setFilters({ ...filters })}
          />
        )}

        {!loading && !error && results.length === 0 && (
          <EmptyState
            icon={Compass}
            title="No opportunities found"
            description="Try a different keyword, clear your filters, or check back soon — new opportunities are added regularly."
          />
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <div className="opportunity-grid">
              {results.map((o) => (
                <OpportunityCard
                  key={o.id}
                  opportunity={o}
                  isSaved={savedIds.has(o.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="outline-button"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  ← Previous
                </button>
                <span>
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className="outline-button"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
