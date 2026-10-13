import { useEffect } from 'react'
import { nextProgress, paletteAt, scrollTarget } from './palette.js'

export default function useScrollTheme() {
  useEffect(() => {
    const root = document.documentElement
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)')
    let progress = 0, target = 0, frame = 0, previousFrame = 0
    let lastY = window.scrollY, lastScroll = performance.now(), speed = 0
    const paint = () => {
      const { tokens } = paletteAt(progress)
      Object.entries(tokens).forEach(([name, value]) => root.style.setProperty(name, value))
      root.dataset.themePhase = progress > 0.99 ? 'light' : progress < 0.01 ? 'dark' : 'transition'
    }
    const tick = (time) => {
      progress = nextProgress(progress, target, time - previousFrame, speed)
      previousFrame = time
      if (Math.abs(progress - target) < 0.001) progress = target
      paint()
      if (progress !== target) frame = requestAnimationFrame(tick)
      else frame = 0
    }
    const update = () => {
      const now = performance.now()
      speed = Math.min(Math.abs(window.scrollY - lastY) / Math.max(now - lastScroll, 16), 6)
      lastY = window.scrollY; lastScroll = now
      target = reduceMotion.matches ? 0 : scrollTarget(lastY, document.documentElement.scrollHeight - innerHeight)
      if (reduceMotion.matches) {
        cancelAnimationFrame(frame); frame = 0; progress = 0; paint(); return
      }
      if (!frame) { previousFrame = now; frame = requestAnimationFrame(tick) }
    }
    const initial = () => {
      target = reduceMotion.matches ? 0 : scrollTarget(window.scrollY, document.documentElement.scrollHeight - innerHeight)
      progress = target; paint()
    }
    initial()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    reduceMotion.addEventListener('change', update)
    // Opening badge lists changes the document length even without a resize.
    const resize = new ResizeObserver(update)
    resize.observe(document.body)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      reduceMotion.removeEventListener('change', update)
      resize.disconnect()
      Object.keys(paletteAt(0).tokens).forEach((name) => root.style.removeProperty(name))
      delete root.dataset.themePhase
    }
  }, [])
}
