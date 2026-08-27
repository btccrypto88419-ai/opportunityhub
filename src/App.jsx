import React, { useState } from "react";

const categories = [
  {
    icon: "💼",
    name: "Jobs",
    description: "Find full-time, part-time, contract and graduate jobs.",
  },
  {
    icon: "🎓",
    name: "Scholarships",
    description: "Discover funding opportunities for your education.",
  },
  {
    icon: "🚀",
    name: "Internships",
    description: "Build experience with internship opportunities.",
  },
  {
    icon: "🌍",
    name: "Fellowships",
    description: "Find fellowships designed for emerging leaders.",
  },
  {
    icon: "💰",
    name: "Grants",
    description: "Discover funding for businesses, projects and ideas.",
  },
  {
    icon: "🏆",
    name: "Competitions",
    description: "Find challenges, prizes and competitions.",
  },
  {
    icon: "📚",
    name: "Training",
    description: "Learn new skills through valuable programs.",
  },
  {
    icon: "🤝",
    name: "Volunteer",
    description: "Find meaningful volunteer opportunities.",
  },
  {
    icon: "💻",
    name: "Remote Work",
    description: "Discover opportunities you can pursue remotely.",
  },
];

const opportunities = [
  {
    id: 1,
    type: "Internship",
    title: "Software Engineering Internship",
    organization: "Opportunity Example",
    location: "Lagos, Nigeria",
    mode: "Hybrid",
    deadline: "Deadline varies",
    description:
      "A sample listing showing how real opportunities will appear on OpportunityHub.",
  },
  {
    id: 2,
    type: "Scholarship",
    title: "International Study Scholarship",
    organization: "Opportunity Example",
    location: "International",
    mode: "Fully Funded",
    deadline: "Deadline varies",
    description:
      "A sample scholarship listing. Real opportunities will be added after verification.",
  },
  {
    id: 3,
    type: "Job",
    title: "Graduate Technology Role",
    organization: "Opportunity Example",
    location: "Nigeria",
    mode: "Full-time",
    deadline: "Deadline varies",
    description:
      "A sample job listing demonstrating the OpportunityHub opportunity system.",
  },
];

