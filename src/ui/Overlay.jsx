import { useEffect } from 'react'
import { identity, experience, openSource, credentialGroups, profileLinks, principles, skills } from '../data.js'
import EngineeringNotebook from './EngineeringNotebook.jsx'
import { RetrievalVisual, ContextVisual } from './ProjectVisuals.jsx'
import KaggleEvidence from './KaggleEvidence.jsx'
import OnlineProfiles from './OnlineProfiles.jsx'

const { links } = identity
const External = ({ href, children, className = '' }) => <a className={className} href={href} target="_blank" rel="noreferrer">{children}<span className="external-arrow" aria-hidden="true">↗</span></a>

function Hero() {
  return (
    <section id="hero" className="hero page-width" aria-labelledby="hero-title">
      <div className="hero-intro">
        <p className="hero-role">AI systems & backend engineering</p>
        <h1 id="hero-title">I build AI applications.<br />And the systems behind them.</h1>
        <div className="hero-bottom">
          <p>Retrieval, APIs, data, and access controls.<br className="desktop-break" /> The whole path from an idea to working software.</p>
          <div className="hero-actions"><a href="#work" className="button button-light">Explore the work <span aria-hidden="true">↓</span></a><External href={links.github} className="text-link">GitHub</External></div>
        </div>
      </div>
      <div className="hero-workspace">
        <div className="workspace-side">
          <div className="workspace-heading"><span className="work-symbol" aria-hidden="true"><i /><i /><i /></span><span>Engineering notebook</span></div>
          <div className="workspace-index"><span className="index-label">The details matter.</span><p>A smaller memory boundary.<br />An honest calculation.<br />A failure you can recover from.</p></div>
          <div className="workspace-foot"><span>Two accepted changes.<br />Open them up.</span><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 82C12 44 41 15 79 15M39 82C39 59 56 42 79 42M66 82C66 74 71 69 79 69" /><circle cx="79" cy="15" r="3" /><circle cx="79" cy="42" r="3" /><circle cx="79" cy="69" r="3" /></svg></div>
        </div>
        <EngineeringNotebook />
      </div>
      <div className="hero-caption"><span>Made to be inspected. Change a setting; see the decision.</span><span>{identity.location}</span></div>
    </section>
  )
}

function Work() {
  return (
    <section id="work" className="section page-width" aria-labelledby="work-title">
      <div className="section-intro"><h2 id="work-title">From the interface<br />to the infrastructure.</h2><p>I work across the application and the services beneath it. These public projects show how the pieces connect.</p></div>
      <article className="project-story">
        <div className="project-copy">
          <p className="project-kind">Public project / AI applications</p><h3>Customer Support System</h3>
          <p className="project-lede">An AI answer is only as useful as the system around it.</p>
          <p>A support application connecting document ingestion, retrieval, and tool workflows with a FastAPI AI service and a TypeScript application.</p>
          <dl className="project-facts"><div><dt>The work</dt><dd>Streaming responses, authorization forwarding, request correlation, and readiness checks.</dd></div><div><dt>The stack</dt><dd>FastAPI, LangGraph, TypeScript</dd></div></dl>
          <External href="https://github.com/wtfashwin/Customer-Support-System" className="text-link accent-link">Explore the source</External>
          <details className="project-detail"><summary>Read the engineering details <span aria-hidden="true">+</span></summary><div><p>Retrieval connects ingestion, embeddings, and search to the answer path. The public implementation also covers JWT verification and tracing so the API boundary can be inspected alongside the AI workflow.</p><p>The repository is implementation evidence. Deployment scale and business impact are not claimed here.</p><External href="https://github.com/wtfashwin/Customer-Support-System/blob/main/apps/aiml-service/README.md">Read the service documentation</External></div></details>
        </div>
        <div className="project-stage"><RetrievalVisual /></div>
      </article>
      <article className="project-story project-reverse">
        <div className="project-copy">
          <p className="project-kind">Public project / Developer tools</p><h3>Context Dock</h3>
          <p className="project-lede">Keep the idea connected to the work.</p>
          <p>A native macOS tool for capturing tasks and matching them to project context. Built around the small moments where an idea is otherwise lost.</p>
          <dl className="project-facts"><div><dt>The work</dt><dd>Local agent events, decision journaling, and atomic note writes.</dd></div><div><dt>The stack</dt><dd>Swift, SwiftUI, AppKit</dd></div></dl>
          <External href="https://github.com/wtfashwin/ContextDock" className="text-link accent-link">Explore the source</External>
          <details className="project-detail"><summary>Read the engineering details <span aria-hidden="true">+</span></summary><div><p>Native UI components support task capture and project selection. Local event handling and atomic writes keep the context path explicit and inspectable in source.</p><p>The illustration explains that path. It does not show a running installation.</p><External href="https://github.com/wtfashwin/ContextDock/blob/main/README.md">Read the setup and implementation</External></div></details>
        </div>
        <div className="project-stage context-stage"><ContextVisual /></div>
      </article>
    </section>
  )
}

