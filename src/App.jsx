import React, { useMemo, useState } from "react";

const categories = [
  ["💼", "Jobs", "Find full-time, part-time, contract and graduate jobs."],
  ["🎓", "Scholarships", "Discover funding opportunities for your education."],
  ["🚀", "Internships", "Build experience with internship opportunities."],
  ["🌍", "Fellowships", "Find fellowships for emerging leaders."],
  ["💰", "Grants", "Discover funding for projects, businesses and ideas."],
  ["🏆", "Competitions", "Find challenges, prizes and competitions."],
  ["📚", "Training", "Learn valuable skills through training programs."],
  ["🤝", "Volunteer", "Find meaningful volunteer opportunities."],
  ["💻", "Remote Work", "Discover opportunities you can pursue remotely."],
];

const opportunities = [
  {
    id: 1,
    type: "Internship",
    title: "Software Engineering Internship",
    organization: "OpportunityHub",
    location: "Lagos, Nigeria",
    mode: "Hybrid",
    deadline: "Deadline varies",
    description:
      "Build practical software engineering experience through a professional internship opportunity.",
  },
  {
    id: 2,
    type: "Scholarship",
    title: "International Study Scholarship",
    organization: "OpportunityHub",
    location: "International",
    mode: "Fully Funded",
    deadline: "Deadline varies",
    description:
      "Explore funding support for students interested in studying internationally.",
  },
  {
    id: 3,
    type: "Job",
    title: "Graduate Technology Role",
    organization: "OpportunityHub",
    location: "Nigeria",
    mode: "Full-time",
    deadline: "Deadline varies",
    description:
      "A graduate technology opportunity designed for early-career professionals.",
  },
];

