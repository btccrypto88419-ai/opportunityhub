import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>
        <Compass size={40} style={{ marginBottom: 16, color: "var(--primary)" }} />
        <h1>Page not found</h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/" className="primary-large-button" style={{ display: "inline-flex" }}>
          Back to home
        </Link>
      </div>
    </section>
  );
}
