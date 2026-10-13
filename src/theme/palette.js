const clamp = (value, low = 0, high = 1) => Math.min(high, Math.max(low, value))
const rgb = (hex) => hex.match(/[a-f\d]{2}/gi).map((channel) => parseInt(channel, 16))
const css = (channels) => `rgb(${channels.map(Math.round).join(', ')})`
const mix = (a, b, amount) => a.map((channel, i) => channel + (b[i] - channel) * amount)
export function luminance(channels) {
  return channels.map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }).reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0)
}
export function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}
function ink(background, darkCandidate, lightCandidate) {
  const candidates = [rgb(darkCandidate), rgb(lightCandidate)]
  const best = candidates.sort((a, b) => contrast(b, background) - contrast(a, background))[0]
  if (contrast(best, background) >= 4.5) return best
  return [rgb('#000000'), rgb('#ffffff')].sort((a, b) => contrast(b, background) - contrast(a, background))[0]
}
export function paletteAt(progress) {
  const amount = clamp(progress)
  const page = mix(rgb('#080b12'), rgb('#edf2f7'), amount).map(Math.round)
  const surface = mix(rgb('#111822'), rgb('#f6f8fa'), amount).map(Math.round)
  // Nav opacity is 0.94. Check both possible backdrop extremes, because content
  // scrolls underneath the glass. Foreground always remains fully opaque.
  const nav = surface
  const navBackdrops = [rgb('#000000'), rgb('#ffffff')].map((backdrop) => mix(backdrop, nav, 0.94))
  const navInk = [rgb('#ffffff'), rgb('#000000')].sort((a, b) =>
    Math.min(...navBackdrops.map((bg) => contrast(b, bg))) - Math.min(...navBackdrops.map((bg) => contrast(a, bg)))
  )[0]
  // A higher-opacity backing at the narrow mid-luminance range protects contrast
  // over both bright and dark content without fading the labels.
  const navOpacity = Math.min(...navBackdrops.map((bg) => contrast(navInk, bg))) >= 4.5 ? 0.94 : 1
  const tokens = {
    '--page-bg': css(page), '--page-fg': css(ink(page, '#101620', '#f2f5fa')),
    '--page-muted': css(ink(page, '#465368', '#b5bdcb')),
    '--page-link': css(ink(page, '#234e8e', '#a7c8ff')),
    '--surface-bg': css(surface), '--surface-fg': css(ink(surface, '#101620', '#f2f5fa')),
    '--surface-muted': css(ink(surface, '#465368', '#b5bdcb')),
    '--surface-link': css(ink(surface, '#234e8e', '#a7c8ff')),
    '--nav-bg': `rgba(${nav.join(', ')}, ${navOpacity})`, '--nav-ink': css(navInk),
    '--line': luminance(page) < 0.179 ? 'rgba(255,255,255,0.2)' : 'rgba(16,22,32,0.2)',
    '--surface-line': luminance(surface) < 0.179 ? 'rgba(255,255,255,0.2)' : 'rgba(16,22,32,0.2)',
  }
  return { tokens, page, surface, nav, navOpacity, navInk }
}
export function scrollTarget(y, maximum) {
  const ratio = clamp(y / Math.max(maximum * 0.65, 1))
  return ratio * ratio * (3 - 2 * ratio)
}
export function nextProgress(current, target, elapsed, speed) {
  const response = 360 - clamp(speed / 2.5) * 180
  return current + (target - current) * (1 - Math.exp(-clamp(elapsed, 0, 64) / response))
}