function Proof() {
  return (
    <section id="proof" className="section page-width" aria-labelledby="proof-title">
      <div className="section-intro"><h2 id="proof-title">Small changes.<br />Real consequences.</h2><p>Accepted upstream contributions to tools other engineers use. The problem, the change, and the review are all there.</p></div>
      <div className="proof-summary"><p><strong>11 merged pull requests</strong><span>across seven upstream projects</span></p><External href={links.oss} className="text-link">The complete record</External></div>
      <div className="contribution-list">{openSource.map((item) => <External key={item.num} href={item.url} className="contribution"><span className="contribution-project"><span className="merge-symbol" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 6v12m0-8c0 0 12 0 12 8" /><circle cx="6" cy="4" r="2" /><circle cx="6" cy="20" r="2" /><circle cx="18" cy="20" r="2" /></svg></span><strong>{item.repo.split('/').pop()}</strong><span className="pr-number">{item.num}</span></span><span className="contribution-note">{item.note}</span><span className="merged-label">Merged</span></External>)}</div>
      <p className="record-note">Merged status checked October 12, 2026. Each link opens the upstream review.</p>
    </section>
  )
}

function Practice() {
  const selected = [principles[0], principles[1], principles[3]]
  return <section id="practice" className="practice-band" aria-labelledby="practice-title"><div className="page-width practice-inner"><div className="practice-heading"><p className="section-label">How I work</p><h2 id="practice-title">The interesting part<br />is where it can break.</h2><p>Correctness, access, and recovery are design decisions. They belong in the implementation from the start.</p></div><div className="principles">{selected.map((p) => <article key={p.k}><h3>{p.k}</h3><p>{p.v}</p></article>)}</div></div></section>
}

function Credentials() {
  const count = credentialGroups.reduce((total, group) => total + group.items.length, 0)
  return (
    <section id="credentials" className="section credentials-section page-width" aria-labelledby="credentials-title">
      <div className="section-intro"><h2 id="credentials-title">A little more context.</h2><p>Professional credentials, technical practice, and experiments. Full records stay close to their sources.</p></div>
      <details className="record-disclosure" id="certifications-list"><summary><span>Certifications & learning<span>{count} linked records across cloud, AI, data, and security</span></span><span className="disclosure-plus" aria-hidden="true">+</span></summary><div className="disclosure-body">{credentialGroups.map((group) => <section className="credential-group" key={group.id}><h3>{group.title}<span>{group.items.length}</span></h3><div className="credential-grid">{group.items.map((c) => <article className="credential-card" key={c.issuer + '-' + c.items}><External href={c.url} className="credential-main"><div className="credential-meta"><span className="credential-mark" aria-hidden="true">{c.mark}</span><span>{c.issuer}</span><time>{c.when}</time></div><h4>{c.items}</h4><p>{c.summary}</p><span className="credential-open">Open credential</span></External>{c.verificationUrl && <External href={c.verificationUrl} className="credential-verify">Credly verification</External>}</article>)}</div></section>)}</div></details>
      <details className="record-disclosure"><summary><span>Experiments & competitive practice<span>Kaggle notebooks, competition records, and coding profiles</span></span><span className="disclosure-plus" aria-hidden="true">+</span></summary><div className="disclosure-body"><KaggleEvidence /><div className="practice-profiles"><External href={links.leetcode}>LeetCode profile</External><External href={links.geeksforgeeks}>GeeksforGeeks profile</External><External href={links.credly}>Credly records</External></div></div></details>
      <details className="record-disclosure"><summary><span>Tools & working knowledge<span>Application code, backend services, data, and delivery</span></span><span className="disclosure-plus" aria-hidden="true">+</span></summary><div className="disclosure-body skills-grid">{Object.entries(skills).map(([group, items]) => <div key={group}><h3>{group}</h3><p>{items.join(', ')}</p></div>)}</div></details>
      <OnlineProfiles />
    </section>
  )
}

function About() {
  return <section id="about" className="section page-width about-section" aria-labelledby="about-title"><div className="about-intro"><p className="section-label">Ashwin Upadhyay</p><h2 id="about-title">An engineer.<br />All the way through.</h2><p>I build AI applications and the backend systems behind them. My work moves between retrieval, APIs, data models, interfaces, and the checks that connect them.</p><p>Based in Pune, India. B.E. Information Technology, SPPU, 8.53 CGPA.</p><External href={links.linkedin} className="text-link accent-link">Connect on LinkedIn</External></div><div className="experience-list"><p className="section-label">Professional experience</p>{experience.filter(x => !x.url).map((x) => <article key={x.org}><div><h3>{x.org}</h3><span>{x.when}</span></div><h4>{x.role}</h4><p>{x.flagship}</p><ul>{x.points.map(p => <li key={p}>{p}</li>)}</ul></article>)}<p className="record-note">Professional summaries; employer code is private.</p></div></section>
}

function Contact() {
  return <footer id="contact" className="contact-section"><div className="page-width"><div className="contact-main"><p className="section-label">Have a difficult problem?</p><h2>Let’s make<br />something work.</h2><a href={'mailto:' + identity.email} className="button button-light">Start a conversation <span aria-hidden="true">↗</span></a><a className="contact-email" href={'mailto:' + identity.email}>{identity.email}</a></div><div className="footer-bottom"><p>Ashwin Upadhyay <span>{identity.location}</span></p><div>{profileLinks.filter(p => ['GitHub', 'LinkedIn', 'Medium'].includes(p.label)).map(p => <External key={p.label} href={p.url}>{p.label}</External>)}<a href="./llms.txt">For agents <span aria-hidden="true">↗</span></a></div><a href="#hero" className="back-top">Back to top <span aria-hidden="true">↑</span></a></div></div></footer>
}

export default function Overlay() {
  useEffect(() => {
    const revealHash = () => {
      let id
      try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
      const target = id && document.getElementById(id)
      if (!target) return
      if (target.tagName === 'DETAILS') target.open = true
      let ancestor = target.parentElement
      while (ancestor) { if (ancestor.tagName === 'DETAILS') ancestor.open = true; ancestor = ancestor.parentElement }
      target.scrollIntoView({ behavior: 'auto' })
    }
    revealHash()
    window.addEventListener('hashchange', revealHash)
    return () => window.removeEventListener('hashchange', revealHash)
  }, [])
  return <><main id="main" tabIndex={-1}><Hero /><Work /><Proof /><Practice /><Credentials /><About /></main><Contact /></>
}
