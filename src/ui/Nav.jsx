import { identity, NAV } from '../data.js'

export default function Nav() {
  return (
    <>
      <nav className="nav" aria-label="Main navigation">
        <div className="nav-ico">AU</div>
        <span className="nav-brand">{identity.brand}</span>
        <div className="nav-sep" />
        <div className="nav-links">
          {NAV.map((n) => (
            <a key={n.label} href={`#${n.id}`} onClick={(event) => {
              const target = document.getElementById(n.id)
              if (!target) return
              event.preventDefault()
              history.replaceState(null, '', `#${n.id}`)
              target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
            }}>{n.label}</a>
          ))}
        </div>
        <a className="nav-cta" href={`mailto:${identity.email}`}>
          Get in touch <span>→</span>
        </a>
      </nav>
    </>
  )
}
