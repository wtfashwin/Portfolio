import test from 'node:test'
import assert from 'node:assert/strict'
import { pullLatestWork } from './refresh-work.mjs'

const checkedAt = '2026-10-08T17:00:00.000Z'
const github = {
  platform: 'GitHub', kind: 'code', handle: 'wtfashwin',
  url: 'https://github.com/wtfashwin', status: 'verified', refresh: { type: 'github' },
}
const medium = {
  platform: 'Medium', kind: 'writing', handle: 'ashwinupadhyay',
  url: 'https://medium.com/@ashwinupadhyay', status: 'verified',
  refresh: { type: 'rss', url: 'https://medium.com/feed/@ashwinupadhyay' },
}
const previous = {
  schemaVersion: 1,
  platforms: [{
    platform: 'GitHub', profileUrl: github.url, handle: 'wtfashwin', status: 'updated',
    checkedAt: '2026-10-07T12:00:00.000Z', fetchedAt: '2026-10-07T12:00:00.000Z',
    items: [{ type: 'repository', title: 'Earlier project', url: 'https://github.com/wtfashwin/earlier', occurredAt: '2026-10-07T10:00:00.000Z' }],
  }],
}
const repo = {
  id: 123, name: 'ContextDock', full_name: 'wtfashwin/ContextDock',
  html_url: 'https://github.com/wtfashwin/ContextDock', private: false, fork: false,
  description: 'A local macOS developer tool.', owner: { login: 'wtfashwin' },
  pushed_at: '2026-10-08T16:30:00Z', updated_at: '2026-10-08T16:30:00Z',
}
const pr = {
  id: 456, number: 22035, title: 'Allow Azure results to be overwritten',
  html_url: 'https://github.com/PrefectHQ/prefect/pull/22035',
  state: 'closed', user: { login: 'wtfashwin' },
  updated_at: '2026-10-08T16:40:00Z', closed_at: '2026-10-08T16:35:00Z',
  pull_request: { url: 'https://api.github.com/repos/PrefectHQ/prefect/pulls/22035', merged_at: '2026-10-08T16:35:00Z' },
}

// Dropping domain/author/privacy validation would publish unrelated or private records.
test('refreshes only public GitHub work belonging to the verified handle', async () => {
  const result = await pullLatestWork({ profiles: [github], previous, now: checkedAt,
    fetchImpl: async (url) => {
      const request = new URL(url)
      if (request.pathname === '/users/wtfashwin/repos') {
        return Response.json([
          repo,
          { ...repo, full_name: 'wtfashwin/private', html_url: 'https://github.com/wtfashwin/private', private: true },
          { ...repo, full_name: 'wtfashwin/foreign-owner', html_url: 'https://github.com/wtfashwin/foreign-owner', owner: { login: 'other' } },
          { ...repo, full_name: 'wtfashwin/upstream-fork', html_url: 'https://github.com/wtfashwin/upstream-fork', fork: true },
        ])
      }
      if (request.pathname === '/search/issues' && request.searchParams.get('q') === 'author:wtfashwin is:pr is:merged') {
        return Response.json({ total_count: 2, incomplete_results: false, items: [pr, {
          ...pr, html_url: 'https://github.com/PrefectHQ/prefect/pull/22036', user: { login: 'other' },
        }] })
      }
      throw new Error('Unexpected public API request')
    },
  })
  const entry = result.platforms[0]
  assert.equal(entry.status, 'updated')
  assert.equal(entry.fetchedAt, checkedAt)
  assert.equal(entry.items.length, 2)
  assert.equal(entry.items[0].type, 'merged-pr')
  assert.equal(entry.items[0].url, 'https://github.com/PrefectHQ/prefect/pull/22035')
  assert.equal(entry.items[0].occurredAt, '2026-10-08T16:35:00.000Z')
  assert.equal(entry.items[1].title, 'wtfashwin/ContextDock')
})

