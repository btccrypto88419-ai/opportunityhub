import React, { useMemo, useState } from "react";

const categories = [
  { name: "Jobs", icon: "💼", description: "Find your next career opportunity" },
  { name: "Internships", icon: "🎓", description: "Gain experience and build your career" },
  { name: "Scholarships", icon: "📚", description: "Find funding for your education" },
  { name: "Fellowships", icon: "🌍", description: "Discover competitive fellowship programs" },
  { name: "Grants", icon: "💰", description: "Find funding opportunities" },
  { name: "Competitions", icon: "🏆", description: "Compete, create and win" },
  { name: "Training", icon: "🧠", description: "Learn valuable new skills" },
  { name: "Volunteer", icon: "🤝", description: "Make an impact and gain experience" },
  { name: "Remote Work", icon: "🌐", description: "Work from anywhere" },
];

const opportunities = [
  {
    id: 1,
    title: "Software Engineering Internship",
    organization: "OpportunityHub",
    type: "Internship",
    location: "Lagos, Nigeria",
    mode: "Remote",
    deadline: "Open",
    description:
      "An opportunity for aspiring software engineers to gain practical experience and develop professional skills.",
  },
  {
    id: 2,
    title: "Graduate Software Developer",
    organization: "Technology Company",
    type: "Job",
    location: "Lagos, Nigeria",
    mode: "Hybrid",
    deadline: "Open",
    description:
      "A graduate-level opportunity for developers looking to begin a career in software engineering.",
  },
  {
    id: 3,
    title: "International Master's Scholarship",
    organization: "Education Foundation",
    type: "Scholarship",
    location: "International",
    mode: "On-site",
    deadline: "Open",
    description:
      "Explore funding opportunities for students pursuing postgraduate education.",
  },
  {
    id: 4,
    title: "Young Professionals Fellowship",
    organization: "Global Foundation",
    type: "Fellowship",
    location: "International",
    mode: "Hybrid",
    deadline: "Open",
    description:
      "A professional development opportunity designed for ambitious young professionals.",
  },
  {
    id: 5,
    title: "Digital Skills Training Program",
    organization: "Skills Academy",
    type: "Training",
    location: "Online",
    mode: "Remote",
    deadline: "Open",
    description:
      "Develop practical digital skills that can help you compete in the modern workforce.",
  },
  {
    id: 6,
    title: "Youth Innovation Competition",
    organization: "Innovation Network",
    type: "Competition",
    location: "Nigeria",
    mode: "Hybrid",
    deadline: "Open",
    description:
      "Present innovative ideas, connect with other young innovators and compete for opportunities.",
  },
];

