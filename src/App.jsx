import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  HandCoins,
  Menu,
  Search,
  X,
  BookOpen,
  Trophy,
  Users,
  Globe,
  Calculator,
  FileText,
  HeartHandshake,
  Laptop,
  ShieldCheck,
  MapPin,
  Clock3,
  ChevronRight
} from "lucide-react";

import {
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";


const categories = [
  {
    title: "Jobs",
    description: "Find full-time, part-time and graduate roles.",
    icon: BriefcaseBusiness,
    path: "/jobs"
  },
  {
    title: "Internships",
    description: "Discover internships and practical experience.",
    icon: GraduationCap,
    path: "/internships"
  },
  {
    title: "Scholarships",
    description: "Explore funding opportunities for education.",
    icon: HandCoins,
    path: "/scholarships"
  },
  {
    title: "Fellowships",
    description: "Find fellowship programs and development opportunities.",
    icon: Users,
    path: "/opportunities/fellowships"
  },
  {
    title: "Grants",
    description: "Discover grants for projects and organizations.",
    icon: HandCoins,
    path: "/opportunities/grants"
  },
  {
    title: "Competitions",
    description: "Find competitions and challenges.",
    icon: Trophy,
    path: "/opportunities/competitions"
  },
  {
    title: "Training",
    description: "Learn new skills and advance your career.",
    icon: BookOpen,
    path: "/opportunities/training"
  },
  {
    title: "Remote Work",
    description: "Discover opportunities you can do remotely.",
    icon: Laptop,
    path: "/opportunities/remote"
  }
];


const tools = [
  {
    title: "GPA / CGPA Calculator",
    description: "Calculate your GPA or CGPA quickly.",
    icon: GraduationCap
  },
  {
    title: "Percentage Calculator",
    description: "Solve percentages and percentage changes.",
    icon: Calculator
  },
  {
    title: "Age Calculator",
    description: "Calculate your exact age from your date of birth.",
    icon: Clock3
  },
  {
    title: "Currency Converter",
    description: "Convert between currencies.",
    icon: Globe
  },
  {
    title: "Salary Calculator",
    description: "Understand your income and deductions.",
    icon: HandCoins
  },
  {
    title: "CV Builder",
    description: "Create a professional CV.",
    icon: FileText
  }
];


const resources = [
  {
    title: "How to Write a Strong CV",
    description:
      "Learn what employers look for in a professional CV."
  },
  {
    title: "How to Find an Internship",
    description:
      "Practical guidance for students searching for experience."
  },
  {
    title: "Scholarship Application Guide",
    description:
      "Understand the important parts of a strong scholarship application."
  }
];


const opportunities = [
  {
    title: "Software Engineering Opportunities",
    organization: "OpportunityHub",
    location: "Nigeria",
    type: "Internship",
    deadline: "Coming soon",
    status: "Development listing"
  },
  {
    title: "Graduate Career Opportunities",
    organization: "OpportunityHub",
    location: "Nigeria",
    type: "Graduate Role",
    deadline: "Coming soon",
    status: "Development listing"
  },
  {
    title: "Scholarship Opportunities",
    organization: "OpportunityHub",
    location: "Nigeria",
    type: "Scholarship",
    deadline: "Coming soon",
    status: "Development listing"
  }
];


function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">

        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <div className="brand-mark">
            O
          </div>

          <span>OpportunityHub</span>
        </Link>

        <nav className={`main-nav ${open ? "nav-open" : ""}`}>

          <Link to="/jobs" onClick={() => setOpen(false)}>
            Jobs
          </Link>

          <Link to="/internships" onClick={() => setOpen(false)}>
            Internships
          </Link>

          <Link to="/scholarships" onClick={() => setOpen(false)}>
            Scholarships
          </Link>

          <Link to="/tools" onClick={() => setOpen(false)}>
            Tools
          </Link>

          <Link to="/resources" onClick={() => setOpen(false)}>
            Resources
          </Link>

          <div className="nav-actions">
            <button className="button button-outline">
              Log in
            </button>

            <button className="button button-primary">
              Register
            </button>
          </div>

        </nav>

        <button
          className="mobile-menu-button"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>
    </header>
  );
}


