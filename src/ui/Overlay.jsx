import { useEffect } from 'react'
import {
  identity, scenes, skills, irisStats, experience,
  principles, openSource, certs, velocity,
} from '../data.js'
import { scrollStore } from '../scrollStore.js'

const { links } = identity

function Head({ s, sm }) {
  return (
    <div className="scene-head">
      <div className="kicker">{s.kicker}</div>
      <h1 className={`h1${sm ? ' sm' : ''}`}>{s.h}</h1>
      {s.sub && <p className="sub">{s.sub}</p>}
    </div>
  )
}

// ── 00 HERO — the name, centered inside the two-tone ball ───────────────────
function Hero() {
  const s = scenes.hero
  return (
    <section className="scene center hero-ball">
      <div className="scene-head hero-head">
        <div className="badge"><span className="badge-dot">✦</span> {identity.role} · {identity.location}</div>
        <h1 className="h1 xl name">{identity.name}</h1>
        <p className="sub hero-sub">{s.sub}</p>
        <div className="cta-row center-row">
          <a className="pill primary" href="#work" onClick={(e) => { e.preventDefault(); scrollStore.scrollTo(4 / 7) }}>
            Explore my work <span className="ci">↗</span>
          </a>
          <a className="pill" href={links.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="pill" href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
      <div className="scroll-hint"><span>scroll</span><i /></div>
    </section>
  )
}

// ── 01 CAPABILITIES (galaxy) — skill groups flank the disc ──────────────────
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
    <section className="scene">
      <Head s={s} sm />
      <div className="flank left">{groups.slice(0, 3).map(card)}</div>
      <div className="flank right">{groups.slice(3).map(card)}</div>
    </section>
  )
}

// ── 02 VELOCITY (hyperspin sphere) — agent-leverage proof band ──────────────
function Core() {
  const s = scenes.core
  return (
    <section className="scene center statement">
      <div className="scrim">
        <Head s={s} />
        <div className="proof-band">
          {velocity.map((a) => (
            <div className="band-stat glass" key={a.l}>
              <div className="band-v">{a.v}</div>
              <div className="band-l">{a.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 03 IRIS (energy sphere) — flagship metrics flank the orb ────────────────
function Iris() {
  const s = scenes.iris
  const card = (c) => (
    <div className="float glass stat" key={c.u}>
      <div className="stat-v">{c.v}<span className="stat-u">{c.u}</span></div>
      <div className="stat-l">{c.l}</div>
    </div>
  )
  return (
    <section className="scene">
      <Head s={s} sm />
      <div className="flank left">{irisStats.slice(0, 2).map(card)}</div>
      <div className="flank right">{irisStats.slice(2).map(card)}</div>
    </section>
  )
}

// ── 04 WORK (funnel) — four role cards flank the vortex ─────────────────────
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
    </article>
  )
  return (
    <section className="scene">
      <Head s={s} sm />
      <div className="flank left">{experience.slice(0, 2).map(card)}</div>
      <div className="flank right">{experience.slice(2).map(card)}</div>
    </section>
  )
}

// ── 05 PRINCIPLES (DNA) — engineering principles flank the helix ────────────
function Principles() {
  const s = scenes.principles
  const card = (p) => (
    <div className="float glass prin" key={p.k}>
      <div className="prin-k">{p.k}</div>
      <div className="prin-v">{p.v}</div>
    </div>
  )
  return (
    <section className="scene">
      <Head s={s} sm />
      <div className="flank left">{principles.slice(0, 3).map(card)}</div>
      <div className="flank right">{principles.slice(3).map(card)}</div>
    </section>
  )
}

// ── 06 OPEN SOURCE + PROOF (starfield) — wide grid of merged PRs ────────────
function Proof() {
  const s = scenes.proof
  return (
    <section className="scene center">
      <div className="scrim widest">
        <Head s={s} sm />
        <div className="oss-list">
          {openSource.map((o) => (
            <a className="oss glass" key={o.num} href={o.url} target="_blank" rel="noreferrer">
              <div className="oss-top"><span className="oss-repo">{o.repo}</span><span className="oss-num">{o.num}</span></div>
              <div className="oss-title">{o.title}</div>
              <div className="oss-note">{o.note}</div>
              <div className="oss-domain">{o.domain}</div>
            </a>
          ))}
        </div>
        <div className="cert-strip">
          <span className="cert-strip-label">Certified</span>
          {certs.map((c) => <span className="cert-pill" key={c.issuer}>{c.issuer}</span>)}
        </div>
      </div>
    </section>
  )
}

// ── 07 CONTACT (galaxy return) ──────────────────────────────────────────────
function Contact() {
  const s = scenes.contact
  return (
    <section className="scene center">
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
          <a href={links.medium} target="_blank" rel="noreferrer">Medium</a>
          <a href={links.paper} target="_blank" rel="noreferrer">TIJER Paper</a>
          <a href={`mailto:${identity.email}`}>{identity.email}</a>
          <a href={`tel:${identity.phone.replace(/\s/g, '')}`}>{identity.phone}</a>
        </div>
        <div className="foot">{identity.location} · B.E. Information Technology · SPPU · 8.53 CGPA · Built with react-three-fiber + three.js</div>
      </div>
    </section>
  )
}

export default function Overlay() {
  // Scroll reveal: glass elements rise out of the particle field as they enter.
  useEffect(() => {
    const els = document.querySelectorAll('.float, .oss, .band-stat, .cert-strip')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('in', e.isIntersecting)),
      { threshold: 0.15 }
    )
    els.forEach((el) => { el.classList.add('reveal'); io.observe(el) })
    return () => io.disconnect()
  }, [])
  return (
    <div className="overlay">
      <Hero />
      <Capabilities />
      <Core />
      <Iris />
      <Work />
      <Principles />
      <Proof />
      <Contact />
    </div>
  )
}
