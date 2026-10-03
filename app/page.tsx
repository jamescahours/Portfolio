const skills = [
  ".NET / C#",
  "React",
  "Angular",
  "TypeScript",
  "SQL Server",
  "Azure",
  "REST APIs",
  "Git / DevOps",
];

const projects = [
  {
    title: "Loan Origination Platform",
    description:
      "Enterprise financial software built across .NET APIs and Angular applications, with integrations for lending, payments, document workflows, and third-party providers.",
    tags: [".NET", "Angular", "SQL Server", "Azure"],
  },
  {
    title: "AI Content & Search",
    description:
      "Document ingestion and retrieval workflows using Azure Blob Storage and AI search patterns for lender-specific internal knowledge.",
    tags: ["Azure", "AI Search", ".NET", "RAG"],
  },
  {
    title: "Consumer Web Applications",
    description:
      "Responsive web applications and APIs supporting authentication, application intake, uploads, SSO, and multi-system data flows.",
    tags: ["React", "Angular", "TypeScript", "APIs"],
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav className="nav shell">
          <a className="brand" href="#top">JC</a>
          <div className="navLinks">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div className="heroContent shell" id="top">
          <p className="eyebrow">Software Developer · Austin, Texas</p>
          <h1>
            I build practical software
            <span> for real-world systems.</span>
          </h1>
          <p className="heroCopy">
            I’m James Cahours, a full-stack software developer focused on .NET,
            modern JavaScript frameworks, APIs, databases, and cloud architecture.
          </p>
          <div className="heroActions">
            <a className="button primary" href="#projects">View my work</a>
            <a
              className="button secondary"
              href="https://github.com/jamescahours"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      <section className="section shell" id="about">
        <div className="sectionHeading">
          <p className="eyebrow">About</p>
          <h2>Full-stack experience across the whole application lifecycle.</h2>
        </div>
        <div className="aboutGrid">
          <p>
            I’ve spent my career building and maintaining business-critical software,
            with deep experience in C#/.NET and years of work across React, Angular,
            TypeScript, SQL, Azure, integrations, testing, and deployment.
          </p>
          <p>
            I enjoy solving the parts of software development that sit between clean
            code and messy reality: system integrations, legacy modernization,
            developer tooling, production troubleshooting, and turning business
            requirements into maintainable applications.
          </p>
        </div>

        <div className="skills">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="section shell" id="projects">
        <div className="sectionHeading">
          <p className="eyebrow">Selected Work</p>
          <h2>Systems, integrations, and products I’ve worked on.</h2>
        </div>

        <div className="projectGrid">
          {projects.map((project) => (
            <article className="card" key={project.title}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell contact" id="contact">
        <p className="eyebrow">Contact</p>
        <h2>Want to build something?</h2>
        <p>
          The next step for this site is adding your real project history, resume,
          contact details, and a database-backed project or blog section.
        </p>
        <a
          className="button primary"
          href="https://github.com/jamescahours"
          target="_blank"
          rel="noreferrer"
        >
          Find me on GitHub
        </a>
      </section>

      <footer className="footer shell">
        <span>© {new Date().getFullYear()} James Cahours</span>
        <span>Built with Next.js</span>
      </footer>
    </main>
  );
}
