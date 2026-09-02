import React, { useEffect, useState } from "react";
import { Plus, Trash2, Save, Printer, FileDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { emptyCv, getLocalCv, saveLocalCv, fetchCv, saveCv } from "../services/cvService";
import { LoadingState } from "../components/ui/States";

function Section({ title, children, onAdd, addLabel }) {
  return (
    <div className="cv-builder-section">
      <div className="cv-builder-section-header">
        <h3>{title}</h3>
        {onAdd && (
          <button type="button" className="outline-button" onClick={onAdd}>
            <Plus size={14} /> {addLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export default function CvBuilder() {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const [cv, setCv] = useState(emptyCv);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      if (isAuthenticated && user) {
        const { data } = await fetchCv(user.id);
        if (!cancelled) setCv(data?.data || getLocalCv() || emptyCv);
      } else {
        if (!cancelled) setCv(getLocalCv() || emptyCv);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user]);

  function updatePersonal(field, value) {
    setCv((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  }

  function addListItem(key, template) {
    setCv((prev) => ({ ...prev, [key]: [...prev[key], template] }));
  }

  function updateListItem(key, index, field, value) {
    setCv((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  }

  function removeListItem(key, index) {
    setCv((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    setSaving(true);
    if (isAuthenticated && user) {
      const { error } = await saveCv(user.id, cv);
      setSaving(false);
      if (error) {
        toast.error(error.message || "Could not save your CV.");
        return;
      }
      toast.success("CV saved to your account.");
    } else {
      saveLocalCv(cv);
      setSaving(false);
      toast.success("CV saved on this device. Log in to save it to your account.");
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) return <LoadingState label="Loading your CV…" />;

  return (
    <section className="section cv-builder-layout">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="section-label">CAREER TOOLS</span>
            <h2>CV Builder</h2>
          </div>
          <p>
            {isAuthenticated
              ? "Your CV is saved to your account."
              : "Draft saved to this device only — log in to save it to your account."}
          </p>
        </div>

        <div className="cv-builder-grid">
          <div className="cv-builder-form">
            <Section title="Personal information">
              <div className="form-grid-2">
                <label>
                  Full name
                  <input
                    value={cv.personal.fullName}
                    onChange={(e) => updatePersonal("fullName", e.target.value)}
                  />
                </label>
                <label>
                  Professional title
                  <input
                    value={cv.personal.title}
                    onChange={(e) => updatePersonal("title", e.target.value)}
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={cv.personal.email}
                    onChange={(e) => updatePersonal("email", e.target.value)}
                  />
                </label>
                <label>
                  Phone
                  <input
                    value={cv.personal.phone}
                    onChange={(e) => updatePersonal("phone", e.target.value)}
                  />
                </label>
                <label>
                  Location
                  <input
                    value={cv.personal.location}
                    onChange={(e) => updatePersonal("location", e.target.value)}
                  />
                </label>
              </div>
              <label>
                Professional summary
                <textarea
                  rows={3}
                  value={cv.personal.summary}
                  onChange={(e) => updatePersonal("summary", e.target.value)}
                />
              </label>
            </Section>

            <Section
              title="Education"
              addLabel="Add education"
              onAdd={() =>
                addListItem("education", { school: "", degree: "", start: "", end: "", details: "" })
              }
            >
              {cv.education.map((ed, i) => (
                <div key={i} className="cv-repeater-item">
                  <div className="form-grid-2">
                    <input
                      placeholder="School / Institution"
                      value={ed.school}
                      onChange={(e) => updateListItem("education", i, "school", e.target.value)}
                    />
                    <input
                      placeholder="Degree / Qualification"
                      value={ed.degree}
                      onChange={(e) => updateListItem("education", i, "degree", e.target.value)}
                    />
                    <input
                      placeholder="Start year"
                      value={ed.start}
                      onChange={(e) => updateListItem("education", i, "start", e.target.value)}
                    />
                    <input
                      placeholder="End year"
                      value={ed.end}
                      onChange={(e) => updateListItem("education", i, "end", e.target.value)}
                    />
                  </div>
                  <textarea
                    placeholder="Details"
                    rows={2}
                    value={ed.details}
                    onChange={(e) => updateListItem("education", i, "details", e.target.value)}
                  />
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => removeListItem("education", i)}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              ))}
            </Section>

            <Section
              title="Experience"
              addLabel="Add experience"
              onAdd={() =>
                addListItem("experience", {
                  company: "",
                  role: "",
                  start: "",
                  end: "",
                  details: "",
                })
              }
            >
              {cv.experience.map((exp, i) => (
                <div key={i} className="cv-repeater-item">
                  <div className="form-grid-2">
                    <input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateListItem("experience", i, "company", e.target.value)}
                    />
                    <input
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) => updateListItem("experience", i, "role", e.target.value)}
                    />
                    <input
                      placeholder="Start"
                      value={exp.start}
                      onChange={(e) => updateListItem("experience", i, "start", e.target.value)}
                    />
                    <input
                      placeholder="End (or Present)"
                      value={exp.end}
                      onChange={(e) => updateListItem("experience", i, "end", e.target.value)}
                    />
                  </div>
                  <textarea
                    placeholder="Responsibilities and achievements"
                    rows={3}
                    value={exp.details}
                    onChange={(e) => updateListItem("experience", i, "details", e.target.value)}
                  />
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => removeListItem("experience", i)}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              ))}
            </Section>

            <Section
              title="Projects"
              addLabel="Add project"
              onAdd={() => addListItem("projects", { name: "", details: "" })}
            >
              {cv.projects.map((p, i) => (
                <div key={i} className="cv-repeater-item">
                  <input
                    placeholder="Project name"
                    value={p.name}
                    onChange={(e) => updateListItem("projects", i, "name", e.target.value)}
                  />
                  <textarea
                    placeholder="Description"
                    rows={2}
                    value={p.details}
                    onChange={(e) => updateListItem("projects", i, "details", e.target.value)}
                  />
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => removeListItem("projects", i)}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              ))}
            </Section>

            <Section
              title="Certifications"
              addLabel="Add certification"
              onAdd={() => addListItem("certifications", { name: "", issuer: "", year: "" })}
            >
              {cv.certifications.map((c, i) => (
                <div key={i} className="cv-repeater-item form-grid-3">
                  <input
                    placeholder="Certification"
                    value={c.name}
                    onChange={(e) => updateListItem("certifications", i, "name", e.target.value)}
                  />
                  <input
                    placeholder="Issuer"
                    value={c.issuer}
                    onChange={(e) => updateListItem("certifications", i, "issuer", e.target.value)}
                  />
                  <input
                    placeholder="Year"
                    value={c.year}
                    onChange={(e) => updateListItem("certifications", i, "year", e.target.value)}
                  />
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => removeListItem("certifications", i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </Section>

            <Section
              title="Skills"
              addLabel="Add skill"
              onAdd={() => addListItem("skills", { name: "" })}
            >
              <div className="tag-list-editor">
                {cv.skills.map((s, i) => (
                  <div key={i} className="tag-editor-item">
                    <input
                      value={s.name}
                      onChange={(e) => updateListItem("skills", i, "name", e.target.value)}
                      placeholder="e.g. Project Management"
                    />
                    <button type="button" onClick={() => removeListItem("skills", i)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              title="Languages"
              addLabel="Add language"
              onAdd={() => addListItem("languages", { name: "", level: "" })}
            >
              {cv.languages.map((l, i) => (
                <div key={i} className="cv-repeater-item form-grid-2">
                  <input
                    placeholder="Language"
                    value={l.name}
                    onChange={(e) => updateListItem("languages", i, "name", e.target.value)}
                  />
                  <input
                    placeholder="Proficiency (e.g. Fluent)"
                    value={l.level}
                    onChange={(e) => updateListItem("languages", i, "level", e.target.value)}
                  />
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => removeListItem("languages", i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </Section>

            <Section
              title="Achievements"
              addLabel="Add achievement"
              onAdd={() => addListItem("achievements", { text: "" })}
            >
              {cv.achievements.map((a, i) => (
                <div key={i} className="cv-repeater-item">
                  <input
                    value={a.text}
                    onChange={(e) => updateListItem("achievements", i, "text", e.target.value)}
                    placeholder="e.g. Won 1st place in XYZ Hackathon 2025"
                  />
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => removeListItem("achievements", i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </Section>

            <div className="cv-builder-actions">
              <button className="primary-large-button" onClick={handleSave} disabled={saving}>
                <Save size={16} /> {saving ? "Saving…" : "Save CV"}
              </button>
              <button className="outline-button" onClick={handlePrint}>
                <Printer size={16} /> Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="cv-preview-pane">
            <div className="printcv cv-document">
              <h1>{cv.personal.fullName || "Your Name"}</h1>
              <div className="cv-doc-title">{cv.personal.title || "Professional Title"}</div>
              <div className="cv-doc-contact">
                {[cv.personal.email, cv.personal.phone, cv.personal.location]
                  .filter(Boolean)
                  .join(" · ")}
              </div>

              {cv.personal.summary && (
                <div className="cv-doc-section">
                  <h2>Profile</h2>
                  <p>{cv.personal.summary}</p>
                </div>
              )}

              {cv.experience.length > 0 && (
                <div className="cv-doc-section">
                  <h2>Experience</h2>
                  {cv.experience.map((e, i) => (
                    <div key={i} className="cv-doc-item">
                      <div className="cv-doc-item-header">
                        <strong>{e.role || "Role"}</strong>
                        <span>
                          {e.start} {e.start || e.end ? "–" : ""} {e.end}
                        </span>
                      </div>
                      <div className="cv-doc-item-sub">{e.company}</div>
                      <p>{e.details}</p>
                    </div>
                  ))}
                </div>
              )}

              {cv.education.length > 0 && (
                <div className="cv-doc-section">
                  <h2>Education</h2>
                  {cv.education.map((e, i) => (
                    <div key={i} className="cv-doc-item">
                      <div className="cv-doc-item-header">
                        <strong>{e.degree || "Qualification"}</strong>
                        <span>
                          {e.start} {e.start || e.end ? "–" : ""} {e.end}
                        </span>
                      </div>
                      <div className="cv-doc-item-sub">{e.school}</div>
                      <p>{e.details}</p>
                    </div>
                  ))}
                </div>
              )}

              {cv.projects.length > 0 && (
                <div className="cv-doc-section">
                  <h2>Projects</h2>
                  {cv.projects.map((p, i) => (
                    <div key={i} className="cv-doc-item">
                      <strong>{p.name}</strong>
                      <p>{p.details}</p>
                    </div>
                  ))}
                </div>
              )}

              {cv.skills.length > 0 && (
                <div className="cv-doc-section">
                  <h2>Skills</h2>
                  <div className="cv-doc-tags">
                    {cv.skills.filter((s) => s.name).map((s, i) => (
                      <span key={i}>{s.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {cv.certifications.length > 0 && (
                <div className="cv-doc-section">
                  <h2>Certifications</h2>
                  {cv.certifications.map((c, i) => (
                    <p key={i}>
                      {c.name} {c.issuer && `— ${c.issuer}`} {c.year && `(${c.year})`}
                    </p>
                  ))}
                </div>
              )}

              {cv.languages.length > 0 && (
                <div className="cv-doc-section">
                  <h2>Languages</h2>
                  <p>{cv.languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`).join(", ")}</p>
                </div>
              )}

              {cv.achievements.length > 0 && (
                <div className="cv-doc-section">
                  <h2>Achievements</h2>
                  <ul>
                    {cv.achievements.filter((a) => a.text).map((a, i) => (
                      <li key={i}>{a.text}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
