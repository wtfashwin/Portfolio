import { build } from 'vite'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { toMarkdown, toStructuredData } from './public-content.mjs'
import { checkCrawlerBuild } from './check-crawlers.mjs'

const project = fileURLToPath(new URL('..', import.meta.url))
const temporaryBuild = resolve(project, '.prerender-build')

try {
  await build({ root: project })
  await build({
    root: project,
    build: {
      ssr: 'scripts/prerender-entry.jsx',
      outDir: temporaryBuild,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: 'entry.mjs' } },
    },
  })
  const { render, portfolio } = await import(pathToFileURL(resolve(temporaryBuild, 'entry.mjs')))
  const htmlPath = resolve(project, 'dist/index.html')
  const template = await readFile(htmlPath, 'utf8')
  const markup = render()
  const structuredData = JSON.stringify(toStructuredData(portfolio)).replace(/</g, '\\u003c')
  const html = template
    .replace('<!-- portfolio:html -->', markup)
    .replace('<!-- portfolio:structured-data -->', `<script type="application/ld+json">${structuredData}</script>`)
  if (!html.includes(markup) || html.includes('<!-- portfolio:html -->')) {
    throw new Error('Portfolio HTML was not inserted into the build.')
  }
  await writeFile(htmlPath, html)
  await writeFile(resolve(project, 'dist/portfolio.json'), `${JSON.stringify(portfolio, null, 2)}\n`)
  await writeFile(resolve(project, 'dist/portfolio.md'), toMarkdown(portfolio))
  await writeFile(resolve(project, 'dist/llms.txt'), [
    `# ${portfolio.profile.name}`,
    '',
    `> ${portfolio.profile.role}. ${portfolio.profile.introduction}`,
    '',
    '## Portfolio',
    '',
    `- [Website](${portfolio.url}): Experience, public projects, open-source contributions, and credentials.`,
    `- [Markdown portfolio](${portfolio.url}portfolio.md): The same public facts in plain text, with source links and evidence dates.`,
    `- [Portfolio JSON](${portfolio.url}portfolio.json): Structured public data, including separately dated Kaggle scores and badge awards.`,
    '',
    '## Verification records',
    '',
    `- [Open-source record](${portfolio.profile.links.oss}): Full public contribution history.`,
    `- [Achievement record](${portfolio.profile.links.achievements}): Public badges and credentials with verification links.`,
    '',
  ].join('\n'))
  await writeFile(resolve(project, 'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${portfolio.url}</loc></url></urlset>\n`)
  await checkCrawlerBuild(resolve(project, 'dist'))
} finally {
  // Server code is a build tool only; the GitHub Pages artifact stays static.
  await rm(temporaryBuild, { recursive: true, force: true })
}