function SearchBox() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    navigate(`/search?${params.toString()}`);
  }

  return (
    <form className="hero-search" onSubmit={handleSearch}>

      <div className="search-field">
        <Search size={20} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What are you looking for?"
          aria-label="Search opportunities"
        />
      </div>

      <div className="search-field location-field">
        <MapPin size={20} />
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Location"
          aria-label="Opportunity location"
        />
      </div>

      <button className="search-button" type="submit">
        Find opportunities
        <ArrowRight size={18} />
      </button>

    </form>
  );
}


function Home() {
  return (
    <>
      <section className="hero">

        <div className="hero-glow glow-one"></div>
        <div className="hero-glow glow-two"></div>

        <div className="container hero-content">

          <div className="hero-badge">
            <span></span>
            Built for opportunity seekers
          </div>

          <h1>
            Find your next
            <strong> opportunity.</strong>
          </h1>

          <p className="hero-description">
            Discover jobs, internships, scholarships, fellowships,
            grants, training programs and career resources in one place.
          </p>

          <SearchBox />

          <div className="hero-links">
            <span>Popular:</span>

            <Link to="/jobs">Jobs</Link>
            <Link to="/internships">Internships</Link>
            <Link to="/scholarships">Scholarships</Link>
            <Link to="/opportunities/remote">Remote work</Link>
          </div>

        </div>
      </section>


      <section className="section">
        <div className="container">

          <div className="section-heading">

            <div>
              <span className="eyebrow">
                Explore
              </span>

              <h2>
                Opportunities for your next move
              </h2>

              <p>
                Explore opportunities across careers, education,
                professional development and more.
              </p>
            </div>

            <Link to="/opportunities" className="text-link">
              View all
              <ArrowRight size={17} />
            </Link>

          </div>


          <div className="category-grid">

            {categories.map((category) => {

              const Icon = category.icon;

              return (
                <Link
                  to={category.path}
                  className="category-card"
                  key={category.title}
                >

                  <div className="card-icon">
                    <Icon size={22} />
                  </div>

                  <h3>{category.title}</h3>

                  <p>{category.description}</p>

                  <span className="card-arrow">
                    <ChevronRight size={18} />
                  </span>

                </Link>
              );
            })}

          </div>

        </div>
      </section>


      <section className="section section-muted">

        <div className="container">

          <div className="section-heading">

            <div>
              <span className="eyebrow">
                Latest
              </span>

              <h2>
                Explore opportunities
              </h2>

              <p>
                New opportunities will appear here as OpportunityHub
                grows its verified opportunity database.
              </p>
            </div>

            <Link to="/opportunities" className="text-link">
              Browse opportunities
              <ArrowRight size={17} />
            </Link>

          </div>


          <div className="opportunity-grid">

            {opportunities.map((item) => (

              <article
                className="opportunity-card"
                key={item.title}
              >

                <div className="opportunity-top">

                  <div className="organization-logo">
                    O
                  </div>

                  <span className="opportunity-type">
                    {item.type}
                  </span>

                </div>

                <h3>{item.title}</h3>

                <p className="organization">
                  {item.organization}
                </p>

                <div className="opportunity-meta">
                  <span>
                    <MapPin size={15} />
                    {item.location}
                  </span>

                  <span>
                    <Clock3 size={15} />
                    {item.deadline}
                  </span>
                </div>

                <div className="development-note">
                  {item.status}
                </div>

              </article>

            ))}

          </div>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <div className="section-heading">

            <div>
              <span className="eyebrow">
                OpportunityHub Tools
              </span>

              <h2>
                Useful tools for everyday decisions
              </h2>

              <p>
                Free tools designed to help students, professionals
                and opportunity seekers.
              </p>
            </div>

            <Link to="/tools" className="text-link">
              Explore tools
              <ArrowRight size={17} />
            </Link>

          </div>


          <div className="tools-grid">

            {tools.map((tool) => {

              const Icon = tool.icon;

              return (
                <Link
                  to="/tools"
                  className="tool-card"
                  key={tool.title}
                >

                  <div className="tool-icon">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3>{tool.title}</h3>
                    <p>{tool.description}</p>
                  </div>

                  <ChevronRight size={18} />

                </Link>
              );
            })}

          </div>

        </div>

      </section>


      <section className="career-banner">

        <div className="container career-banner-inner">

          <div>

            <span className="eyebrow">
              Career Center
            </span>

            <h2>
              Build a CV that represents you.
            </h2>

            <p>
              Create a professional CV with OpportunityHub's
              free CV builder.
            </p>

          </div>

          <Link to="/cv-builder" className="button button-white">
            Build your CV
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <div className="trust-section">

            <div className="trust-icon">
              <ShieldCheck size={30} />
            </div>

            <div>

              <span className="eyebrow">
                Trust matters
              </span>

              <h2>
                We want you to make informed decisions.
              </h2>

              <p>
                OpportunityHub is designed to make discovering
                opportunities easier while encouraging users to
                verify important information through official
                sources before applying or sharing personal data.
              </p>

            </div>

          </div>

        </div>

      </section>


      <section className="section section-muted">

        <div className="container">

          <div className="section-heading">

            <div>
              <span className="eyebrow">
                Career Resources
              </span>

              <h2>
                Learn, prepare and move forward.
              </h2>
            </div>

            <Link to="/resources" className="text-link">
              View resources
              <ArrowRight size={17} />
            </Link>

          </div>


          <div className="resource-grid">

            {resources.map((resource) => (

              <Link
                to="/resources"
                className="resource-card"
                key={resource.title}
              >

                <BookOpen size={21} />

                <h3>{resource.title}</h3>

                <p>
                  {resource.description}
                </p>

                <span>
                  Read guide
                  <ArrowRight size={16} />
                </span>

              </Link>

            ))}

          </div>

        </div>

      </section>

    </>
  );
}


