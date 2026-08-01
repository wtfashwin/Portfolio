import { useEffect, useState } from 'react'

// Cinematic intro overlay — counts to 100 while the WebGL context warms up,
// then fades out once App signals `done`.
export default function Loader({ done }) {
  const [pct, setPct] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let raf
    let v = 0
    const tick = () => {
      const ceil = done ? 100 : 92
      v += (ceil - v) * 0.06
      if (done && v > 99.4) v = 100
      setPct(Math.floor(v))
      if (v < 100) raf = requestAnimationFrame(tick)
      else setTimeout(() => setHidden(true), 500)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [done])

  if (hidden) return null
  return (
    <div className={`loader${pct >= 100 ? ' done' : ''}`}>
      <div className="loader-pct">{pct}</div>
      <div className="loader-track"><div className="loader-fill" style={{ width: `${pct}%` }} /></div>
      <div className="loader-label">Initializing</div>
    </div>
  )
}
