import { useEffect, useRef } from 'react'

// Faint field of random monospace glyphs. Slow drifting patches brighten
// parts of the grid, and a few glyphs reshuffle each frame.
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const CELL_W = 12.5
const CELL_H = 26
const FPS = 14

const pick = () => CHARS[(Math.random() * CHARS.length) | 0]

export default function GlyphField() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let cols = 0, rows = 0, grid = [], raf = 0, last = 0

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = innerWidth * dpr
      canvas.height = innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = '13px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.textBaseline = 'middle'
      cols = Math.ceil(innerWidth / CELL_W) + 1
      rows = Math.ceil(innerHeight / CELL_H) + 1
      grid = Array.from({ length: cols * rows }, pick)
    }

    // Cheap smooth field from layered sines, in 0..1.
    const field = (x, y, t) => {
      const v = Math.sin(x * 0.09 + t * 0.21) + Math.sin(y * 0.23 - t * 0.17)
        + Math.sin((x + y) * 0.06 + t * 0.13) + Math.sin(Math.hypot(x - cols / 2, y - rows / 2) * 0.12 - t * 0.25)
      return (v + 4) / 8
    }

    const draw = (now) => {
      const t = now / 1000
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      for (let i = 0; i < 40; i++) grid[(Math.random() * grid.length) | 0] = pick()
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const f = field(x, y, t)
          const a = 0.02 + Math.max(0, f - 0.6) * 0.45
          ctx.fillStyle = `rgba(239,237,230,${a.toFixed(3)})`
          ctx.fillText(grid[y * cols + x], x * CELL_W, y * CELL_H + CELL_H / 2)
        }
      }
    }

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden || now - last < 1000 / FPS) return
      last = now
      draw(now)
    }

    resize()
    addEventListener('resize', resize)
    if (still) draw(0)
    else raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} className="glyph-field" aria-hidden="true" />
}
