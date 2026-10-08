import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;',
}[character]))

export async function checkCrawlerBuild(directory) {
  const [html, json, markdown, sitemap, llms] = await Promise.all(
    ['index.html', 'portfolio.json', 'portfolio.md', 'sitemap.xml', 'llms.txt']
      .map((name) => readFile(resolve(directory, name), 'utf8')),
  )
  const portfolio = JSON.parse(json)
  assert.ok(!('workFeed' in portfolio) && !('publicUpdates' in portfolio), 'Unreviewed activity feeds must not enter public exports.')
  for (const content of [html, json, markdown]) {
    assert.ok(!/Recent public work|JanSetu/.test(content), 'Removed activity must not appear in the portfolio or crawler exports.')
  }
  const site = new URL(portfolio.url)
  const profilesSection = html.match(/<section\b[^>]*id="profiles"[^>]*>[\s\S]*?<\/section>/)?.[0] || ''
  assert.equal((profilesSection.match(/data-logo-src=/g) || []).length, portfolio.directory.profiles.length, 'Every public platform must display its logo.')
  const logoSources = [...html.matchAll(/data-logo-src="([^"]+)"/g)].map((match) => match[1])
  for (const source of new Set(logoSources)) {
    const url = new URL(source, site)
    assert.equal(url.origin, site.origin, 'Platform logos must ship with the portfolio.')
    assert.ok(url.pathname.startsWith(site.pathname), 'Logo paths must work under the GitHub Pages project URL.')
    const asset = await readFile(resolve(directory, decodeURIComponent(url.pathname.slice(site.pathname.length))))
    assert.ok(asset.length, 'Platform logo assets must be included in the build.')
  }
  // React inserts hydration comments between adjacent text nodes. They do not
  // change the text that a non-JavaScript reader receives.
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/)?.[0]?.replace(/<!--[\s\S]*?-->/g, '')
  assert.ok(main, 'The raw HTML must contain the portfolio main element without JavaScript.')
  assert.equal((main.match(/<h1\b/g) || []).length, 1, 'The portfolio must have one main heading.')
  assert.ok(main.includes(escapeHtml(portfolio.profile.name)), 'The profile must be present in raw HTML.')
  assert.ok(main.includes(escapeHtml(portfolio.profile.introduction)), 'The introduction must be present in raw HTML.')
  for (const section of Object.values(portfolio.sections)) assert.ok(main.includes(escapeHtml(section.heading)))
  for (const item of portfolio.experience) {
    assert.ok(main.includes(escapeHtml(item.org)))
    for (const point of item.points.slice(0, 3)) assert.ok(main.includes(escapeHtml(point)))
    if (item.url) assert.ok(main.includes(`href="${escapeHtml(item.url)}"`))
  }
  for (const item of portfolio.openSource) {
    assert.ok(main.includes(escapeHtml(item.note)))
    assert.ok(main.includes(`href="${escapeHtml(item.url)}"`))
  }
  const awarded = portfolio.kaggle.badges.filter((item) => item.status === 'awarded')
  assert.ok(main.includes(`${awarded.length} earned Kaggle badges`))
  for (const badge of awarded) {
    assert.ok(main.includes(escapeHtml(badge.name)))
    assert.ok(markdown.includes(badge.checkedAt), 'Markdown must preserve badge evidence dates.')
  }
  for (const score of portfolio.kaggle.competitions) {
    assert.ok(main.includes(score.publicScore.toFixed(6)))
    assert.ok(markdown.includes(score.checkedAt), 'Markdown must preserve score receipt times.')
  }
  for (const platform of portfolio.directory.profiles.filter((item) => item.status === 'verified')) {
    assert.ok(main.includes(`href="${escapeHtml(platform.url)}"`), `Verified ${platform.platform} link must appear in raw HTML.`)
    assert.ok(markdown.includes(platform.url))
  }
  for (const item of portfolio.writing) {
    assert.ok(main.includes(escapeHtml(item.title)), 'Writing titles must appear in raw HTML.')
    assert.ok(main.includes(`href="${escapeHtml(item.url)}"`), 'Writing sources must appear in raw HTML.')
  }
  const structuredData = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1])
  assert.equal(structuredData['@type'], 'ProfilePage')
  assert.equal(structuredData.mainEntity.name, portfolio.profile.name)
  assert.equal(structuredData.mainEntity.jobTitle, portfolio.profile.role)
  assert.ok(html.includes(`rel="canonical" href="${portfolio.url}"`))
  assert.ok(sitemap.includes(`<loc>${portfolio.url}</loc>`))
  assert.ok(llms.includes(`${portfolio.url}portfolio.md`))
  assert.ok(!html.includes('<!-- portfolio:html -->'))
  console.log(`Crawler check passed: raw HTML contains ${portfolio.experience.length} work entries, ${portfolio.openSource.length} selected PRs, ${awarded.length} Kaggle badges, ${portfolio.directory.profiles.length} public platforms, ${portfolio.writing.length} writing records, and dated score exports. Automatic activity feeds are excluded.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await checkCrawlerBuild(fileURLToPath(new URL('../dist', import.meta.url)))
}
