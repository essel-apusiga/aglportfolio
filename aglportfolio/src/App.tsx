import './App.css'

function App() {
  return (
    <main className="landing-page">
      <div className="announcement-banner">Coming soon: AGL Portfolio is preparing for launch.</div>

      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Digital presence in progress</p>
          <h1>Something polished is on the way.</h1>
          <p className="lead">
            We are shaping a modern business portfolio experience with clear
            case studies, sharp presentation, and a better way to introduce the
            brand online.
          </p>

          <div className="hero-actions">
            <a className="primary-action" href="mailto:hello@aglportfolio.com">
              Request early access
            </a>
            <span className="launch-note">Frontend preview page now live</span>
          </div>
        </div>

        <aside className="status-card" aria-label="Launch status">
          <span className="status-pill">Coming soon</span>
          <h2>Launch timeline</h2>
          <p>
            The new site is being refined for a cleaner first impression across
            mobile and desktop.
          </p>

          <ul className="status-list">
            <li>Brand story and offer positioning in progress</li>
            <li>Portfolio sections being prepared for release</li>
            <li>Contact and inquiry flow coming next</li>
          </ul>
        </aside>
      </section>

      <section className="info-strip" aria-label="Project updates">
        <article>
          <span>01</span>
          <h2>Clear messaging</h2>
          <p>A concise presentation of services, value, and business focus.</p>
        </article>

        <article>
          <span>02</span>
          <h2>Stronger visuals</h2>
          <p>A cleaner interface with bolder layout, spacing, and hierarchy.</p>
        </article>

        <article>
          <span>03</span>
          <h2>Faster contact</h2>
          <p>A direct path for visitors who want to reach out immediately.</p>
        </article>
      </section>
    </main>
  )
}

export default App
