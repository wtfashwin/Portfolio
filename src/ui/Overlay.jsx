import { useEffect } from 'react'
import {
  identity, scenes, skills, experience,
  openSource, certs, achievements, achievementGroups,
} from '../data.js'
import KaggleEvidence from './KaggleEvidence.jsx'
import OnlineProfiles, { LatestUpdates } from './OnlineProfiles.jsx'
function scrollToSection(event, id) {
  const target = document.getElementById(id)
  if (!target) return
  event.preventDefault()
  history.replaceState(null, '', `#${id}`)
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

const { links } = identity

function Head({ s, sm }) {
  return (
    <div className="scene-head">
      <h2 className={`h1${sm ? ' sm' : ''}`}>{s.h}</h2>
      {s.sub && <p className="sub">{s.sub}</p>}
    </div>
  )
}

// ── 00 HERO — the name, centered inside the two-tone ball ───────────────────
function Hero() {
  const s = scenes.hero
  return (
    <section id="hero" className="scene center hero-ball">
      <div className="scene-head hero-head">
        <p className="hero-role">{identity.role} · {identity.location}</p>
        <h1 className="h1 xl name">{identity.name}</h1>
        <p className="sub hero-sub">{s.sub}</p>
        <div className="cta-row center-row">
          <a className="pill primary" href="#work" onClick={(e) => scrollToSection(e, 'work')}>
            Explore my work <span className="ci">↗</span>
          </a>
          <a className="pill" href={links.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="pill" href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>

    </section>
  )
}

// Skill groups follow the heading, above the particle backdrop.
function Capabilities() {
  const s = scenes.capabilities
  const groups = Object.entries(skills)
  const card = ([group, items]) => (
    <div className="float glass" key={group}>
      <div className="float-label">{group}</div>
      <div className="chip-row">{items.map((it) => <span className="chip" key={it}>{it}</span>)}</div>
    </div>
  )
  return (
    <section id="capabilities" className="scene">
      <Head s={s} sm />
      <div className="content-grid skills-grid">{groups.map(card)}</div>
    </section>
  )
}

// Selected work, presented in a readable grid.
function Work() {
  const s = scenes.work
  const card = (x) => (
    <article className="float glass exp" key={x.org}>
      <div className="exp-head">
        <span className="exp-role">{x.role}<span className="exp-org"> · {x.org}</span></span>
        <span className="exp-when">{x.when}</span>
      </div>
      <div className="exp-flag">{x.flagship}</div>
      <ul className="exp-points">{x.points.slice(0, 3).map((p, i) => <li key={i}>{p}</li>)}</ul>
      <div className="tags">{x.tags.map((t) => <span key={t}>{t}</span>)}</div>
      {x.url && <a className="project-source" href={x.url} target="_blank" rel="noreferrer">View source code</a>}
    </article>
  )
  return (
    <section id="work" className="scene">
      <Head s={s} sm />
      <div className="content-grid work-grid">{experience.map(card)}</div>
    </section>
  )
}

// ── 06 OPEN SOURCE + PROOF (starfield) — wide grid of merged PRs ────────────
function Proof() {
  const s = scenes.proof
  return (
    <section id="proof" className="scene center">
      <div className="scrim widest">
        <Head s={s} sm />
        <div className="oss-list">
          {openSource.map((o) => (
            <a className="oss glass" key={o.num} href={o.url} target="_blank" rel="noreferrer">
              <div className="oss-top"><span className="oss-repo">{o.repo}</span><span className="oss-num">{o.num}</span></div>
              <div className="oss-note">{o.note}</div>
              <span className="oss-domain">Merged PR ↗</span>
            </a>
          ))}
        </div>
        <a className="achievement-record" href={links.oss} target="_blank" rel="noreferrer">View all 11 merged PRs ↗</a>
        <div id="credentials" className="credentials">
          <h3>Achievements & credentials</h3>
          <div className="achievement-grid">
            {achievements.map((a) => (
              <a className="achievement-card glass" key={a.v} href={a.url} target="_blank" rel="noreferrer">
                <strong>{a.v}</strong><span>{a.l}</span><span className="achievement-source">View profile ↗</span>
              </a>
            ))}
          </div>
          <details className="badge-details credential-details">
            <summary>Browse verified certifications</summary>
            <div className="credential-list">
            {certs.map((c) => (
              <a className="credential-link" key={c.url} href={c.url} target="_blank" rel="noreferrer">
                <strong>{c.issuer}</strong><span>{c.items} ↗</span>
              </a>
            ))}
            </div>
          </details>
          <details className="badge-details">
            <summary>Browse all Kaggle and LeetCode badges</summary>
            <div className="badge-groups">
              {achievementGroups.map((group) => (
                <div key={group.title}><h4>{group.title}</h4><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>
              ))}
            </div>
          </details>
          <a className="achievement-record" href={links.achievements} target="_blank" rel="noreferrer">View full achievement record ↗</a>
        </div>
        <KaggleEvidence />
      </div>
    </section>
  )
}

// ── 07 CONTACT (galaxy return) ──────────────────────────────────────────────
function Contact() {
  const s = scenes.contact
  return (
    <section id="contact" className="scene center">
      <div className="scrim">
        <Head s={s} />
        <div className="cta-row center-row">
          <a className="pill" href={`mailto:${identity.email}`}>Start a conversation <span className="ci">→</span></a>
        </div>
        <div className="links-row">
          <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={links.leetcode} target="_blank" rel="noreferrer">LeetCode</a>
          <a href={links.kaggle} target="_blank" rel="noreferrer">Kaggle</a>
          <a href={links.credly} target="_blank" rel="noreferrer">Credly</a>
          <a href={`mailto:${identity.email}`}>{identity.email}</a>
          <a href="./portfolio.md">Text version</a>
        </div>
        <div className="foot">{identity.location}</div>
      </div>
    </section>
  )
}

export default function Overlay() {
  // The section target exists only after React renders the portfolio.
  useEffect(() => {
    let id
    try { id = decodeURIComponent(window.location.hash.slice(1)) }
    catch { return }
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'auto' })
  }, [])

  return (
    <>
    <a className="skip-link" href="#main">Skip to content</a>
    <main id="main" className="overlay" tabIndex={-1}>
      <Hero />
      <Work />
      <LatestUpdates />
      <Capabilities />
      <Proof />
      <OnlineProfiles />
      <Contact />
    </main>
    </>
  )
}
