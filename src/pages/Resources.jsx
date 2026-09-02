import React, { useState } from "react";
import { BookOpen, ShieldAlert, MessageSquare, Briefcase, GraduationCap, Globe } from "lucide-react";

const RESOURCES = [
  {
    icon: BookOpen,
    tag: "GUIDE",
    title: "How to build a CV that gets noticed",
    body: "Keep it to one or two pages, lead with measurable achievements instead of duties, tailor it for every role, and use OpportunityHub's CV Builder to keep formatting clean and consistent.",
  },
  {
    icon: MessageSquare,
    tag: "GUIDE",
    title: "Preparing for interviews",
    body: "Research the organization, prepare specific stories using the STAR method (Situation, Task, Action, Result), practice out loud, and prepare thoughtful questions to ask your interviewer.",
  },
  {
    icon: GraduationCap,
    tag: "GUIDE",
    title: "Applying for scholarships",
    body: "Start early, read eligibility criteria carefully, request recommendation letters well ahead of deadlines, and write a personal statement that is specific to you — avoid generic essays.",
  },
  {
    icon: Briefcase,
    tag: "GUIDE",
    title: "Applying for jobs and internships",
    body: "Customize your application to the job description, quantify your impact, follow up politely after applying, and keep a simple spreadsheet or use our Application Tracker to stay organized.",
  },
  {
    icon: Globe,
    tag: "GUIDE",
    title: "Succeeding in remote opportunities",
    body: "Set up a distraction-free workspace, over-communicate proactively with teams across time zones, and be deliberate about tracking your accomplishments since your manager may not see day-to-day effort.",
  },
  {
    icon: ShieldAlert,
    tag: "SAFETY",
    title: "How to avoid scams",
    body: "Legitimate employers, scholarship boards and grant programs never ask you to pay an application fee, never ask for your bank PIN, and rarely message you first on WhatsApp. Verify official application URLs and use the Report button on any suspicious listing.",
  },
  {
    icon: BookOpen,
    tag: "GUIDE",
    title: "Using OpportunityHub effectively",
    body: "Use filters to narrow by category, location, mode and funding status. Save opportunities you're interested in, track your applications on the Application Tracker page, and enable notifications so you don't miss a deadline.",
  },
];

export default function Resources() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="section-label">CAREER RESOURCES</span>
            <h2>Get better at finding — and winning — opportunities.</h2>
          </div>
          <p>Practical, no-fluff guidance for students, graduates and professionals.</p>
        </div>

        <div className="resource-grid resource-grid-wide">
          {RESOURCES.map((r, i) => (
            <div key={r.title} className="resource-card">
              <span>{r.tag}</span>
              <h3>{r.title}</h3>
              {openIndex === i ? (
                <p>{r.body}</p>
              ) : (
                <p>{r.body.slice(0, 90)}…</p>
              )}
              <button type="button" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                {openIndex === i ? "Show less" : "Read guide"} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
