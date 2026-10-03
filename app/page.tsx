const categories = [
  { number: "01", title: "Software", copy: "Products, platforms, APIs, integrations, and the systems behind them.", href: "#software" },
  { number: "02", title: "Home & DIY", copy: "Decks, landscaping, home automation, and the projects that never really end.", href: "#projects" },
  { number: "03", title: "Music", copy: "Guitars, amps, tone chasing, recording, and an unreasonable amount of gear.", href: "#music" },
  { number: "04", title: "Technology", copy: "PC builds, networking, home servers, and whatever I’m tinkering with next.", href: "#technology" },
];

const projects = [
  {
    kicker: "Software · Personal",
    title: "A place for everything I build.",
    copy: "This site is becoming the home for my software work, personal projects, music, and the technical rabbit holes I tend to disappear into.",
    meta: "Next.js · React · TypeScript · Vercel",
    className: "project-card project-card-wide project-site",
  },
  {
    kicker: "Technology · Home Automation",
    title: "A home that works a little smarter.",
    copy: "Home Assistant, Z-Wave, Zigbee, Node-RED, sensors, scenes, and automations built around how we actually use the house.",
    meta: "Home Assistant · Raspberry Pi · Z-Wave · Zigbee",
    className: "project-card project-automation",
  },
  {
    kicker: "Home & DIY · Backyard",
    title: "Building a better backyard.",
    copy: "A from-scratch deck project with new footings, structural framing, drainage work, and a stock-tank pool integrated into the design.",
    meta: "Design · Framing · Concrete · Landscaping",
    className: "project-card project-deck",
  },
  {
    kicker: "Music · Guitar",
    title: "Always chasing the next sound.",
    copy: "Guitars, amps, pedals, modelers, recording gear, and the never-ending attempt to understand why one tiny change sounds completely different.",
    meta: "Guitar · Amps · Effects · Recording",
    className: "project-card project-music",
  },
];

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
        <p className="hero-kicker">Developer. Guitar player. Perpetual tinkerer.</p>
        <h1>
          I like to build <em>things.</em>
        </h1>
        <div className="hero-bottom">
          <p>
            Sometimes it&apos;s software. Sometimes it&apos;s a deck. Sometimes it&apos;s
            a guitar tone that takes three hours to get 2% better.
          </p>
          <a className="circle-link" href="#projects" aria-label="View projects">
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
          <h2>A few things I&apos;m working on.</h2>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <article
              className={project.className}
              id={
                index === 0
                  ? "software"
                  : index === 2
                    ? "technology"
                    : index === 3
                      ? "music"
                      : undefined
              }
              key={project.title}
            >
              <div className="project-visual" aria-hidden="true">
                <span className="visual-number">0{index + 1}</span>
                <span className="visual-mark">
                  {index === 0 ? "{ }" : index === 1 ? "⌁" : index === 2 ? "⌂" : "♪"}
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
              Developer by trade.
              <br />
              <em>Maker by nature.</em>
            </h2>
            <p className="about-copy">
              I&apos;m James, a software developer in Austin, Texas. I&apos;ve spent my
              career building business software across .NET, React, Angular, SQL,
              Azure, APIs, and integrations. Away from the keyboard, I&apos;m usually
              building something at the house, wiring up another automation, working
              on a PC, or playing guitar louder than necessary.
            </p>
          </div>
        </div>
      </section>

      <section className="contact shell" id="contact">
        <p className="eyebrow">Say hello</p>
        <div className="contact-grid">
          <h2>
            Good things start
            <br />
            with <em>curiosity.</em>
          </h2>
          <div className="contact-links">
            <a href="https://github.com/jamescahours" target="_blank" rel="noreferrer">
              GitHub <span>↗</span>
            </a>
            <a href="mailto:james@jamescahours.com">
              Email <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <span>© {new Date().getFullYear()} James Cahours</span>
        <span>Austin, Texas</span>
        <span>Built because I wanted to.</span>
      </footer>
    </main>
  );
}
