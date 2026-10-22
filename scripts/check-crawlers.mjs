import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[c]))

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
  for (const record of [...profile.platformRecords.kaggle.badges.filter(x => x.status === 'awarded'), ...profile.platformRecords.kaggle.competitions]) {
    assert.ok(markdown.includes(record.checkedAt), 'Record check times must survive text export.')
  }
  for (const item of profile.writing) assert.ok(main.includes(escapeHtml(item.title)))
  const person = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1])
  assert.equal(person['@type'], 'Person')
  assert.equal(person.name, profile.identity.name)
  assert.ok(html.includes(`rel="canonical" href="${profile.canonicalUrl}"`))
  assert.ok(sitemap.includes(`<loc>${profile.canonicalUrl}</loc>`))
  assert.ok(llms.includes(`${profile.canonicalUrl}portfolio.md`))
  assert.ok(!/portfolio-app:start-->\s*<!--portfolio-app:end/.test(html))
  console.log(`Crawler check passed: ${profile.publicProjects.length} public projects, ${profile.upstreamContributions.selected.length} selected PRs, ${profile.credentialRecords.length} credentials, ${profile.directory.profiles.length} profiles, ${profile.writing.length} writing records, and dated Kaggle sources in real HTML/text.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await checkCrawlerBuild(fileURLToPath(new URL('../dist', import.meta.url)))
}