const resources = [
  {
    title: "Build a strong CV",
    text: "Learn what employers and organizations look for in a professional CV.",
  },
  {
    title: "Apply with confidence",
    text: "Prepare your documents and applications before submitting them.",
  },
  {
    title: "Find scholarships",
    text: "Learn how to search for scholarships and prepare strong applications.",
  },
  {
    title: "Prepare for interviews",
    text: "Get practical guidance for your next interview.",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All");
  const [saved, setSaved] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCV, setShowCV] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return opportunities.filter((item) => {
      const categoryMatch =
        category === "All" ||
        item.type.toLowerCase() === category.toLowerCase();

      const searchMatch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.organization.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term);

      const locationMatch =
        !location ||
        item.location.toLowerCase().includes(location.toLowerCase());

      return categoryMatch && searchMatch && locationMatch;
    });
  }, [search, location, category]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSearch = () => {
    scrollTo("opportunities");
  };

  const toggleSave = (id) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id]
    );
  };

  const chooseCategory = (name) => {
    const map = {
      Jobs: "Job",
      Internships: "Internship",
      Scholarships: "Scholarship",
    };

    setCategory(map[name] || "All");
    scrollTo("opportunities");
  };

  return (
    <div className="app">
      <header className="site-header">
        <div className="container nav-container">
          <button
            className="logo"
            onClick={() => scrollTo("home")}
            type="button"
          >
            <span className="logo-mark">O</span>
            <span>
              Opportunity<span className="logo-accent">Hub</span>
            </span>
          </button>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
            aria-label="Open navigation"
          >
            ☰
          </button>

          <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`}>
            <button onClick={() => scrollTo("home")}>Home</button>
            <button onClick={() => chooseCategory("Jobs")}>Jobs</button>
            <button onClick={() => chooseCategory("Internships")}>
              Internships
            </button>
            <button onClick={() => chooseCategory("Scholarships")}>
              Scholarships
            </button>
            <button onClick={() => scrollTo("categories")}>
              Opportunities
            </button>
            <button onClick={() => setShowCV(true)}>CV Builder</button>
            <button onClick={() => scrollTo("resources")}>Resources</button>

            <div className="nav-auth">
              <button
                className="login-button"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>

              <button
                className="register-button"
                onClick={() => setShowRegister(true)}
              >
                Get Started
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div className="hero-content">
              <span className="hero-badge">
                ✦ Your next opportunity starts here
              </span>

              <h1>
                Find your next{" "}
                <span className="hero-highlight">opportunity.</span>
              </h1>

              <p className="hero-text">
                Discover jobs, internships, scholarships, grants,
                fellowships, training programs and more — all in one
                trusted platform.
              </p>

              <div className="hero-search">
                <div className="search-input-wrapper">
                  <span className="search-icon">⌕</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder="What are you looking for?"
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
                  <option value="International">International</option>
                </select>

                <button
                  className="search-button"
                  onClick={handleSearch}
                  type="button"
                >
                  Search
                </button>
              </div>

              <div className="hero-links">
                <span>Popular:</span>
                <button onClick={() => chooseCategory("Jobs")}>Jobs</button>
                <button onClick={() => chooseCategory("Internships")}>
                  Internships
                </button>
                <button onClick={() => chooseCategory("Scholarships")}>
                  Scholarships
                </button>
                <button
                  onClick={() => {
                    setLocation("");
                    setCategory("All");
                    scrollTo("opportunities");
                  }}
                >
                  Remote work
                </button>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-top">
                <span className="live-dot" />
                OpportunityHub
              </div>

              {[
                ["💼", "Jobs", "Discover career opportunities"],
                ["🎓", "Scholarships", "Find education funding"],
                ["🚀", "Internships", "Build valuable experience"],
                ["🌍", "Remote Opportunities", "Work from almost anywhere"],
              ].map(([icon, title, text]) => (
                <button
                  className="hero-stat-card"
                  key={title}
                  onClick={() =>
                    title === "Jobs"
                      ? chooseCategory("Jobs")
                      : title === "Internships"
                      ? chooseCategory("Internships")
                      : title === "Scholarships"
                      ? chooseCategory("Scholarships")
                      : scrollTo("opportunities")
                  }
                  type="button"
                >
                  <span className="mini-icon">{icon}</span>
                  <span>
                    <strong>{title}</strong>
                    <small>{text}</small>
                  </span>
                  <span className="arrow">→</span>
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
              <span>Multiple opportunity types</span>
            </div>
            <div>
              <strong>Opportunity-first</strong>
              <span>Designed around discovery</span>
            </div>
            <div>
              <strong>Trust focused</strong>
              <span>Clear information</span>
            </div>
            <div>
              <strong>Built for mobile</strong>
              <span>Easy to use anywhere</span>
            </div>
          </div>
        </section>

        <section className="section" id="categories">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">EXPLORE</span>
                <h2>Opportunities for your next move.</h2>
              </div>
              <p>
                Whatever stage you are in, discover opportunities designed to
                help you learn, work and grow.
              </p>
            </div>

            <div className="category-grid">
              {categories.map(([icon, name, description]) => (
                <button
                  className="category-card"
                  key={name}
                  onClick={() => chooseCategory(name)}
                  type="button"
                >
                  <span className="category-icon">{icon}</span>
                  <span className="category-name">{name}</span>
                  <span className="category-description">
                    {description}
                  </span>
                  <span className="category-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section opportunities-section" id="opportunities">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">DISCOVER</span>
                <h2>Explore opportunities.</h2>
              </div>
              <p>
                Search and filter opportunities to find what matches your
                goals.
              </p>
            </div>

            <div className="opportunity-toolbar">
              <div className="results-info">
                {filtered.length} opportunit
                {filtered.length === 1 ? "y" : "ies"}
              </div>

              <div className="filter-pills">
                {["All", "Job", "Internship", "Scholarship"].map((item) => (
                  <button
                    key={item}
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                    type="button"
                  >
                    {item === "All" ? "All" : `${item}s`}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length ? (
              <div className="opportunity-grid">
                {filtered.map((item) => (
                  <article className="opportunity-card" key={item.id}>
                    <div className="opportunity-card-header">
                      <div className="organization-logo">O</div>

                      <button
                        className="save-button"
                        onClick={() => toggleSave(item.id)}
                        type="button"
                      >
                        {saved.includes(item.id) ? "♥" : "♡"}
                      </button>
                    </div>

                    <span className="opportunity-type">{item.type}</span>

                    <h3>{item.title}</h3>

                    <p className="organization">{item.organization}</p>

                    <p className="opportunity-description">
                      {item.description}
                    </p>

                    <div className="opportunity-meta">
                      <span>📍 {item.location}</span>
                      <span>• {item.mode}</span>
                    </div>

                    <div className="opportunity-footer">
                      <span>
                        Deadline: <strong>{item.deadline}</strong>
                      </span>

                      <button
                        className="view-button"
                        onClick={() => setSelectedOpportunity(item)}
                        type="button"
                      >
                        View →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div>🔎</div>
                <h3>No opportunities found</h3>
                <p>Try another search or remove some filters.</p>

                <button
                  className="register-button"
                  onClick={() => {
                    setSearch("");
                    setLocation("");
                    setCategory("All");
                  }}
                  type="button"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="cv-section" id="cv">
          <div className="container cv-grid">
            <div>
              <span className="section-label">CAREER TOOLS</span>

              <h2>Build a CV that gets you noticed.</h2>

              <p>
                Create a professional CV with OpportunityHub. Add your
                experience, education, projects and skills, then prepare it
                for applications.
              </p>

              <div className="cv-features">
                <span>✓ Professional structure</span>
                <span>✓ Experience & education</span>
                <span>✓ Projects & skills</span>
                <span>✓ PDF-friendly</span>
                <span>✓ Save your CV</span>
              </div>

              <button
                className="primary-large-button"
                onClick={() => setShowCV(true)}
                type="button"
              >
                Build My CV
              </button>
            </div>

            <div className="cv-preview">
              <div className="cv-paper">
                <div className="cv-line cv-name" />
                <div className="cv-line cv-short" />
                <div className="cv-divider" />
                <div className="cv-line cv-medium" />
                <div className="cv-line" />
                <div className="cv-line cv-short" />
                <div className="cv-divider" />
                <div className="cv-line cv-medium" />
                <div className="cv-line" />
                <div className="cv-line" />
                <div className="cv-divider" />
                <div className="cv-line cv-short" />
                <div className="cv-line" />
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="resources">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">CAREER RESOURCES</span>
                <h2>Get better at finding opportunities.</h2>
              </div>
              <p>
                Useful guides designed to help you prepare, apply and grow.
              </p>
            </div>

            <div className="resource-grid">
              {resources.map((resource) => (
                <button
                  className="resource-card"
                  key={resource.title}
                  onClick={() =>
                    window.alert(
                      `${resource.title}\n\n${resource.text}`
                    )
                  }
                  type="button"
                >
                  <span className="section-label">GUIDE</span>
                  <h3>{resource.title}</h3>
                  <p>{resource.text}</p>
                  <span>Read guide →</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <div>
            <strong>OpportunityHub</strong>
            <p>
              Helping students, graduates and professionals discover their
              next opportunity.
            </p>
          </div>

          <div>
            <button onClick={() => scrollTo("home")}>Home</button>
            <button onClick={() => scrollTo("opportunities")}>
              Opportunities
            </button>
            <button onClick={() => setShowCV(true)}>CV Builder</button>
          </div>

          <small>© {new Date().getFullYear()} OpportunityHub</small>
        </div>
      </footer>

      {selectedOpportunity && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedOpportunity(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedOpportunity(null)}
              type="button"
            >
              ×
            </button>

            <span className="opportunity-type">
              {selectedOpportunity.type}
            </span>

            <h2>{selectedOpportunity.title}</h2>

            <p className="organization">
              {selectedOpportunity.organization}
            </p>

            <p>{selectedOpportunity.description}</p>

            <div className="opportunity-meta">
              <span>📍 {selectedOpportunity.location}</span>
              <span>• {selectedOpportunity.mode}</span>
            </div>

            <p>
              <strong>Deadline:</strong>{" "}
              {selectedOpportunity.deadline}
            </p>

            <button
              className="primary-large-button"
              onClick={() =>
                window.alert(
                  "Application feature is ready to be connected to the OpportunityHub application system."
                )
              }
              type="button"
            >
              Apply Now
            </button>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal-backdrop" onClick={() => setShowLogin(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowLogin(false)}
              type="button"
            >
              ×
            </button>

            <span className="section-label">WELCOME BACK</span>
            <h2>Login to OpportunityHub</h2>

            <input
              className="modal-input"
              type="email"
              placeholder="Email address"
            />

            <input
              className="modal-input"
              type="password"
              placeholder="Password"
            />

            <button
              className="primary-large-button"
              onClick={() =>
                window.alert(
                  "Login is ready to connect to your Supabase authentication."
                )
              }
              type="button"
            >
              Login
            </button>
          </div>
        </div>
      )}

      {showRegister && (
        <div
          className="modal-backdrop"
          onClick={() => setShowRegister(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowRegister(false)}
              type="button"
            >
              ×
            </button>

            <span className="section-label">JOIN OPPORTUNITYHUB</span>
            <h2>Create your account</h2>

            <input
              className="modal-input"
              type="text"
              placeholder="Full name"
            />

            <input
              className="modal-input"
              type="email"
              placeholder="Email address"
            />

            <input
              className="modal-input"
              type="password"
              placeholder="Password"
            />

            <button
              className="primary-large-button"
              onClick={() =>
                window.alert(
                  "Registration is ready to connect to your Supabase authentication."
                )
              }
              type="button"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {showCV && (
        <div className="modal-backdrop" onClick={() => setShowCV(false)}>
          <div className="modal cv-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowCV(false)}
              type="button"
            >
              ×
            </button>

            <span className="section-label">CV BUILDER</span>
            <h2>Create your professional CV</h2>

            <input
              className="modal-input"
              placeholder="Full name"
            />

            <input
              className="modal-input"
              placeholder="Professional title"
            />

            <textarea
              className="modal-input"
              placeholder="Professional summary"
              rows="4"
            />

            <input
              className="modal-input"
              placeholder="Education"
            />

            <input
              className="modal-input"
              placeholder="Experience"
            />

            <input
              className="modal-input"
              placeholder="Projects"
            />

            <input
              className="modal-input"
              placeholder="Skills"
            />

            <button
              className="primary-large-button"
              onClick={() =>
                window.alert(
                  "Your CV information is ready for the CV builder system."
                )
              }
              type="button"
            >
              Save CV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
