"use client";
import { useEffect, useState } from "react";
import { projectStyles, type SiteContent } from "../../lib/content";
const tabs = [
  "Homepage",
  "Projects",
  "Categories",
  "About",
  "Contact",
] as const;
type Tab = (typeof tabs)[number];
function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          rows={4}
          maxLength={5000}
          onChange={(event) => onChange(event.target.value)}
          required
        />
      ) : (
        <input
          value={value}
          maxLength={5000}
          onChange={(event) => onChange(event.target.value)}
          required
        />
      )}
    </label>
  );
}
export default function Editor() {
  const [content, setContent] = useState<SiteContent | null>(null),
    [saved, setSaved] = useState(""),
    [sha, setSha] = useState("");
  const [tab, setTab] = useState<Tab>("Homepage"),
    [status, setStatus] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [commit, setCommit] = useState("");
  const dirty = !!content && JSON.stringify(content) !== saved;
  async function load() {
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setContent(data.content);
      setSaved(JSON.stringify(data.content));
      setSha(data.sha);
      setStatus("Latest content loaded.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not load content.",
      );
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function group<K extends "hero" | "about" | "contact" | "footer">(
    name: K,
    field: keyof SiteContent[K],
    value: string,
  ) {
    setContent((current) =>
      current
        ? { ...current, [name]: { ...current[name], [field]: value } }
        : current,
    );
  }
  async function publish() {
    setBusy(true);
    setError("");
    setStatus("Saving to GitHub…");
    setCommit("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sha }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSha(data.sha);
      setSaved(JSON.stringify(content));
      setCommit(data.commitUrl);
      setStatus(
        "Saved to GitHub. Vercel will rebuild the site; your changes will appear when deployment finishes.",
      );
    } catch (error) {
      setStatus("");
      setError(error instanceof Error ? error.message : "Could not publish.");
    } finally {
      setBusy(false);
    }
  }
  if (!content)
    return (
      <section className="admin-work">
        <h1>Content editor</h1>
        {error ? (
          <>
            <p role="alert">{error}</p>
            <button onClick={load}>Try again</button>
            <a href="/api/admin/auth">Sign in again</a>
          </>
        ) : (
          <p>Loading your content…</p>
        )}
      </section>
    );
  return (
    <div className="admin-work">
      <div className="admin-title">
        <div>
          <p className="admin-eyebrow">PORTFOLIO / EDITOR</p>
          <h1>Make it yours.</h1>
          <p className="admin-muted">
            {dirty ? "You have unpublished changes." : "Your edits are saved."}
          </p>
        </div>
        <div className="admin-actions">
          <a href="/" target="_blank" rel="noreferrer">
            View live site
          </a>
          <button
            className="admin-primary"
            onClick={publish}
            disabled={busy || !dirty}
          >
            {busy ? "Working…" : "Publish changes"}
          </button>
        </div>
      </div>
      <div className="admin-message" aria-live="polite">
        {status}
        {commit && (
          <>
            {" "}
            <a href={commit} target="_blank" rel="noreferrer">
              View saved revision
            </a>
          </>
        )}
      </div>
      {error && (
        <div className="admin-error" role="alert">
          {error} <a href="/api/admin/auth">Sign in again</a>
        </div>
      )}
      <div className="admin-layout">
        <nav aria-label="Editor sections">
          {tabs.map((name) => (
            <button
              key={name}
              aria-current={name === tab ? "page" : undefined}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
          <button
            disabled={busy}
            onClick={() => {
              if (
                !dirty ||
                confirm(
                  "Discard your unpublished changes and load the latest saved content?",
                )
              )
                void load();
            }}
          >
            Reload saved content
          </button>
        </nav>
        <section className="admin-panel">
          <fieldset disabled={busy}>
            <legend>{tab}</legend>
            {tab === "Homepage" && (
              <>
                <Field
                  label="Intro line"
                  value={content.hero.kicker}
                  onChange={(v) => group("hero", "kicker", v)}
                />
                <Field
                  label="Headline"
                  value={content.hero.title}
                  onChange={(v) => group("hero", "title", v)}
                />
                <Field
                  label="Highlighted word"
                  value={content.hero.accent}
                  onChange={(v) => group("hero", "accent", v)}
                />
                <Field
                  label="Introduction"
                  value={content.hero.copy}
                  onChange={(v) => group("hero", "copy", v)}
                  multiline
                />
                <Field
                  label="Projects heading"
                  value={content.projectsHeading}
                  onChange={(v) =>
                    setContent({ ...content, projectsHeading: v })
                  }
                />
              </>
            )}
            {tab === "About" && (
              <>
                <Field
                  label="Heading"
                  value={content.about.title}
                  onChange={(v) => group("about", "title", v)}
                />
                <Field
                  label="Highlighted heading"
                  value={content.about.accent}
                  onChange={(v) => group("about", "accent", v)}
                />
                <Field
                  label="Biography"
                  value={content.about.copy}
                  onChange={(v) => group("about", "copy", v)}
                  multiline
                />
              </>
            )}
            {tab === "Contact" && (
              <>
                <Field
                  label="Contact heading"
                  value={content.contact.title}
                  onChange={(v) => group("contact", "title", v)}
                />
                <Field
                  label="Highlighted word (after ‘with’)"
                  value={content.contact.accent}
                  onChange={(v) => group("contact", "accent", v)}
                />
                <Field
                  label="GitHub URL"
                  value={content.contact.github}
                  onChange={(v) => group("contact", "github", v)}
                />
                <Field
                  label="Email address"
                  value={content.contact.email}
                  onChange={(v) => group("contact", "email", v)}
                />
                <Field
                  label="Location"
                  value={content.footer.location}
                  onChange={(v) => group("footer", "location", v)}
                />
                <Field
                  label="Footer note"
                  value={content.footer.note}
                  onChange={(v) => group("footer", "note", v)}
                />
              </>
            )}
            {tab === "Categories" &&
              content.categories.map((category, index) => (
                <div className="admin-card" key={index}>
                  <h2>Category {index + 1}</h2>
                  {(["number", "title", "copy", "href"] as const).map((key) => (
                    <Field
                      key={key}
                      label={
                        {
                          number: "Number",
                          title: "Title",
                          copy: "Description",
                          href: "Section link",
                        }[key]
                      }
                      value={category[key]}
                      onChange={(value) =>
                        setContent({
                          ...content,
                          categories: content.categories.map((item, i) =>
                            i === index ? { ...item, [key]: value } : item,
                          ),
                        })
                      }
                    />
                  ))}
                </div>
              ))}
            {tab === "Projects" && (
              <>
                <p className="admin-muted">
                  Add, edit, and reorder your project cards.
                </p>
                {content.projects.map((project, index) => (
                  <div className="admin-card" key={index}>
                    <div className="admin-card-title">
                      <h2>Project {index + 1}</h2>
                      <div>
                        <button
                          aria-label={`Move project ${index + 1} up`}
                          disabled={index === 0}
                          onClick={() => {
                            const projects = [...content.projects];
                            [projects[index - 1], projects[index]] = [
                              projects[index],
                              projects[index - 1],
                            ];
                            setContent({ ...content, projects });
                          }}
                        >
                          Move up
                        </button>
                        <button
                          disabled={content.projects.length === 1}
                          onClick={() => {
                            if (
                              confirm(
                                `Remove “${project.title}”? This takes effect when you publish.`,
                              )
                            )
                              setContent({
                                ...content,
                                projects: content.projects.filter(
                                  (_, i) => i !== index,
                                ),
                              });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    {(["kicker", "title", "copy", "meta"] as const).map(
                      (key) => (
                        <Field
                          key={key}
                          label={
                            {
                              kicker: "Category",
                              title: "Title",
                              copy: "Description",
                              meta: "Tools / tags",
                            }[key]
                          }
                          multiline={key === "copy"}
                          value={project[key]}
                          onChange={(value) =>
                            setContent({
                              ...content,
                              projects: content.projects.map((item, i) =>
                                i === index ? { ...item, [key]: value } : item,
                              ),
                            })
                          }
                        />
                      ),
                    )}
                    <label className="admin-field">
                      <span>Card style</span>
                      <select
                        value={project.className}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            projects: content.projects.map((item, i) =>
                              i === index
                                ? { ...item, className: event.target.value }
                                : item,
                            ),
                          })
                        }
                      >
                        {projectStyles.map((style) => (
                          <option key={style.className} value={style.className}>
                            {style.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ))}
                <button
                  disabled={content.projects.length >= 30}
                  onClick={() =>
                    setContent({
                      ...content,
                      projects: [
                        ...content.projects,
                        {
                          kicker: "Personal project",
                          title: "New project",
                          copy: "Tell the story of what you built.",
                          meta: "Tools and technologies",
                          className: "project-card project-deck",
                        },
                      ],
                    })
                  }
                >
                  Add project
                </button>
              </>
            )}
          </fieldset>
        </section>
      </div>
    </div>
  );
}
