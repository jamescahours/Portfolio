import content from "../content/site.json";
const { categories, projects } = content;

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="shell nav">
          <a className="wordmark" href="#top" aria-label="James Cahours home">
            james cahours<span>.</span>
          </a>
          <nav className="nav-links" aria-label="Primary navigation">
            <a href="#software">Software</a>
            <a href="#projects">Projects</a>
            <a href="#music">Music</a>
            <a href="#about">About</a>
          </nav>
          <a className="connect-link" href="#contact">
            Let&apos;s connect <span>↗</span>
          </a>
        </div>
      </header>

      <section className="hero shell" id="top">
        <p className="hero-kicker">{content.hero.kicker}</p>
        <h1>
          {content.hero.title} <em>{content.hero.accent}</em>
        </h1>
        <div className="hero-bottom">
          <p>{content.hero.copy}</p>
          <a
            className="circle-link"
            href="#projects"
            aria-label="View projects"
          >
            ↓
          </a>
        </div>
      </section>

      <section className="project-index shell" aria-label="Project categories">
        {categories.map((category) => (
          <a className="index-row" href={category.href} key={category.number}>
            <span className="index-number">{category.number}</span>
            <span className="index-title">{category.title}</span>
            <span className="index-copy">{category.copy}</span>
            <span className="index-arrow">↗</span>
          </a>
        ))}
      </section>

      <section className="selected-work shell" id="projects">
        <div className="section-intro">
          <p className="eyebrow">Selected projects</p>
          <h2>{content.projectsHeading}</h2>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <article
              className={project.className}
              id={
                projects.findIndex(
                  (item) => item.className === project.className,
                ) === index
                  ? (
                      {
                        "project-card project-card-wide project-site":
                          "software",
                        "project-card project-automation": "technology",
                        "project-card project-music": "music",
                      } as Record<string, string>
                    )[project.className]
                  : undefined
              }
              key={index}
            >
              <div className="project-visual" aria-hidden="true">
                <span className="visual-number">0{index + 1}</span>
                <span className="visual-mark">
                  {project.className.includes("project-site")
                    ? "{ }"
                    : project.className.includes("project-automation")
                      ? "⌁"
                      : project.className.includes("project-deck")
                        ? "⌂"
                        : "♪"}
                </span>
              </div>
              <div className="project-content">
                <p className="project-kicker">{project.kicker}</p>
                <h3>{project.title}</h3>
                <p className="project-copy">{project.copy}</p>
                <p className="project-meta">{project.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-strip" id="about">
        <div className="shell about-grid">
          <p className="eyebrow">About me</p>
          <div>
            <h2>
              {content.about.title}
              <br />
              <em>{content.about.accent}</em>
            </h2>
            <p className="about-copy">{content.about.copy}</p>
          </div>
        </div>
      </section>

      <section className="contact shell" id="contact">
        <p className="eyebrow">Say hello</p>
        <div className="contact-grid">
          <h2>
            {content.contact.title}
            <br />
            with <em>{content.contact.accent}</em>
          </h2>
          <div className="contact-links">
            <a href={content.contact.github} target="_blank" rel="noreferrer">
              GitHub <span>↗</span>
            </a>
            <a href={`mailto:${content.contact.email}`}>
              Email <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <span>© {new Date().getFullYear()} James Cahours</span>
        <span>{content.footer.location}</span>
        <span>{content.footer.note}</span>
      </footer>
    </main>
  );
}