function DirectoryPage({ title, description, type }) {

  const [search, setSearch] = useState("");

  return (
    <main className="page">

      <div className="container">

        <div className="page-header">

          <span className="eyebrow">
            OpportunityHub
          </span>

          <h1>{title}</h1>

          <p>{description}</p>

        </div>


        <div className="directory-search">

          <div className="search-field">
            <Search size={19} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={`Search ${type}...`}
            />
          </div>

          <button className="button button-primary">
            Search
          </button>

        </div>


        <div className="empty-state">

          <div className="empty-icon">
            <Search size={25} />
          </div>

          <h2>
            Opportunity database coming online
          </h2>

          <p>
            This directory is ready for real opportunity data.
            Supabase will be connected in the next development
            stages so that real opportunities can be added,
            searched and filtered.
          </p>

        </div>

      </div>

    </main>
  );
}


function ToolsPage() {

  return (
    <main className="page">

      <div className="container">

        <div className="page-header">

          <span className="eyebrow">
            OpportunityHub Tools
          </span>

          <h1>
            Tools that help you move forward.
          </h1>

          <p>
            Practical calculators, planners and career tools
            designed for students and professionals.
          </p>

        </div>


        <div className="tools-page-grid">

          {tools.map((tool) => {

            const Icon = tool.icon;

            return (
              <article
                className="large-tool-card"
                key={tool.title}
              >

                <div className="tool-icon">
                  <Icon size={24} />
                </div>

                <h2>{tool.title}</h2>

                <p>{tool.description}</p>

                <button className="button button-outline">
                  Open tool
                  <ArrowRight size={16} />
                </button>

              </article>
            );
          })}

        </div>

      </div>

    </main>
  );
}


function ResourcesPage() {

  return (
    <main className="page">

      <div className="container">

        <div className="page-header">

          <span className="eyebrow">
            Career Resources
          </span>

          <h1>
            Resources for your career journey.
          </h1>

          <p>
            Practical guides to help you prepare, apply and grow.
          </p>

        </div>


        <div className="resource-page-grid">

          {resources.map((resource) => (

            <article
              className="resource-page-card"
              key={resource.title}
            >

              <div className="resource-number">
                →
              </div>

              <h2>{resource.title}</h2>

              <p>{resource.description}</p>

              <button className="text-link">
                Read guide
                <ArrowRight size={17} />
              </button>

            </article>

          ))}

        </div>

      </div>

    </main>
  );
}


function CVBuilderPage() {

  return (
    <main className="page">

      <div className="container">

        <div className="page-header">

          <span className="eyebrow">
            Career Center
          </span>

          <h1>
            Build your professional CV.
          </h1>

          <p>
            A free CV builder is being prepared as part of
            OpportunityHub's career platform.
          </p>

        </div>


        <div className="builder-preview">

          <FileText size={42} />

          <h2>
            CV Builder
          </h2>

          <p>
            The full builder will include personal information,
            education, experience, projects, skills, certifications,
            languages and a live CV preview.
          </p>

          <button className="button button-primary">
            Start building
          </button>

        </div>

      </div>

    </main>
  );
}