const resources = [
  {
    category: "CV & Career",
    title: "How to build a strong CV",
    description:
      "Learn the important sections every professional CV should contain.",
  },
  {
    category: "Applications",
    title: "How to apply for opportunities",
    description:
      "Understand how to prepare before submitting an application.",
  },
  {
    category: "Scholarships",
    title: "Scholarship application guide",
    description:
      "Practical guidance for finding and preparing scholarship applications.",
  },
  {
    category: "Interviews",
    title: "Prepare for your next interview",
    description:
      "Learn how to approach common interview questions with confidence.",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [saved, setSaved] = useState([]);

  const toggleSaved = (id) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesCategory =
      activeCategory === "All" ||
      opportunity.type.toLowerCase() === activeCategory.toLowerCase();

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      opportunity.title.toLowerCase().includes(searchText) ||
      opportunity.organization.toLowerCase().includes(searchText) ||
      opportunity.location.toLowerCase().includes(searchText);

    const matchesLocation =
      !location ||
      opportunity.location.toLowerCase().includes(location.toLowerCase());

    return matchesCategory && matchesSearch && matchesLocation;
  });

  const handleSearch = () => {
    document
      .getElementById("opportunities")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="site-header">
        <div className="container nav-container">

          <a href="#home" className="logo">
            <span className="logo-mark">O</span>
            <span>
              Opportunity<span className="logo-accent">Hub</span>
            </span>
          </a>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open navigation"
          >
            ☰
          </button>

          <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>

            <a href="#opportunities" onClick={() => setMenuOpen(false)}>
              Jobs
            </a>

            <a href="#opportunities" onClick={() => setMenuOpen(false)}>
              Internships
            </a>

            <a href="#opportunities" onClick={() => setMenuOpen(false)}>
              Scholarships
            </a>

            <a href="#categories" onClick={() => setMenuOpen(false)}>
              Opportunities
            </a>

            <a href="#cv" onClick={() => setMenuOpen(false)}>
              CV Builder
            </a>

            <a href="#resources" onClick={() => setMenuOpen(false)}>
              Resources
            </a>

            <div className="nav-auth">
              <button className="login-button">
                Login
              </button>

              <button className="register-button">
                Get Started
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <main>

        <section className="hero" id="home">
          <div className="container hero-grid">

            <div className="hero-content">

              <span className="hero-badge">
                ✦ Your next opportunity starts here
              </span>

              <h1>
                Find your next
                <span className="hero-highlight">
                  opportunity.
                </span>
              </h1>

              <p className="hero-text">
                Discover jobs, internships, scholarships, grants,
                fellowships, training programs and more—all in one
                trusted platform.
              </p>

              <div className="hero-search">

                <div className="search-input-wrapper">
                  <span className="search-icon">⌕</span>

                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </div>

                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Any location</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Remote">Remote</option>
                </select>

                <button
                  className="search-button"
                  onClick={handleSearch}
                >
                  Search
                </button>

              </div>

              <div className="hero-links">
                <span>Popular:</span>

                <button onClick={() => setActiveCategory("Job")}>
                  Jobs
                </button>

                <button onClick={() => setActiveCategory("Internship")}>
                  Internships
                </button>

                <button onClick={() => setActiveCategory("Scholarship")}>
                  Scholarships
                </button>

                <button onClick={() => setActiveCategory("All")}>
                  Remote work
                </button>
              </div>

            </div>

            {/* Hero visual */}

            <div className="hero-card">

              <div className="hero-card-top">
                <span className="live-dot"></span>
                OpportunityHub
              </div>

              <div className="hero-stat-card">
                <span className="mini-icon">💼</span>

                <div>
                  <strong>Jobs</strong>
                  <small>Discover career opportunities</small>
                </div>

                <span className="arrow">→</span>
              </div>

              <div className="hero-stat-card">
                <span className="mini-icon">🎓</span>

                <div>
                  <strong>Scholarships</strong>
                  <small>Find education funding</small>
                </div>

                <span className="arrow">→</span>
              </div>

              <div className="hero-stat-card">
                <span className="mini-icon">🚀</span>

                <div>
                  <strong>Internships</strong>
                  <small>Build valuable experience</small>
                </div>

                <span className="arrow">→</span>
              </div>

              <div className="hero-stat-card">
                <span className="mini-icon">🌍</span>

                <div>
                  <strong>Remote Opportunities</strong>
                  <small>Work from almost anywhere</small>
                </div>

                <span className="arrow">→</span>
              </div>

              <div className="hero-card-footer">
                Built around one simple idea.
                <strong>Make opportunity easier to find.</strong>
              </div>

            </div>

          </div>
        </section>

        {/* ================= TRUST ================= */}

        <section className="trust-strip">
          <div className="container trust-items">

            <div>
              <strong>One platform</strong>
              <span>For multiple opportunity types</span>
            </div>

            <div>
              <strong>Opportunity-first</strong>
              <span>Designed around discovery</span>
            </div>

            <div>
              <strong>Trust focused</strong>
              <span>Clear information and reporting</span>
            </div>

            <div>
              <strong>Built for mobile</strong>
              <span>Designed for everyday users</span>
            </div>

          </div>
        </section>

        {/* ================= CATEGORIES ================= */}

        <section className="section" id="categories">
          <div className="container">

            <div className="section-heading">

              <div>
                <span className="section-label">
                  EXPLORE
                </span>

                <h2>
                  Opportunities for your next move.
                </h2>
              </div>

              <p>
                Whatever stage you are in, discover opportunities
                designed to help you learn, work and grow.
              </p>

            </div>

            <div className="category-grid">

              {categories.map((category) => (
                <button
                  className="category-card"
                  key={category.name}
                  onClick={() => {
                    const typeMap = {
                      Jobs: "Job",
                      Internships: "Internship",
                      Scholarships: "Scholarship",
                    };

                    setActiveCategory(
                      typeMap[category.name] || "All"
                    );

                    document
                      .getElementById("opportunities")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >

                  <span className="category-icon">
                    {category.icon}
                  </span>

                  <span className="category-name">
                    {category.name}
                  </span>

                  <span className="category-description">
                    {category.description}
                  </span>

                  <span className="category-arrow">
                    →
                  </span>

                </button>
              ))}

            </div>

          </div>
        </section>

        {/* ================= OPPORTUNITIES ================= */}

        <section
          className="section opportunities-section"
          id="opportunities"
        >

          <div className="container">

            <div className="section-heading">

              <div>
                <span className="section-label">
                  DISCOVER
                </span>

                <h2>
                  Explore opportunities.
                </h2>
              </div>

              <p>
                Search and filter opportunities to find what
                matches your goals.
              </p>

            </div>

            <div className="opportunity-toolbar">

              <div className="results-info">
                {filteredOpportunities.length} opportunity
                {filteredOpportunities.length !== 1 ? "ies" : ""}
              </div>

              <div className="filter-pills">

                {["All", "Job", "Internship", "Scholarship"].map(
                  (filter) => (
                    <button
                      key={filter}
                      className={
                        activeCategory === filter
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setActiveCategory(filter)
                      }
                    >
                      {filter === "All"
                        ? "All"
                        : `${filter}s`}
                    </button>
                  )
                )}

              </div>

            </div>

            {filteredOpportunities.length > 0 ? (

              <div className="opportunity-grid">

                {filteredOpportunities.map((opportunity) => (

                  <article
                    className="opportunity-card"
                    key={opportunity.id}
                  >

                    <div className="opportunity-card-header">

                      <div className="organization-logo">
                        O
                      </div>

                      <button
                        className="save-button"
                        onClick={() =>
                          toggleSaved(opportunity.id)
                        }
                        aria-label="Save opportunity"
                      >
                        {saved.includes(opportunity.id)
                          ? "♥"
                          : "♡"}
                      </button>

                    </div>

                    <span className="opportunity-type">
                      {opportunity.type}
                    </span>

                    <h3>
                      {opportunity.title}
                    </h3>

                    <p className="organization">
                      {opportunity.organization}
                    </p>

                    <p className="opportunity-description">
                      {opportunity.description}
                    </p>

                    <div className="opportunity-meta">
                      <span>
                        📍 {opportunity.location}
                      </span>

                      <span>
                        • {opportunity.mode}
                      </span>
                    </div>

                    <div className="opportunity-footer">

                      <span>
                        Deadline:{" "}
                        <strong>
                          {opportunity.deadline}
                        </strong>
                      </span>

                      <button className="view-button">
                        View →
                      </button>

                    </div>

                  </article>

                ))}

              </div>

            ) : (

              <div className="empty-state">

                <div>🔎</div>

                <h3>
                  No opportunities found
                </h3>

                <p>
                  Try another search or remove some filters.
                </p>

                <button
                  className="register-button"
                  onClick={() => {
                    setSearch("");
                    setLocation("");
                    setActiveCategory("All");
                  }}
                >
                  Clear filters
                </button>

              </div>

            )}

          </div>
        </section>

        {/* ================= CV BUILDER ================= */}

        <section className="cv-section" id="cv">

          <div className="container cv-grid">

            <div>

              <span className="section-label">
                CAREER TOOLS
              </span>

              <h2>
                Build a CV that gets you noticed.
              </h2>

              <p>
                Create a professional CV with OpportunityHub.
                Add your experience, education, projects and
                skills, then prepare it for applications.
              </p>

              <div className="cv-features">

                <span>✓ Professional structure</span>
                <span>✓ Multiple experiences</span>
                <span>✓ Skills & certifications</span>
                <span>✓ PDF-friendly</span>
                <span>✓ Save your CV</span>

              </div>

              <button className="primary-large-button">
                Build My CV
              </button>

            </div>

            <div className="cv-preview">

              <div className="cv-paper">

                <div className="cv-line cv-name"></div>

                <div className="cv-line cv-short"></div>

                <div className="cv-divider"></div>

                <div className="cv-line cv-medium"></div>
                <div className="cv-line"></div>
                <div className="cv-line cv-short"></div>

                <div className="cv-divider"></div>

                <div className="cv-line cv-medium"></div>
                <div className="cv-line"></div>
                <div className="cv-line"></div>

                <div className="cv-divider"></div>

                <div className="cv-line cv-short"></div>
                <div className="cv-line"></div>

              </div>

            </div>

          </div>

        </section>

        {/* ================= RESOURCES ================= */}

        <section className="section" id="resources">

          <div className="container">

            <div className="section-heading">

              <div>
                <span className="section-label">
                  CAREER RESOURCES
                </span>

                <h2>
                  Get better at finding opportunities.
                </h2>
              </div>

              <p>
                Useful guides designed to help you prepare,
                apply and grow professionally.
              </p>

            </div>

            <div className="resource-grid">

              {resources.map((resource) => (

                <article
                  className="resource-card"
                  key={resource.title}
                >

                  <span>
                    {resource.category}
                  </span>

                  <h3>
                    {resource.title}
                  </h3>

                  <p>
                    {resource.description}
                  </p>

                  <button>
                    Read guide →
                  </button>

                </article>

              ))}

            </div>

          </div>

        </section>

        {/* ================= SAFETY ================= */}

        <section className="safety-section">

          <div className="container">

            <div className="safety-box">

              <div className="safety-icon">
                ✓
              </div>

              <div>

                <h2>
                  Your safety matters.
                </h2>

                <p>
                  OpportunityHub is designed with trust in mind.
                  We will clearly communicate the status of
                  opportunities and provide reporting tools for
                  suspicious, expired or incorrect listings.
                  Always verify important information through the
                  organization's official website before sharing
                  sensitive information or paying any fees.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ================= CTA ================= */}

        <section className="final-cta">

          <div className="container">

            <h2>
              Your next opportunity could be closer than you think.
            </h2>

            <p>
              Search opportunities, build your CV and take the
              next step toward your goals.
            </p>

            <button
              className="primary-large-button"
              onClick={() =>
                document
                  .getElementById("opportunities")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Opportunities
            </button>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="container">

          <div className="footer-grid">

            <div className="footer-brand">

              <a href="#home" className="logo">
                <span className="logo-mark">O</span>

                <span>
                  Opportunity<span className="logo-accent">
                    Hub
                  </span>
                </span>
              </a>

              <p>
                Making it easier to discover jobs, education,
                funding and career opportunities.
              </p>

            </div>

            <div className="footer-column">

              <h4>Explore</h4>

              <a href="#opportunities">
                Jobs
              </a>

              <a href="#opportunities">
                Internships
              </a>

              <a href="#opportunities">
                Scholarships
              </a>

              <a href="#categories">
                All opportunities
              </a>

            </div>

            <div className="footer-column">

              <h4>Career</h4>

              <a href="#cv">
                CV Builder
              </a>

              <a href="#resources">
                Career resources
              </a>

              <a href="#resources">
                Interview guides
              </a>

            </div>

            <div className="footer-column">

              <h4>OpportunityHub</h4>

              <a href="#home">
                About
              </a>

              <a href="#home">
                Contact
              </a>

              <a href="#home">
                Privacy Policy
              </a>

              <a href="#home">
                Terms of Service
              </a>

            </div>

          </div>

          <div className="footer-bottom">

            <span>
              © 2026 OpportunityHub. All rights reserved.
            </span>

            <span>
              Built to make opportunity easier to find.
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default App;
