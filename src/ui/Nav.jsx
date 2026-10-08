import { useEffect, useState } from 'react'
import { identity, NAV } from '../data.js'

export default function Nav() {
  const [active, setActive] = useState('hero')
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const reached = NAV.filter(({ id }) => document.getElementById(id)?.getBoundingClientRect().top <= 150)
      setActive(reached.at(-1)?.id || 'hero')
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule) }
  }, [])
  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav-links">
        {NAV.map((section) => (
          <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined} onClick={(event) => {
            const target = document.getElementById(section.id)
            if (!target) return
            event.preventDefault()
            history.replaceState(null, '', `#${section.id}`)
            target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
          }}>{section.label}</a>
        ))}
      </div>
      <a className="nav-cta" href={`mailto:${identity.email}`}>Get in touch <span aria-hidden="true">→</span></a>
    </nav>
  )
}
