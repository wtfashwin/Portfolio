import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[c]))
const reportSourceUrl = 'https://github.com/wtfashwin/csv-report-pilot'
const reportLiveUrl = 'https://wtfashwin.github.io/Portfolio/reporting-example/'
const reportAnchor = 'csv-reporting-example'
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)].map(([, name, , value]) => [name.toLowerCase(), value]))
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) => attributes(tag))
const textContent = html => html.replace(/<[^>]*>/g, '').trim()

export async function checkReportingExample(directory) {
  const reportDirectory = resolve(directory, 'reporting-example')
  const [html, receiptJson, performance, leads] = await Promise.all([
    readFile(resolve(reportDirectory, 'index.html'), 'utf8'),
    readFile(resolve(reportDirectory, 'receipt.json'), 'utf8'),
    readFile(resolve(reportDirectory, 'performance.csv')),
    readFile(resolve(reportDirectory, 'leads.csv')),
  ])
  const receipt = JSON.parse(receiptJson)
  const title = textContent(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
  const heading = textContent(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '')
  for (const [name, text] of [['title', title], ['heading', heading]]) {
    assert.match(text, /synthetic/i, `Report ${name} must identify the synthetic example.`)
    assert.match(text, /CSV/i, `Report ${name} must describe the CSV workflow.`)
  }
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, 'The report must have one clear main heading.')
  const descriptions = tags(html, 'meta').filter(tag => tag.name === 'description')
  assert.equal(descriptions.length, 1, 'The report needs one factual search description.')
  assert.match(descriptions[0].content || '', /fictional|synthetic/i)
  assert.match(descriptions[0].content || '', /CSV/i)
  const canonicals = tags(html, 'link').filter(tag => tag.rel === 'canonical')
  assert.deepEqual(canonicals.map(tag => tag.href), [reportLiveUrl], 'The report canonical must identify this published HTML page.')
  assert.ok(html.includes('All data is fictional'), 'The fictional-data notice must remain visible.')
  assert.ok(!/<script\b/i.test(html), 'The published proof must remain a standalone report, without an upload or service script.')
  const hrefs = tags(html, 'a').map(tag => tag.href)
  for (const href of ['performance.csv', 'leads.csv', 'receipt.json', reportSourceUrl, `../#${reportAnchor}`]) {
    assert.ok(hrefs.includes(href), `Report readers need an inspection link to ${href}`)
  }
  assert.match(receipt.demonstration || '', /synthetic/i)
  assert.equal(receipt.validation.status, 'passed')
  for (const [name, bytes] of [['performance', performance], ['leads', leads]]) {
    assert.equal(receipt.sources[name].filename, `${name}.csv`)
    assert.equal(createHash('sha256').update(bytes).digest('hex'), receipt.sources[name].sha256, `Published ${name} CSV bytes must match the calculation receipt.`)
  }
  const body = html.match(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/i)?.[1] || ''
  const rows = [...body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(([, row]) => [...row.matchAll(/<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/gi)].map(([, cell]) => textContent(cell)))
  const metrics = [
    ['Total spend (USD)', 'spend'], ['Impressions', 'impressions'], ['Clicks', 'clicks'],
    ['Source-reported leads', 'reported_leads'], ['Click-through rate (%)', 'ctr_percent'],
    ['Cost per reported lead (USD)', 'cost_per_reported_lead'],
  ]
  assert.equal(rows.length, metrics.length, 'The report must expose all six metric rows.')
  const printable = value => value === null ? 'N/A' : String(value)
  for (const [label, key] of metrics) {
    const matchingRows = rows.filter(row => row[0] === label)
    assert.equal(matchingRows.length, 1, `The report needs one visible row for ${label}.`)
    assert.deepEqual(matchingRows[0].slice(1), [
      printable(receipt.periods.previous.metrics[key]), printable(receipt.periods.current.metrics[key]),
      printable(receipt.percent_changes[key]),
    ], `Visible ${label} values must agree with the receipt.`)
  }
}

export async function checkCrawlerBuild(directory) {
  const files = ['index.html', 'profile.json', 'portfolio.json', 'portfolio.md', 'llms.txt', 'sitemap.xml']
  const [html, json, alias, markdown, llms, sitemap] = await Promise.all(files.map(name => readFile(resolve(directory, name), 'utf8')))
  const profile = JSON.parse(json)
  assert.equal(alias, json, 'The previous JSON endpoint must serve the current profile.')
  assert.equal(profile.schemaVersion, 2)
  assert.ok(!('workFeed' in profile) && !('publicUpdates' in profile))
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/)?.[0]
  assert.ok(main, 'Actual portfolio content must be present without JavaScript.')
  assert.equal((main.match(/<h1\b/g) || []).length, 1)
  const records = [...profile.publicProjects.map(x => ({url: x.sourceUrl})), ...profile.upstreamContributions.selected, ...profile.credentialRecords, ...profile.directory.profiles, ...profile.writing, ...profile.platformRecords.kaggle.badges.filter(x => x.status === 'awarded')]
  for (const record of records) {
    const url = record.url || record.evidenceUrl
    assert.ok(main.includes(`href="${escapeHtml(url)}"`), `Raw HTML must retain the source ${url}`)
  }
  for (const project of profile.publicProjects.filter(item => item.liveUrl)) {
    assert.notEqual(project.liveUrl, project.sourceUrl, 'Live tools and source repositories have separate links.')
    assert.ok(main.includes(`href="${escapeHtml(project.liveUrl)}"`), `Raw HTML must expose the live tool: ${project.name}`)
    for (const text of [markdown, llms]) {
      assert.ok(text.includes(`](${project.liveUrl})`) && text.includes(`](${project.sourceUrl})`), `Text exports must expose both live and source links: ${project.name}`)
    }
  }
  const reportingExamples = profile.publicProjects.filter(project => project.liveUrl === reportLiveUrl)
  assert.equal(reportingExamples.length, 1, 'The public profile must discover the reporting example.')
  const reportingExample = reportingExamples[0]
  assert.equal(reportingExample.kind, 'public-example')
  assert.equal(reportingExample.sourceUrl, reportSourceUrl)
  assert.match(reportingExample.evidenceType, /synthetic/i, 'The profile must classify the proof as synthetic.')
  assert.match(reportingExample.evidence.scope, /fictional/i, 'The profile must retain the fictional-data boundary.')
  assert.equal((main.match(/id="csv-reporting-example"/g) || []).length, 1, 'The reporting example needs one unique homepage anchor.')
  const reportingArticle = main.match(/<article\b[^>]*\bid="csv-reporting-example"[^>]*>[\s\S]*?<\/article>/)?.[0] || ''
  for (const url of [reportLiveUrl, reportSourceUrl]) assert.ok(reportingArticle.includes(`href="${url}"`), `The reporting entry must link to ${url}`)
  assert.match(reportingArticle, /synthetic/i, 'The visible homepage entry must identify the synthetic proof.')
  for (const text of [markdown, llms]) {
    const reportingLine = text.split('\n').find(line => line.includes(`](${reportLiveUrl})`)) || ''
    assert.match(reportingLine, /synthetic/i, 'Text exports must identify the synthetic example.')
    assert.match(reportingLine, /fictional/i, 'Text exports must identify the fictional inputs.')
  }
  for (const record of [...profile.platformRecords.kaggle.badges.filter(x => x.status === 'awarded'), ...profile.platformRecords.kaggle.competitions]) {
    assert.ok(markdown.includes(record.checkedAt), 'Record check times must survive text export.')
  }
  for (const item of profile.writing) assert.ok(main.includes(escapeHtml(item.title)))
  const person = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1])
  assert.equal(person['@type'], 'Person')
  assert.equal(person.name, profile.identity.name)
  assert.ok(html.includes(`rel="canonical" href="${profile.canonicalUrl}"`))
  assert.ok(sitemap.includes(`<loc>${profile.canonicalUrl}</loc>`))
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url)
  assert.ok(sitemapUrls.includes(reportLiveUrl), 'The sitemap must discover the existing report HTML page.')
  for (const url of sitemapUrls) {
    const location = new URL(url)
    const canonical = new URL(profile.canonicalUrl)
    assert.equal(location.origin, canonical.origin, 'The sitemap must contain only owned portfolio pages.')
    assert.ok(location.pathname.startsWith(canonical.pathname))
    assert.ok(location.pathname.endsWith('/') || location.pathname.endsWith('.html'), 'The sitemap must omit CSV, JSON and other non-HTML artifacts.')
    const relative = location.pathname.slice(canonical.pathname.length)
    await readFile(resolve(directory, relative, location.pathname.endsWith('/') ? 'index.html' : ''))
  }
  assert.ok(llms.includes(`${profile.canonicalUrl}portfolio.md`))
  assert.ok(!/portfolio-app:start-->\s*<!--portfolio-app:end/.test(html))
  await checkReportingExample(directory)
  console.log(`Crawler check passed: ${profile.publicProjects.length} public projects, ${profile.upstreamContributions.selected.length} selected PRs, ${profile.credentialRecords.length} credentials, ${profile.directory.profiles.length} profiles, ${profile.writing.length} writing records, and dated Kaggle sources in real HTML/text.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await checkCrawlerBuild(fileURLToPath(new URL('../dist', import.meta.url)))
}
