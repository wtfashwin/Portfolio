// Single source of truth for scroll progress (0..1), shared between the fixed
// R3F canvas (particle morph) and the DOM chrome (nav, progress bar).
// The canvas is position:fixed behind natively-scrolling content, so content
// can be any height — the morph just reads normalized window scroll.
export const scrollStore = {
  progress: 0,
  update() {
    const max = document.documentElement.scrollHeight - window.innerHeight
    this.progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
    return this.progress
  },
  scrollTo(fraction) {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: fraction * max, behavior: 'smooth' })
  },
}
