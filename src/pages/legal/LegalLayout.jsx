import React from "react";

export default function LegalLayout({ title, updated, children }) {
  return (
    <section className="section">
      <div className="container narrow legal-page">
        <span className="section-label">LEGAL</span>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: {updated}</p>
        <div className="legal-body">{children}</div>
      </div>
    </section>
  );
}
