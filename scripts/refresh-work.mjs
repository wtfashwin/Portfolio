import { readFile, writeFile, rename } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const cleanText = (value, limit = 300) => typeof value === 'string'
  ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, limit)
  : ''
const dateValue = (value) => {
  if (typeof value !== 'string' || !value.trim()) return null
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? date.toISOString() : null
}
const safeUrl = (value, hostnameCheck) => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password && hostnameCheck(url.hostname) ? url : null
  } catch { return null }
}
const githubUrl = (value) => safeUrl(value, (host) => host === 'github.com')
const mediumUrl = (value) => safeUrl(value, (host) => host === 'medium.com' || host.endsWith('.medium.com'))

// This intentionally uses public, unauthenticated sources. Response bodies and
// request headers are never copied into the public cache or its error messages.
async function request(url, { fetchImpl, timeoutMs, format }) {
  const controller = new AbortController()
  let timer
  const work = async () => {
    let response
    try {
      response = await fetchImpl(url, {
        signal: controller.signal,
        redirect: 'error',
        headers: format === 'json'
          ? { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'Ashwin-Portfolio-Refresh' }
          : { Accept: 'application/rss+xml, application/xml, text/xml' },
      })
    } catch {
      if (controller.signal.aborted) throw new Error('Source request timeout')
      throw new Error(`Network request unavailable from ${new URL(url).hostname}`)
    }
    if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).hostname}`)
    const text = await response.text()
    if (text.length > 2_000_000) throw new Error('Source response exceeds the public feed size limit')
    if (format === 'text') return text
    try { return JSON.parse(text) }
    catch { throw new Error(`Invalid JSON from ${new URL(url).hostname}`) }
  }
  try {
    return await Promise.race([
      work(),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          controller.abort()
          reject(new Error('Source request timeout'))
        }, timeoutMs)
      }),
    ])
  } finally {
    clearTimeout(timer)
    controller.abort()
  }
}

async function githubWork(profile, options) {
  const handle = profile.handle
  const profileUrl = githubUrl(profile.url)
  if (!/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(handle || '') || !profileUrl ||
      profileUrl.pathname.replace(/\/$/, '').toLowerCase() !== `/${handle.toLowerCase()}`) {
    throw new Error('GitHub URL does not match the verified profile handle')
  }
  // Read enough recent repositories to exclude upstream forks before selecting
  // a small public feed. This is one bounded page, not an exhaustive inventory.
  const reposUrl = `https://api.github.com/users/${encodeURIComponent(handle)}/repos?sort=pushed&direction=desc&per_page=50`
  const prsUrl = new URL('https://api.github.com/search/issues')
  prsUrl.searchParams.set('q', `author:${handle} is:pr is:merged`)
  prsUrl.searchParams.set('sort', 'updated')
  prsUrl.searchParams.set('order', 'desc')
  prsUrl.searchParams.set('per_page', String(options.limit))
  const [repos, prs] = await Promise.all([
    request(reposUrl, { ...options, format: 'json' }),
    request(prsUrl.href, { ...options, format: 'json' }),
  ])
  if (!Array.isArray(repos) || !Array.isArray(prs?.items) || typeof prs.incomplete_results !== 'boolean') {
    throw new Error('Unexpected GitHub API response shape')
  }
  if (prs.incomplete_results) throw new Error('GitHub search returned incomplete results')
  const items = []
  for (const repo of repos) {
    const url = githubUrl(repo.html_url)
    const occurredAt = dateValue(repo.pushed_at)
    if (repo.private !== false || repo.fork !== false || repo.owner?.login?.toLowerCase() !== handle.toLowerCase() || !url ||
        url.pathname.split('/')[1]?.toLowerCase() !== handle.toLowerCase() || !occurredAt || !cleanText(repo.full_name)) continue
    items.push({
      type: 'repository', title: cleanText(repo.full_name), url: url.href,
      occurredAt, dateKind: 'repository-pushed',
      ...(cleanText(repo.description) ? { summary: cleanText(repo.description) } : {}),
    })
  }
  for (const pr of prs.items) {
    const url = githubUrl(pr.html_url)
    if (pr.state !== 'closed' || !pr.pull_request || pr.user?.login?.toLowerCase() !== handle.toLowerCase() ||
        !url || !/^\/[^/]+\/[^/]+\/pull\/\d+$/.test(url.pathname) || !cleanText(pr.title)) continue
    const mergedAt = dateValue(pr.pull_request.merged_at)
    const occurredAt = mergedAt || dateValue(pr.updated_at)
    if (!occurredAt) continue
    items.push({
      type: 'merged-pr', title: cleanText(pr.title), url: url.href, occurredAt,
      // Search establishes merged state. Without an explicit merged_at field,
      // the available date is the last update, not the date of acceptance.
      dateKind: mergedAt ? 'merged' : 'last-updated',
    })
  }
  return { sourceUrls: [reposUrl, prsUrl.href], items }
}

const decodeXml = (value) => value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => {
    const point = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code)
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : ''
  })
  .replace(/&(amp|lt|gt|quot|apos);/g, (_, name) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[name])