// Replacing good cached evidence or advancing fetchedAt on a failed check would hide stale data.
for (const [name, response] of [
  ['HTTP block', () => new Response('Blocked', { status: 403 })],
  ['invalid JSON', () => new Response('<html>challenge</html>', { headers: { 'content-type': 'application/json' } })],
  ['incomplete search', () => Response.json({ total_count: 100, incomplete_results: true, items: [pr] })],
]) test(`preserves the successful cache and its timestamp after ${name}`, async () => {
  const result = await pullLatestWork({ profiles: [github], previous, now: checkedAt,
    fetchImpl: async (url) => new URL(url).pathname.endsWith('/repos') ? Response.json([repo]) : response(),
  })
  const entry = result.platforms[0]
  assert.equal(entry.status, 'unavailable')
  assert.equal(entry.checkedAt, checkedAt)
  assert.equal(entry.fetchedAt, '2026-10-07T12:00:00.000Z')
  assert.deepEqual(entry.items, previous.platforms[0].items)
  assert.ok(entry.error)
})

// Scraping manual profiles or inferred/unverified handles would manufacture ownership evidence.
test('leaves manual and unverified platforms alone', async () => {
  const result = await pullLatestWork({
    profiles: [{ ...github, status: 'unverified' }, { ...medium, refresh: { type: 'manual' } }],
    now: checkedAt,
    fetchImpl: async () => { throw new Error('Must not fetch this profile') },
  })
  assert.deepEqual(result.platforms.map((entry) => entry.status), ['unverified', 'manual'])
  assert.deepEqual(result.platforms.map((entry) => entry.fetchedAt), [null, null])
})

// Trusting a supplied URL without checking the provider could issue arbitrary network requests.
test('rejects a feed URL outside the verified Medium profile', async () => {
  const result = await pullLatestWork({
    profiles: [{ ...medium, refresh: { type: 'rss', url: 'https://unrelated.example/feed' } }],
    now: checkedAt, fetchImpl: async () => { throw new Error('Unsafe URL was fetched') },
  })
  assert.equal(result.platforms[0].status, 'unavailable')
  assert.equal(result.platforms[0].items.length, 0)
  assert.match(result.platforms[0].error, /verified|profile|feed/i)
})

// Copying RSS HTML or invalid dates into the cache would create junk content or false chronology.
test('reads public Medium RSS titles and dates as plain public facts', async () => {
  const xml = `<?xml version="1.0"?><rss version="2.0"><channel><title>Ashwin</title><item>
    <title><![CDATA[Retrieval &amp; <strong>evaluation</strong>]]></title>
    <link>https://medium.com/@ashwinupadhyay/retrieval-example?source=rss-example</link>
    <pubDate>Thu, 08 Oct 2026 16:45:00 GMT</pubDate>
    <description><![CDATA[<p>Do not publish the full article body.</p>]]></description>
  </item></channel></rss>`
  const result = await pullLatestWork({ profiles: [medium], now: checkedAt,
    fetchImpl: async () => new Response(xml, { headers: { 'content-type': 'application/rss+xml' } }),
  })
  const entry = result.platforms[0]
  assert.equal(entry.status, 'updated')
  assert.deepEqual(entry.items, [{
    type: 'article', title: 'Retrieval & evaluation',
    url: 'https://medium.com/@ashwinupadhyay/retrieval-example',
    occurredAt: '2026-10-08T16:45:00.000Z', dateKind: 'published',
  }])
})

// Removing the timeout would let a provider stall the entire manual refresh.
test('reports a timeout while retaining the prior platform data', async () => {
  const result = await pullLatestWork({ profiles: [github], previous, now: checkedAt, timeoutMs: 5,
    fetchImpl: async () => new Promise(() => {}),
  })
  assert.equal(result.platforms[0].status, 'unavailable')
  assert.deepEqual(result.platforms[0].items, previous.platforms[0].items)
  assert.match(result.platforms[0].error, /timeout/i)
})

test('a malformed RSS article preserves the last successful feed', async () => {
  const prior = { platforms: [{ platform: 'Medium', profileUrl: medium.url, handle: medium.handle,
    fetchedAt: '2026-10-07T12:00:00.000Z', items: [{ type: 'article', title: 'Saved article', url: 'https://medium.com/@ashwinupadhyay/saved' }] }] }
  const result = await pullLatestWork({ profiles: [medium], previous: prior, now: checkedAt,
    fetchImpl: async () => new Response('<rss><channel><item><title>Broken article</title><link>invalid</link></item></channel></rss>'),
  })
  assert.equal(result.platforms[0].status, 'unavailable')
  assert.equal(result.platforms[0].fetchedAt, prior.platforms[0].fetchedAt)
  assert.deepEqual(result.platforms[0].items, prior.platforms[0].items)
})
