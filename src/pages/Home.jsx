import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Radio,
} from "lucide-react";
import { CATEGORIES } from "../lib/constants";
import { fetchFeaturedOpportunities } from "../services/opportunitiesService";
import OpportunityCard from "../components/opportunities/OpportunityCard";
import { useSavedOpportunities } from "../hooks/useSavedOpportunities";
import { LoadingState, EmptyState } from "../components/ui/States";

const QUICK_LINKS = [
  { icon: Briefcase, label: "Jobs", to: "/jobs" },
  { icon: Award, label: "Scholarships", to: "/scholarships" },
  { icon: GraduationCap, label: "Internships", to: "/internships" },
  { icon: Globe, label: "Remote Jobs", to: "/remote-jobs" },
];

const GUIDES = [
  { title: "Build a CV that gets noticed", to: "/resources" },
  { title: "Apply with confidence", to: "/resources" },
  { title: "Find real scholarships", to: "/resources" },
  { title: "Avoid scams and fake offers", to: "/resources" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { savedIds, toggleSave } = useSavedOpportunities();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data, error } = await fetchFeaturedOpportunities(6);
      if (cancelled) return;
      if (error) setError(error.message);
      setFeatured(data);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    navigate(`/opportunities?${params.toString()}`);
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="hero-badge">
              <Sparkles size={14} /> Your next opportunity starts here
            </span>
            <h1>
              Find your next <span className="hero-highlight">opportunity.</span>
            </h1>
            <p className="hero-text">
              Discover jobs, internships, scholarships, grants, fellowships, training
              programs and more — verified and organized in one trusted platform built
              for Nigeria, and growing worldwide.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <Search className="search-icon" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  aria-label="Search opportunities"
                />
              </div>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Location"
              >
                <option value="">Any location</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Remote">Remote / International</option>
              </select>
              <button className="search-button" type="submit">
                Search
              </button>
            </form>

            <div className="hero-links">
              Popular:
              {QUICK_LINKS.map((q) => (
                <Link key={q.to} to={q.to}>
                  {q.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <span className="live-dot" /> Live opportunity feed
            </div>
            {QUICK_LINKS.map((q) => (
              <button key={q.to} className="hero-stat-card" onClick={() => navigate(q.to)}>
                <span className="mini-icon">
                  <q.icon size={18} />
                </span>
                <div>
                  <strong>{q.label}</strong>
                  <small>Explore {q.label.toLowerCase()}</small>
                </div>
                <ArrowRight className="arrow" size={16} />
              </button>
            ))}
            <div className="hero-card-footer">
              Built around one simple idea.
              <strong>Make opportunity easier to find.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-items">
          <div>
            <strong>One platform</strong>
            <span>19+ opportunity types in one place</span>
          </div>
          <div>
            <strong>Opportunity-first</strong>
            <span>Designed around discovery, not clutter</span>
          </div>
          <div>
            <strong>Trust focused</strong>
            <span>Verified badges &amp; reporting tools</span>
          </div>
          <div>
            <strong>Built for mobile</strong>
            <span>Made for everyday users on the go</span>
          </div>
        </div>
      </section>

      <section id="categories" className="section">
        <div className="container">
          <span className="section-label">EXPLORE</span>
          <h2>Opportunities for your next move.</h2>
          <div className="category-grid">
            {CATEGORIES.slice(0, 9).map((c) => (
              <Link key={c.slug} to={`/opportunities?category=${c.slug}`} className="category-card">
                <div className="category-icon">
                  <Briefcase size={20} />
                </div>
                <span className="category-name">{c.label}</span>
                <span className="category-description">
                  Explore {c.label.toLowerCase()} opportunities.
                </span>
                <span className="category-arrow">View →</span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link className="outline-button" to="/opportunities">
              View all categories <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section id="opportunities" className="section opportunities-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">DISCOVER</span>
              <h2>Featured opportunities.</h2>
            </div>
            <p>Hand-picked and verified listings currently open for applications.</p>
          </div>

          {loading && <LoadingState label="Loading featured opportunities…" />}
          {!loading && error && (
            <EmptyState
              icon={Radio}
              title="Couldn't load opportunities"
              description={error}
            />
          )}
          {!loading && !error && featured.length === 0 && (
            <EmptyState
              icon={Radio}
              title="No opportunities published yet"
              description="Once opportunities are added and published in Supabase, they will appear here automatically."
            />
          )}
          {!loading && !error && featured.length > 0 && (
            <div className="opportunity-grid">
              {featured.map((o) => (
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

      <section className="cv-section">
        <div className="container cv-grid">
          <div>
            <span className="section-label" style={{ color: "#4c8dff" }}>
              CAREER TOOLS
            </span>
            <h2>Build a CV that gets you noticed.</h2>
            <p>
              Create a professional CV with OpportunityHub. Add your experience, education,
              projects, skills, certifications and languages — then preview and export it
              for applications.
            </p>
            <div className="cv-features">
              <span>Personal Info</span>
              <span>Education</span>
              <span>Experience</span>
              <span>Skills</span>
              <span>Projects</span>
              <span>Certifications</span>
            </div>
            <Link to="/cv-builder" className="primary-large-button">
              Build My CV
            </Link>
          </div>
          <div className="cv-preview">
            <div className="cv-paper">
              <div className="cv-line cv-name" />
              <div className="cv-line cv-short" />
              <div className="cv-divider" />
              <div className="cv-line" />
              <div className="cv-line cv-medium" />
              <div className="cv-line cv-short" />
              <div className="cv-divider" />
              <div className="cv-line cv-medium" />
              <div className="cv-line" />
            </div>
          </div>
        </div>
      </section>

      <section id="resources" className="section">
        <div className="container">
          <span className="section-label">CAREER RESOURCES</span>
          <h2>Get better at finding opportunities.</h2>
          <div className="resource-grid">
            {GUIDES.map((g) => (
              <Link key={g.title} to={g.to} className="resource-card">
                <span>GUIDE</span>
                <h3>{g.title}</h3>
                <p>Practical guidance to help you prepare and apply with confidence.</p>
                <button type="button">Read guide →</button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="safety-section">
        <div className="container">
          <div className="safety-box">
            <div className="safety-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2>Stay safe while applying</h2>
              <p>
                Legitimate opportunities never ask you to pay to be hired or awarded a
                scholarship. Always verify official application links, and use the
                “Report” button on any listing that looks suspicious so our team can review it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#f7f9fc", padding: "55px 0" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
          <div>
            <span className="section-label">CREATOR</span>
            <h2>Created by Ojattah Wisdom</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              OpportunityHub was created to make opportunities easier for students,
              graduates and professionals to discover — starting in Nigeria, built to grow
              internationally.
            </p>
          </div>
          <div>
            <h3>Have an opportunity to share?</h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              Organizations and individuals can submit verified opportunities for review.
              Approved listings appear publicly, with optional featured placement.
            </p>
            <Link className="register-button" to="/submit-opportunity" style={{ display: "inline-block" }}>
              Submit an opportunity
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
