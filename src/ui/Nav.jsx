import { useEffect, useRef, useState } from 'react'
import { identity, NAV, BRAND_WORDS } from '../data.js'
import { scrollStore } from '../scrollStore.js'

// Fixed top nav + thin scroll-progress bar. Reads the scroll offset from the
// shared store (written by ScrollReporter inside the Canvas) via a rAF loop.
export default function Nav() {
  const [brandIdx, setBrandIdx] = useState(0)
  const barRef = useRef(null)
  const lastIdx = useRef(0)

  useEffect(() => {
    let raf
    const tick = () => {
      const o = scrollStore.progress
      if (barRef.current) barRef.current.style.transform = `scaleX(${o})`
      const idx = Math.min(Math.max(Math.round(o * 7), 0), 7)
      if (idx !== lastIdx.current) { lastIdx.current = idx; setBrandIdx(idx) }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <div className="progress"><div className="progress-bar" ref={barRef} /></div>
      <nav className="nav" aria-label="Main navigation">
        <div className="nav-ico">AU</div>
        <span className="nav-brand">{BRAND_WORDS[brandIdx]}</span>
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
