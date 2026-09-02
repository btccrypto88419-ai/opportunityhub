import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, MODES } from "../../lib/constants";

export default function OpportunityFilters({ filters, onChange, hideCategory = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function update(patch) {
    onChange({ ...filters, ...patch });
  }

  function resetAll() {
    onChange({
      keyword: "",
      category: hideCategory ? filters.category : "",
      location: "",
      mode: "",
      fullyFunded: false,
      sort: "newest",
    });
  }

  return (
    <div className="filters-bar">
      <div className="filters-search">
        <Search size={17} />
        <input
          type="search"
          placeholder="Search by title, organization, or keyword…"
          value={filters.keyword}
          onChange={(e) => update({ keyword: e.target.value })}
          aria-label="Search opportunities"
        />
      </div>

      <button
        className="outline-button filters-toggle"
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
      >
        <SlidersHorizontal size={15} /> Filters
      </button>

      <div className={`filters-panel ${mobileOpen ? "open" : ""}`}>
        {!hideCategory && (
          <select
            value={filters.category}
            onChange={(e) => update({ category: e.target.value })}
            aria-label="Category"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => update({ location: e.target.value })}
          aria-label="Location"
        />

        <select
          value={filters.mode}
          onChange={(e) => update({ mode: e.target.value })}
          aria-label="Work mode"
        >
          <option value="">Any mode</option>
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={filters.fullyFunded}
            onChange={(e) => update({ fullyFunded: e.target.checked })}
          />
          Fully funded only
        </label>

        <select
          value={filters.sort}
          onChange={(e) => update({ sort: e.target.value })}
          aria-label="Sort by"
        >
          <option value="newest">Newest</option>
          <option value="closing_soon">Closing soon</option>
          <option value="featured">Featured first</option>
        </select>

        <button className="outline-button reset-button" onClick={resetAll}>
          <X size={14} /> Reset
        </button>
      </div>
    </div>
  );
}
