import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, MapPin, Clock, BadgeCheck, Star } from "lucide-react";
import { CATEGORY_LABELS } from "../../lib/constants";

function formatDeadline(deadline) {
  if (!deadline) return "Deadline varies";
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return "Deadline varies";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function isClosingSoon(deadline) {
  if (!deadline) return false;
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return false;
  const days = (d.getTime() - Date.now()) / 86400000;
  return days >= 0 && days <= 7;
}

export default function OpportunityCard({ opportunity, isSaved, onToggleSave }) {
  const {
    id,
    title,
    organization,
    category,
    location,
    mode,
    description,
    deadline,
    is_verified,
    is_featured,
    logo_url,
  } = opportunity;

  const closingSoon = isClosingSoon(deadline);

  return (
    <article className={`opportunity-card ${is_featured ? "featured" : ""}`}>
      <div className="opportunity-card-header">
        <div className="organization-logo">
          {logo_url ? (
            <img src={logo_url} alt={`${organization} logo`} />
          ) : (
            (organization || "O").charAt(0).toUpperCase()
          )}
        </div>
        <button
          className="save-button"
          onClick={() => onToggleSave?.(id)}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved opportunities" : "Save this opportunity"}
        >
          {isSaved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
        </button>
      </div>

      <div className="opportunity-badges">
        <span className="opportunity-type">{CATEGORY_LABELS[category] || category}</span>
        {is_verified && (
          <span className="badge badge-verified">
            <BadgeCheck size={12} /> Verified
          </span>
        )}
        {is_featured && (
          <span className="badge badge-featured">
            <Star size={12} /> Featured
          </span>
        )}
      </div>

      <h3>
        <Link to={`/opportunities/${id}`}>{title}</Link>
      </h3>
      <div className="organization">{organization}</div>
      <p className="opportunity-description">{description}</p>

      <div className="opportunity-meta">
        <span>
          <MapPin size={12} /> {location || "Location varies"}
        </span>
        {mode && <span className="opportunity-mode">{mode}</span>}
      </div>

      <div className="opportunity-footer">
        <span className={closingSoon ? "deadline-soon" : ""}>
          <Clock size={12} /> Deadline: <strong>{formatDeadline(deadline)}</strong>
        </span>
        <Link className="view-button" to={`/opportunities/${id}`}>
          View →
        </Link>
      </div>
    </article>
  );
}
