import { useEffect, useRef, useState } from 'react'
import { identity } from '../data.js'

const sections = [['work', 'Work'], ['proof', 'Open source'], ['practice', 'Approach'], ['about', 'About']]

export default function Nav() {
  const [active, setActive] = useState('')
  const menu = useRef(null)
  useEffect(() => {
    const visible = new Set()
    let footerVisible = false
    const update = () => setActive(footerVisible ? '' : sections.find(([id]) => visible.has(id))?.[0] || '')
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id)
        else visible.delete(entry.target.id)
      }
      update()
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 })
    sections.forEach(([id]) => { const el = document.getElementById(id); if (el) observer.observe(el) })
    const footer = new IntersectionObserver(([entry]) => {
      footerVisible = entry.isIntersecting && entry.intersectionRatio >= .25
      update()
    }, { threshold: .25 })
    const contact = document.getElementById('contact')
    if (contact) footer.observe(contact)
    return () => { observer.disconnect(); footer.disconnect() }
  }, [])
  const close = () => { if (menu.current) menu.current.open = false }
  return (
    <header className="site-header">
      <nav className="nav page-width" aria-label="Main navigation">
        <a className="nav-name" href="#hero" aria-label="Ashwin Upadhyay, home">Ashwin Upadhyay<span className="identity-dot" aria-hidden="true" /></a>
        <div className="nav-links">{sections.map(([id, label]) => <a key={id} href={'#' + id} aria-current={active === id ? 'location' : undefined}>{label}</a>)}</div>
        <a className="nav-cta" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
        <details className="mobile-menu" ref={menu} onKeyDown={(e) => { if (e.key === 'Escape') { close(); e.currentTarget.querySelector('summary')?.focus() } }}>
          <summary>Menu <span aria-hidden="true">+</span></summary>
          <div className="mobile-menu-panel">{sections.map(([id, label]) => <a key={id} href={'#' + id} onClick={close}>{label}</a>)}<a href="#contact" onClick={close}>Contact</a><a href={'mailto:' + identity.email} onClick={close}>Email Ashwin</a></div>
        </details>
      </nav>
    </header>
  )
}