const resources = [
  {
    title: "How to Write a Great CV",
    description:
      "Learn how to create a professional CV that clearly presents your skills and experience.",
    category: "Career Guide",
  },
  {
    title: "How to Prepare for an Interview",
    description:
      "Practical advice to help you prepare for common interview questions.",
    category: "Interview",
  },
  {
    title: "How to Find Scholarships",
    description:
      "Learn how to search for scholarships and understand eligibility requirements.",
    category: "Education",
  },
  {
    title: "Getting Started With Remote Work",
    description:
      "Understand what employers look for when hiring remote workers.",
    category: "Remote Work",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter((opportunity) => {
      const matchesCategory =
        selectedCategory === "All" ||
        opportunity.type.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !query ||
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.organization.toLowerCase().includes(query) ||
        opportunity.location.toLowerCase().includes(query) ||
        opportunity.type.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const scrollToOpportunities = () => {
    document
      .getElementById("opportunities")
      ?.scrollIntoView({ behavior: "smooth" });

    setMenuOpen(false);
  };

  return (
    <div className="app">
      {/* NAVIGATION */}
      <header className="site-header">
        <div className="container nav-container">
          <a href="#home" className="logo">
            <span className="logo-mark">O</span>
            <span>Opportunity<span className="logo-accent">Hub</span></span>
          </a>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="#opportunities" onClick={() => setMenuOpen(false)}>
              Opportunities
            </a>
            <a href="#categories" onClick={() => setMenuOpen(false)}>
              Categories
            </a>
            <a href="#resources" onClick={() => setMenuOpen(false)}>
              Resources
            </a>
            <a href="#cv-builder" onClick={() => setMenuOpen(false)}>
              CV Builder
            </a>

            <div className="nav-auth">
              <button className="login-button">Log in</button>
              <button className="register-button">Create account</button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <span>✦</span>
                Opportunities worth discovering
              </div>

              <h1>
                Find your next
                <span className="hero-highlight"> opportunity.</span>
              </h1>

              <p className="hero-text">
                Discover jobs, internships, scholarships, fellowships,
                grants, training programs and more — all in one place.
              </p>

              <div className="hero-search">
                <div className="search-input-wrapper">
                  <span className="search-icon">⌕</span>
                  <input
                    type="text"
                    placeholder="Search jobs, scholarships, internships..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All opportunities</option>
                  <option value="Job">Jobs</option>
                  <option value="Internship">Internships</option>
                  <option value="Scholarship">Scholarships</option>
                  <option value="Fellowship">Fellowships</option>
                  <option value="Training">Training</option>
                  <option value="Competition">Competitions</option>
                </select>

                <button
                  className="search-button"
                  onClick={scrollToOpportunities}
                >
                  Search
                </button>
              </div>

              <div className="hero-links">
                <span>Popular:</span>
                <button onClick={() => setSelectedCategory("Job")}>
                  Jobs
                </button>
                <button onClick={() => setSelectedCategory("Internship")}>
                  Internships
                </button>
                <button onClick={() => setSelectedCategory("Scholarship")}>
                  Scholarships
                </button>
                <button onClick={() => setSelectedCategory("Remote Work")}>
                  Remote work
                </button>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-top">
                <span className="live-dot"></span>
                Opportunity discovery
              </div>

              <div className="hero-stat-card">
                <span className="mini-icon">💼</span>
                <div>
                  <strong>Jobs</strong>
                  <small>Career opportunities</small>
                </div>
                <span className="arrow">→</span>
              </div>

              <div className="hero-stat-card">
                <span className="mini-icon">🎓</span>
                <div>
                  <strong>Scholarships</strong>
                  <small>Education funding</small>
                </div>
                <span className="arrow">→</span>
              </div>

              <div className="hero-stat-card">
                <span className="mini-icon">🚀</span>
                <div>
                  <strong>Internships</strong>
                  <small>Build real experience</small>
                </div>
                <span className="arrow">→</span>
              </div>

              <div className="hero-card-footer">
                <span>One platform.</span>
                <strong>Many possibilities.</strong>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="trust-strip">
          <div className="container trust-items">
            <div>
              <strong>9+</strong>
              <span>Opportunity categories</span>
            </div>
            <div>
              <strong>Global</strong>
              <span>Built to expand internationally</span>
            </div>
            <div>
              <strong>Free</strong>
              <span>Core opportunity discovery</span>
            </div>
            <div>
              <strong>Safety first</strong>
              <span>Opportunity information matters</span>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section" id="categories">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">EXPLORE</span>
                <h2>Opportunities for every direction</h2>
              </div>
              <p>
                Whatever stage you're at, discover opportunities that can
                help you move forward.
              </p>
            </div>

            <div className="category-grid">
              {categories.map((category) => (
                <button
                  className="category-card"
                  key={category.name}
                  onClick={() => {
                    setSelectedCategory(category.name.replace("s", ""));
                    scrollToOpportunities();
                  }}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="category-description">
                    {category.description}
                  </span>
                  <span className="category-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* OPPORTUNITIES */}
        <section className="section opportunities-section" id="opportunities">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">DISCOVER</span>
                <h2>Opportunities to explore</h2>
              </div>

              <button
                className="outline-button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                View all
              </button>
            </div>

            <div className="opportunity-toolbar">
              <div className="results-info">
                {filteredOpportunities.length} opportunities
              </div>

              <div className="filter-pills">
                {["All", "Job", "Internship", "Scholarship"].map(
                  (category) => (
                    <button
                      key={category}
                      className={
                        selectedCategory === category ? "active" : ""
                      }
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === "All" ? "All" : `${category}s`}
                    </button>
                  )
                )}
              </div>
            </div>

            {filteredOpportunities.length > 0 ? (
              <div className="opportunity-grid">
                {filteredOpportunities.map((opportunity) => (
                  <article className="opportunity-card" key={opportunity.id}>
                    <div className="opportunity-card-header">
                      <div className="organization-logo">
                        {opportunity.organization.charAt(0)}
                      </div>

                      <button className="save-button" aria-label="Save">
                        ♡
                      </button>
                    </div>

                    <span className="opportunity-type">
                      {opportunity.type}
                    </span>

                    <h3>{opportunity.title}</h3>

                    <p className="organization">
                      {opportunity.organization}
                    </p>

                    <p className="opportunity-description">
                      {opportunity.description}
                    </p>

                    <div className="opportunity-meta">
                      <span>📍 {opportunity.location}</span>
                      <span>◉ {opportunity.mode}</span>
                    </div>

                    <div className="opportunity-footer">
                      <span>
                        Deadline: <strong>{opportunity.deadline}</strong>
                      </span>

                      <button className="view-button">
                        View opportunity →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div>🔎</div>
                <h3>No opportunities found</h3>
                <p>
                  Try another search term or remove some filters.
                </p>
                <button
                  className="register-button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CV BUILDER */}
        <section className="cv-section" id="cv-builder">
          <div className="container cv-grid">
            <div>
              <span className="section-label">YOUR CAREER TOOLKIT</span>
              <h2>Build a CV that represents you.</h2>
              <p>
                Create a professional CV with a simple guided builder. Add
                your education, experience, projects, skills and
                certifications in one place.
              </p>

              <div className="cv-features">
                <span>✓ Professional structure</span>
                <span>✓ Live preview</span>
                <span>✓ PDF-friendly</span>
                <span>✓ Save your CV</span>
              </div>

              <button className="primary-large-button">
                Start building your CV →
              </button>
            </div>

            <div className="cv-preview">
              <div className="cv-paper">
                <div className="cv-line cv-name"></div>
                <div className="cv-line cv-short"></div>
                <div className="cv-divider"></div>
                <div className="cv-line"></div>
                <div className="cv-line"></div>
                <div className="cv-line cv-short"></div>
                <div className="cv-divider"></div>
                <div className="cv-line"></div>
                <div className="cv-line"></div>
                <div className="cv-line cv-medium"></div>
              </div>
            </div>
          </div>
        </section>

        {/* RESOURCES */}
        <section className="section" id="resources">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">CAREER RESOURCES</span>
                <h2>Learn. Prepare. Move forward.</h2>
              </div>

              <p>
                Practical career information designed to help you make
                better decisions.
              </p>
            </div>

            <div className="resource-grid">
              {resources.map((resource) => (
                <article className="resource-card" key={resource.title}>
                  <span>{resource.category}</span>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <button>Read guide →</button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SAFETY */}
        <section className="safety-section">
          <div className="container safety-box">
            <div className="safety-icon">✓</div>

            <div>
              <span className="section-label">STAY SAFE</span>
              <h2>Always verify before you apply.</h2>
              <p>
                OpportunityHub is designed to help people discover
                opportunities, but users should always verify important
                information through the organization's official website
                before sharing personal information or paying any fees.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="final-cta">
          <div className="container">
            <span className="section-label">YOUR NEXT STEP</span>
            <h2>There is an opportunity out there for you.</h2>
            <p>
              Start exploring opportunities and take the next step in your
              career, education or professional journey.
            </p>

            <button
              className="primary-large-button"
              onClick={scrollToOpportunities}
            >
              Explore opportunities →
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#home" className="logo">
              <span className="logo-mark">O</span>
              <span>
                Opportunity<span className="logo-accent">Hub</span>
              </span>
            </a>

            <p>
              Helping people discover legitimate opportunities for work,
              education, funding and growth.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <a href="#opportunities">Jobs</a>
            <a href="#opportunities">Internships</a>
            <a href="#opportunities">Scholarships</a>
            <a href="#opportunities">Fellowships</a>
          </div>

          <div className="footer-column">
            <h4>Platform</h4>
            <a href="#cv-builder">CV Builder</a>
            <a href="#resources">Resources</a>
            <a href="#home">For organizations</a>
            <a href="#home">Submit an opportunity</a>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <a href="#home">About</a>
            <a href="#home">Contact</a>
            <a href="#home">Privacy Policy</a>
            <a href="#home">Terms</a>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} OpportunityHub. All rights
            reserved.
          </span>

          <span>Built for opportunity seekers.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