const rssField = (block, name) => decodeXml(block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || '').trim()

async function rssWork(profile, options) {
  const handle = profile.handle
  const profileUrl = mediumUrl(profile.url)
  if (!/^[a-z\d_.-]+$/i.test(handle || '') || !profileUrl) throw new Error('RSS requires a verified Medium profile')
  const supportedProfile =
    (profileUrl.hostname === 'medium.com' && profileUrl.pathname.replace(/\/$/, '') === `/@${handle}`) ||
    (profileUrl.hostname === `${handle}.medium.com` && profileUrl.pathname === '/')
  const sourceUrl = profile.refresh.url || `https://medium.com/feed/@${handle}`
  if (!supportedProfile || ![`https://medium.com/feed/@${handle}`, `https://${handle}.medium.com/feed`].includes(sourceUrl)) {
    throw new Error('Feed URL does not match the verified Medium profile')
  }
  const xml = await request(sourceUrl, { ...options, format: 'text' })
  // Only the documented Medium RSS form is supported; challenge pages, Atom,
  // truncated XML, and entity declarations stay unavailable rather than empty.
  if (!/<rss\b[^>]*>/i.test(xml) || !/<channel\b[^>]*>/i.test(xml) || !/<\/channel>\s*<\/rss>\s*$/i.test(xml) ||
      /<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('Invalid or unsupported RSS response')
  const blocks = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)]
  if ((xml.match(/<item(?:\s|>)/gi) || []).length !== blocks.length) throw new Error('Incomplete RSS response')
  const items = blocks.map(([, block]) => {
    const title = cleanText(rssField(block, 'title').replace(/<[^>]*>/g, ''))
    const url = mediumUrl(rssField(block, 'link'))
    if (!title || !url) throw new Error('Malformed RSS article title or link')
    // Medium's RSS tracking parameter is not part of article identity. Removing
    // it avoids duplicate entries beside the verified writing baseline.
    url.searchParams.delete('source')
    url.hash = ''
    return { type: 'article', title, url: url.href, occurredAt: dateValue(rssField(block, 'pubDate')), dateKind: 'published' }
  })
  return { sourceUrls: [sourceUrl], items }
}

/**
 * Read recent public work from explicitly verified profiles. This returns data;
 * it does not edit badges, publish, schedule a job, or authenticate to a service.
 * A failed check retains its prior records and their successful fetchedAt.
 */
export async function pullLatestWork({
  profiles, previous = { platforms: [] }, fetchImpl = globalThis.fetch,
  now = new Date(), timeoutMs = 10_000, limit = 12,
} = {}) {
  if (!Array.isArray(profiles)) throw new TypeError('profiles must be an array')
  const checkedAt = new Date(now).toISOString()
  const options = { fetchImpl, timeoutMs: Math.max(1, Math.min(30_000, timeoutMs)), limit: Math.max(1, Math.min(50, Math.floor(limit))) }
  const platforms = await Promise.all(profiles.map(async (profile) => {
    const prior = previous.platforms?.find((entry) => entry.profileUrl === profile.url && entry.handle === profile.handle)
    const base = {
      platform: cleanText(profile.platform), profileUrl: profile.url, handle: profile.handle,
      checkedAt, fetchedAt: prior?.fetchedAt || null,
      sourceUrls: prior?.sourceUrls || [], items: prior?.items || [],
    }
    if (profile.status !== 'verified') return { ...base, status: 'unverified', fetchedAt: null, sourceUrls: [], items: [] }
    if (!profile.refresh || profile.refresh.type === 'manual') return { ...base, status: 'manual' }
    try {
      let result
      if (profile.refresh.type === 'github') result = await githubWork(profile, options)
      else if (profile.refresh.type === 'rss') result = await rssWork(profile, options)
      else return { ...base, status: 'manual' }
      const items = [...new Map(result.items.map((item) => [item.url, item])).values()]
        .sort((a, b) => (b.occurredAt || '').localeCompare(a.occurredAt || ''))
        .slice(0, options.limit)
      return { ...base, ...result, items, status: 'updated', fetchedAt: checkedAt }
    } catch (error) {
      return { ...base, status: 'unavailable', error: cleanText(error.message, 180) || 'Public source unavailable' }
    }
  }))
  return { schemaVersion: 1, refreshedAt: checkedAt, platforms }
}

async function runCli() {
  const project = fileURLToPath(new URL('..', import.meta.url))
  const output = resolve(project, 'src/work-feed.json')
  const manifest = JSON.parse(await readFile(resolve(project, 'src/platforms.json'), 'utf8'))
  let previous = { schemaVersion: 1, platforms: [] }
  try { previous = JSON.parse(await readFile(output, 'utf8')) }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  const result = await pullLatestWork({ profiles: manifest.profiles, previous })
  const temporary = resolve(dirname(output), `.work-feed-${process.pid}.json`)
  await writeFile(temporary, `${JSON.stringify(result, null, 2)}\n`)
  await rename(temporary, output)
  for (const entry of result.platforms) {
    console.log(`${entry.platform}: ${entry.status}; ${entry.items.length} cached items${entry.error ? `; ${entry.error}` : ''}`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await runCli()
