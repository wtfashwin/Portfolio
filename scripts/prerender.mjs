import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const outputPath = join(root, 'dist/index.html')
const profile = JSON.parse(await readFile(join(root, 'public/profile.json'), 'utf8'))
const { identity, canonicalUrl } = profile
const socialCard = await readFile(join(root, 'dist/social-card.png'))
assert.equal(socialCard.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'Social card must be a PNG')
assert.equal(socialCard.readUInt32BE(16), 1200, 'Social card must be 1200 pixels wide')
assert.equal(socialCard.readUInt32BE(20), 630, 'Social card must be 630 pixels high')
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]))
const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${canonicalUrl}#person`,
  name: identity.name,
  url: canonicalUrl,
  jobTitle: identity.role,
  description: identity.bio,
  email: `mailto:${identity.email}`,
  homeLocation: { '@type': 'Place', name: identity.location },
  sameAs: ['github', 'linkedin', 'kaggle', 'leetcode', 'credly', 'geeksforgeeks', 'medium', 'hashnode'].map((key) => identity.links[key]).filter(Boolean),
}
const title = escapeHtml(`${identity.name} · ${identity.role}`)
const description = escapeHtml(identity.bio)
const metadata = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="author" content="${escapeHtml(identity.name)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="alternate" type="application/json" href="./profile.json" title="Machine-readable profile and evidence" />
    <link rel="alternate" type="text/plain" href="./llms.txt" title="Profile and source guide" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="${escapeHtml(identity.name)}" />
    <meta property="og:image" content="${canonicalUrl}social-card.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(identity.name)} — ${escapeHtml(identity.role)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${canonicalUrl}social-card.png" />
    <meta name="twitter:image:alt" content="${escapeHtml(identity.name)} — ${escapeHtml(identity.role)}" />
    <script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>
    `

const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', logLevel: 'error' })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  const appHtml = renderToString(createElement(App))
  assert.match(appHtml, /<main\b/, 'Pre-render must contain the real semantic application, not an empty shell')
  assert.ok(appHtml.includes(`mailto:${identity.email}`), 'Pre-render must expose the contact link without JavaScript')
  for (const entry of profile.publicProjects) {
    assert.ok(appHtml.includes(entry.sourceUrl), `Pre-render must include public project source: ${entry.name}`)
  }
  const source = await readFile(outputPath, 'utf8')
  const appSlot = /<!--portfolio-app:start-->[\s\S]*?<!--portfolio-app:end-->/
  const metaSlot = /<!--portfolio-meta:start-->[\s\S]*?<!--portfolio-meta:end-->/
  assert.match(source, appSlot, 'Missing application HTML slot in built index')
  assert.match(source, metaSlot, 'Missing metadata slot in built index')
  const html = source
    .replace(appSlot, () => `<!--portfolio-app:start-->${appHtml}<!--portfolio-app:end-->`)
    .replace(metaSlot, () => `<!--portfolio-meta:start-->${metadata}<!--portfolio-meta:end-->`)
  await writeFile(outputPath, html)
  console.log(`Pre-rendered real App HTML (${Buffer.byteLength(appHtml).toLocaleString('en-US')} bytes). Work and contact links are present before JavaScript runs.`)
} finally {
  await server.close()
}