function SearchPage() {

  const params = new URLSearchParams(window.location.search);

  const query = params.get("q");
  const location = params.get("location");

  return (
    <main className="page">

      <div className="container">

        <div className="page-header">

          <span className="eyebrow">
            Search
          </span>

          <h1>
            Search OpportunityHub
          </h1>

          <p>
            {query || location
              ? `Showing results for ${
                  query ? `"${query}"` : ""
                } ${
                  location ? `in ${location}` : ""
                }`
              : "Search for opportunities, tools and resources."}
          </p>

        </div>


        <div className="empty-state">

          <Search size={28} />

          <h2>
            Search engine foundation ready
          </h2>

          <p>
            The next stage will connect this search interface
            to the OpportunityHub database so results can be
            searched by title, organization, category, keyword
            and location.
          </p>

        </div>

      </div>

    </main>
  );
}


function Footer() {

  return (
    <footer className="footer">

      <div className="container footer-grid">

        <div className="footer-brand">

          <Link to="/" className="brand">

            <div className="brand-mark">
              O
            </div>

            <span>
              OpportunityHub
            </span>

          </Link>

          <p>
            Helping people discover opportunities,
            build careers and move forward.
          </p>

        </div>


        <div>

          <h3>Opportunities</h3>

          <Link to="/jobs">Jobs</Link>
          <Link to="/internships">Internships</Link>
          <Link to="/scholarships">Scholarships</Link>
          <Link to="/opportunities">All opportunities</Link>

        </div>


        <div>

          <h3>Career</h3>

          <Link to="/cv-builder">CV Builder</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/tools">Tools</Link>

        </div>


        <div>

          <h3>Company</h3>

          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>

        </div>

      </div>


      <div className="container footer-bottom">

        <span>
          © {new Date().getFullYear()} OpportunityHub
        </span>

        <span>
          Built to help people find what's next.
        </span>

      </div>

    </footer>
  );
}


function App() {

  return (
    <div className="app">

      <Header />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/jobs"
          element={
            <DirectoryPage
              title="Find jobs"
              description="Discover career opportunities and graduate roles."
              type="jobs"
            />
          }
        />

        <Route
          path="/internships"
          element={
            <DirectoryPage
              title="Find internships"
              description="Discover internships and practical experience opportunities."
              type="internships"
            />
          }
        />

        <Route
          path="/scholarships"
          element={
            <DirectoryPage
              title="Find scholarships"
              description="Explore scholarships and education funding opportunities."
              type="scholarships"
            />
          }
        />

        <Route
          path="/opportunities"
          element={
            <DirectoryPage
              title="Explore opportunities"
              description="Search jobs, internships, scholarships and more."
              type="opportunities"
            />
          }
        />

        <Route
          path="/opportunities/:category"
          element={
            <DirectoryPage
              title="Explore opportunities"
              description="Discover opportunities through OpportunityHub."
              type="opportunities"
            />
          }
        />

        <Route
          path="/tools"
          element={<ToolsPage />}
        />

        <Route
          path="/resources"
          element={<ResourcesPage />}
        />

        <Route
          path="/cv-builder"
          element={<CVBuilderPage />}
        />

        <Route
          path="/search"
          element={<SearchPage />}
        />

        <Route
          path="/about"
          element={<SimplePage title="About OpportunityHub" />}
        />

        <Route
          path="/contact"
          element={<SimplePage title="Contact OpportunityHub" />}
        />

        <Route
          path="/privacy"
          element={<SimplePage title="Privacy Policy" />}
        />

        <Route
          path="/terms"
          element={<SimplePage title="Terms of Service" />}
        />

      </Routes>

      <Footer />

    </div>
  );
}


function SimplePage({ title }) {

  return (
    <main className="page">

      <div className="container">

        <div className="page-header">

          <span className="eyebrow">
            OpportunityHub
          </span>

          <h1>{title}</h1>

          <p>
            This page is part of the OpportunityHub foundation
            and will be completed with its proper content.
          </p>

        </div>

      </div>

    </main>
  );
}


export default App;
