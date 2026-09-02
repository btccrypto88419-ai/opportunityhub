import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  BadgeCheck,
  Star,
  Bookmark,
  BookmarkCheck,
  Share2,
  Flag,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { fetchOpportunityById, reportOpportunity } from "../services/opportunitiesService";
import { CATEGORY_LABELS, REPORT_REASONS } from "../lib/constants";
import { useSavedOpportunities } from "../hooks/useSavedOpportunities";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { LoadingState, ErrorState } from "../components/ui/States";

function formatDate(value) {
  if (!value) return "Not specified";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Not specified";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function OpportunityDetails() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0].value);
  const [reportDetails, setReportDetails] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const { savedIds, toggleSave } = useSavedOpportunities();
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data, error } = await fetchOpportunityById(id);
      if (cancelled) return;
      if (error) setError(error.message);
      setOpportunity(data);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: opportunity?.title, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard.");
  }

  async function handleReportSubmit(e) {
    e.preventDefault();
    setSubmittingReport(true);
    const { error } = await reportOpportunity({
      opportunityId: id,
      userId: user?.id,
      reason: reportReason,
      details: reportDetails,
    });
    setSubmittingReport(false);
    if (error) {
      toast.error(error.message || "Could not submit report.");
      return;
    }
    toast.success("Thank you — this has been reported to our team for review.");
    setReportOpen(false);
    setReportDetails("");
  }

  if (loading) return <LoadingState label="Loading opportunity…" />;
  if (error || !opportunity) {
    return (
      <div className="container" style={{ padding: "60px 0" }}>
        <ErrorState
          title="Opportunity not found"
          description={error || "This opportunity may have been removed or is no longer available."}
        />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to="/opportunities" className="outline-button">
            <ArrowLeft size={15} /> Back to opportunities
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = savedIds.has(opportunity.id);

  return (
    <section className="section">
      <div className="container detail-layout">
        <div className="detail-main">
          <Link to="/opportunities" className="back-link">
            <ArrowLeft size={15} /> Back to opportunities
          </Link>

          <div className="detail-header">
            <div className="organization-logo detail-logo">
              {opportunity.logo_url ? (
                <img src={opportunity.logo_url} alt={`${opportunity.organization} logo`} />
              ) : (
                (opportunity.organization || "O").charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="opportunity-badges">
                <span className="opportunity-type">
                  {CATEGORY_LABELS[opportunity.category] || opportunity.category}
                </span>
                {opportunity.is_verified && (
                  <span className="badge badge-verified">
                    <BadgeCheck size={12} /> Verified
                  </span>
                )}
                {opportunity.is_featured && (
                  <span className="badge badge-featured">
                    <Star size={12} /> Featured
                  </span>
                )}
              </div>
              <h1>{opportunity.title}</h1>
              <div className="organization">{opportunity.organization}</div>
              <div className="opportunity-meta">
                <span>
                  <MapPin size={13} /> {opportunity.location || "Location varies"}
                </span>
                {opportunity.mode && <span className="opportunity-mode">{opportunity.mode}</span>}
                <span>
                  <Clock size={13} /> Deadline: {formatDate(opportunity.deadline)}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <a
              className="primary-large-button"
              href={opportunity.application_url || "#"}
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-disabled={!opportunity.application_url}
              onClick={(e) => {
                if (!opportunity.application_url) {
                  e.preventDefault();
                  toast.error("No official application link has been provided for this listing yet.");
                }
              }}
            >
              Apply / Visit opportunity <ExternalLink size={16} />
            </a>
            <button className="outline-button" onClick={() => toggleSave(opportunity.id)}>
              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              {isSaved ? "Saved" : "Save"}
            </button>
            <button className="outline-button" onClick={handleShare}>
              <Share2 size={16} /> Share
            </button>
            <button className="outline-button danger" onClick={() => setReportOpen(true)}>
              <Flag size={16} /> Report
            </button>
          </div>

          <div className="detail-section">
            <h2>About this opportunity</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{opportunity.description}</p>
          </div>

          {opportunity.requirements && (
            <div className="detail-section">
              <h2>Requirements</h2>
              <p style={{ whiteSpace: "pre-wrap" }}>{opportunity.requirements}</p>
            </div>
          )}

          {opportunity.benefits && (
            <div className="detail-section">
              <h2>Benefits</h2>
              <p style={{ whiteSpace: "pre-wrap" }}>{opportunity.benefits}</p>
            </div>
          )}

          <div className="detail-section">
            <h2>How to apply</h2>
            <p>
              Applications are handled entirely by <strong>{opportunity.organization}</strong> on
              their official platform. Use the “Apply / Visit opportunity” button above — never
              pay any fee to apply, and never share sensitive personal or financial information
              outside of the organization's official channels.
            </p>
          </div>
        </div>

        <aside className="detail-sidebar">
          <div className="sidebar-card">
            <h3>Quick facts</h3>
            <dl>
              <dt>Category</dt>
              <dd>{CATEGORY_LABELS[opportunity.category] || opportunity.category}</dd>
              <dt>Location</dt>
              <dd>{opportunity.location || "Not specified"}</dd>
              <dt>Mode</dt>
              <dd style={{ textTransform: "capitalize" }}>{opportunity.mode || "Not specified"}</dd>
              <dt>Deadline</dt>
              <dd>{formatDate(opportunity.deadline)}</dd>
              <dt>Status</dt>
              <dd>{opportunity.is_verified ? "Verified listing" : "Unverified — apply with caution"}</dd>
            </dl>
          </div>
        </aside>
      </div>

      {reportOpen && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => e.target === e.currentTarget && setReportOpen(false)}
        >
          <div className="modal">
            <div className="modal-header">
              <h2>Report this opportunity</h2>
              <button onClick={() => setReportOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="modal-form">
              <label>
                Reason
                <select value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
                  {REPORT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Additional details (optional)
                <textarea
                  rows={4}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Tell us what's wrong with this listing…"
                />
              </label>
              <button className="primary-large-button" type="submit" disabled={submittingReport}>
                {submittingReport ? "Submitting…" : "Submit report"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
