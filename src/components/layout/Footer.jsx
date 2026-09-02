import React from "react";
import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import { BRAND } from "../../lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo variant="full" size={44} />
          <p>
            Helping students, graduates, job seekers and professionals in Nigeria — and
            eventually worldwide — discover jobs, internships, scholarships, grants,
            fellowships and career resources in one trusted platform.
          </p>
        </div>

        <div className="footer-column">
          <h4>Opportunities</h4>
          <Link to="/jobs">Jobs</Link>
          <Link to="/internships">Internships</Link>
          <Link to="/scholarships">Scholarships</Link>
          <Link to="/fellowships">Fellowships</Link>
          <Link to="/grants">Grants</Link>
          <Link to="/remote-jobs">Remote Jobs</Link>
        </div>

        <div className="footer-column">
          <h4>Tools</h4>
          <Link to="/cv-builder">CV Builder</Link>
          <Link to="/saved">Saved Opportunities</Link>
          <Link to="/applications">Application Tracker</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/support">Support</Link>
        </div>

        <div className="footer-column">
          <h4>Company &amp; Legal</h4>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/refund">Refund Policy</Link>
          <Link to="/disclaimer">Disclaimer</Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          Created by <b>{BRAND.creator}</b> · © {year} {BRAND.name}
        </span>
        <span>{BRAND.tagline}</span>
      </div>
    </footer>
  );
}
