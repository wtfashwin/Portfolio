import assert from 'node:assert/strict'
import { paletteAt, scrollTarget, nextProgress } from '../src/theme/palette.js'
// Independent WCAG sRGB contrast calculation validates the emitted CSS palette.
const luminance = (rgb) => rgb.map((channel) => {
  const normalized = channel / 255
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
}).reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0)
const ratio = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05)
const channels = (css) => css.match(/[\d.]+/g).slice(0, 3).map(Number)
let minimum = Infinity
for (let sample = 0; sample <= 1000; sample++) {
  const { tokens, page, surface, nav, navOpacity, navInk } = paletteAt(sample / 1000)
  for (const [background, names] of [
    [page, ['--page-fg', '--page-muted', '--page-link']],
    [surface, ['--surface-fg', '--surface-muted', '--surface-link']],
  ]) for (const name of names) {
    const contrast = ratio(channels(tokens[name]), background)
    minimum = Math.min(minimum, contrast)
    assert.ok(contrast >= 4.5, `Unreadable ${name} at sample ${sample}: ${contrast}`)
  }
  for (const extreme of [0, 255]) {
    const background = nav.map((channel) => channel * navOpacity + extreme * (1 - navOpacity))
    const contrast = ratio(navInk, background)
    minimum = Math.min(minimum, contrast)
    assert.ok(contrast >= 4.5, `Unreadable glass nav at sample ${sample}: ${contrast}`)
  }
}
assert.equal(scrollTarget(0, 1000), 0)
assert.equal(scrollTarget(1000, 1000), 1)
assert.equal(scrollTarget(-100, 1000), 0)
for (const speed of [0, 1, 6, 100]) {
  let progress = 0
  for (let frame = 0; frame < 200; frame++) {
    const next = nextProgress(progress, 1, 16, speed)
    assert.ok(next >= progress && next <= 1, 'Animation must converge without overshoot')
    progress = next
  }
  assert.ok(progress > 0.999, 'Animation must settle after scrolling stops')
}
console.log(`Theme check passed: 1,001 palette steps; minimum text contrast ${minimum.toFixed(2)}:1; bounded, convergent motion.`)
